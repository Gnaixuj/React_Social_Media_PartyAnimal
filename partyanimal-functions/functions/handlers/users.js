const { admin, db } = require('../utilities/admin');
const { isEmpty, isEmail, validateSignUp, validateLogin, reduceUserDetails } = require('../utilities/validators');

const { firebaseConfig } = require('../utilities/config');

const firebase = require('firebase'); // npm install --save firebase
firebase.initializeApp(firebaseConfig);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.signUp = (request, response) => { 
    const newUser = {
        email: request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        handle: request.body.handle
    };

    // Validate Data 
    const { valid, errors } = validateSignUp(newUser); // desturcturing
    if (!valid) {
        return response.status(400).json(errors);
    }

    // Setting Default Profile Img
    const noImg = 'default-profile-img.png';

    let token, userId;
    db.doc(`/users/${newUser.handle}`).get() // .doc - a particular item
    .then(doc => { // even if doc doesn't exist, we still have a snapshot (need conditional statements)
        if (doc.exists) { // to make sure no repeated handle
            return response.status(400).json({ handle: 'This Handle is Already Taken' }); // handle: (whichever item has the error) 
        }
        else {
            return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
    }) // user is created 
    .then(data => { // i want to now return a authentication token to user, for user to use it later to request more data
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then(idToken => {
        token = idToken;
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            userId,
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`
        };
        return db.doc(`/users/${newUser.handle}`).set(userCredentials); // create a new document in db user
    })
    .then(() => {
        return response.status(201).json({ token });
    })
    .catch(err => {
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
            return response.status(400).json({ email: 'Email is Already in Use' });
        }
        else {
            return response.status(500).json({ general: 'Something Went Wrong, Please Try Again' });
        }
    });
};

exports.login = (request, response) => {
    const user = {
        email: request.body.email,
        password: request.body.password
    };

    // Vaildate Data 
    const { valid, errors } = validateLogin(user); // desturcturing
    if (!valid) {
        return response.status(400).json(errors);
    }

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(idToken => {
            return response.json({ idToken });
        })
        .catch(err => {
            console.error(err);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                return response.status(403).json({ general: 'Wrong Credentials, Please Try Again' });
            }
            else {
                return response.status(500).json({ error: err.code });
            }
        });
};

exports.uploadProfileImg = (request, response) => {
    const busboy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs'); // filesystem

    const busBoy = new busboy({ headers: request.headers });
    
    let imageName;
    let imageToBeUploaded = {};

    busBoy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        // console.log(fieldname); // TBR
        // console.log(filename); // TBR
        // console.log(mimetype); // TBR

        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
            return response.status(400).json({ error: 'Wrong File Type Submitted' });
        }

        const imageExtension = filename.split('.')[filename.split('.').length - 1]; // eg: my.image.png (saves the .png); -ve index does not work for JS
        imageName = `${Math.floor(Math.random() * 1000000000)}.${imageExtension}`; // TODO: better way of naming
        const filePath = path.join(os.tmpdir(), imageName);
        imageToBeUploaded = {filePath, mimetype};  // object is created
        file.pipe(fs.createWriteStream(filePath)); // file is created
    });

    // https://googleapis.dev/nodejs/storage/latest/Bucket.html#upload
    // https://googleapis.dev/nodejs/storage/latest/global.html#UploadOptions
    // https://cloud.google.com/storage/docs/json_api/v1/objects/insert#request_properties_JSON
    busBoy.on('finish', () => { // 'finish' is an event
        admin.storage().bucket().upload(imageToBeUploaded.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            // construct imageUrl to add it to our user 
            // (alt=media needed to just show on browser, otherwise image will be downloaded)
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageName}?alt=media`;
            return db.doc(`/users/${request.user.handle}`).update({ imageUrl }); // request.user.handle comes from the FBAuth
                                                                                 // .update({ field: value }) - in this case is { imageUrl: imageUrl }            
        })
        .then(() => {
            return response.json({ message: 'Image Uploaded Successfully' });
        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: err.code }); 
        });
    });

    busBoy.end(request.rawBody);
};

exports.addUserDetails = (request, response) => {
    let userDetails = reduceUserDetails(request.body);

    db.doc(`/users/${request.user.handle}`).update(userDetails)
        .then(() => {
            return response.json({ message: 'Details Added Successfully' });
        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};

exports.getUserDetails = (request, response) => {
    let userData = {};

    db.doc(`/users/${request.user.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                userData.credentials = doc.data();
                return db.collection('likes')
                    .where('userHandle', '==', request.user.handle)
                    .get();
            }
            else {
                return response.status(404).json({ error: 'User Not Found' });
            }
        })
        .then(data => { // data - screams you liked
            userData.likes = [];
            data.forEach(doc => {
                userData.likes.push(doc.data());
            });
            return db.collection('notifications')
                .where('recipient', '==', request.user.handle)
                .orderBy('createdAt', 'desc')
                .limit(10)
                .get();
        })
        .then(data => {
            userData.notifications = [];
            data.forEach(doc => {
                userData.notifications.push({
                    recipient: doc.data().recipient,
                    sender: doc.data().sender,
                    read: doc.data().read,
                    createdAt: doc.data().createdAt,
                    screamId: doc.data().screamId,
                    type: doc.data().type,
                    notificationId: doc.id
                });
            });
            return response.json(userData);
        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};

exports.getUserDetailsPublic = (request, response) => {
    let userData = {};

    db.doc(`/users/${request.params.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                userData.user = doc.data();
                return db.collection('screams')
                    .where('userHandle', '==', request.params.handle)
                    .orderBy('createdAt', 'desc')
                    .get();
            }
            else {
                return response.status(404).json({ error: 'User Not Found' });
            }
        })
        .then(data => {
            userData.screams = [];
            data.forEach(doc => {
                userData.screams.push({
                    body: doc.data().body,
                    createdAt: doc.data().createdAt,
                    userHandle: doc.data().userHandle,
                    userImage: doc.data().userImage,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount,
                    screamId: doc.id,
                });
            });
            return response.json(userData);
        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
}; 

exports.markReadNotification = (request, response) => {
    // Batch Write
    let batch = db.batch();

    request.body.forEach(notificationId => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, { read: true });
    });
    batch.commit()
        .then(() => {
            return response.json({ message: 'Notification(s) Read'} );
        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};

// To Check:
// auth/invalid-email