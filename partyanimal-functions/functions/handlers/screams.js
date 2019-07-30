const { db } = require('../utilities/admin');
const { isEmpty } = require('../utilities/validators');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.getScreams = (request, response) => {
    db.collection('screams').orderBy('createdAt', 'desc').get() // orderBy used to sort by time
        .then(data => {
            let screams = [];
            data.forEach(doc => { // data - represents the entire collection of screams
                screams.push({
                    screamId: doc.id, // for use later
                    body: doc.data().body,  // cannot use ...doc.data() (not supported yet)
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt,
                    commentCount: doc.data().commentCount,
                    likeCount: doc.data().likeCount,
                    userImage: doc.data().userImage
                });
            });
            return response.json(screams);
        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};

exports.postScream = (request, response) => { // FBAuth already authenticate; we have access to request.user
    if (isEmpty(request.body.body)) {
        return response.status(400).json({ body: 'Body Must Not Be Empty'});
    }
    
    const newScream = {
        userHandle: request.user.handle, // instead of request.body.handle (FBAuth)
        body: request.body.body, // 1st body - body of request; 2nd body - property in the body of the request
        createdAt: new Date().toISOString(),
        userImage: request.user.imageUrl,
        likeCount: 0,
        commentCount: 0
    };

    db.collection('screams').add(newScream)
        .then(doc => { // doc - represents that particular item that is added
            newScream.screamId = doc.id;
            return response.json(newScream);
        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};

exports.deleteScream = (request, response) => {
    const screamDoc = db.doc(`/screams/${request.params.screamId}`);
    
    screamDoc.get()
        .then(doc => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'Scream Not Found' });
            }
            if (doc.data().userHandle === request.user.handle) {
                // Check If User Deleting is the Same as the User Who Posted the Scream
                screamDoc.delete();
                return response.json({ message: 'Scream Deleted Successfully' });
            }
            else {
                return response.status(404).json({ error: 'Unauthorised' });
            }
        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};
 
exports.get1Scream = (request, response) => {
    let screamData;
    db.doc(`/screams/${request.params.screamId}`).get() // params - parameters (which is the portion after : in index.js)
        .then(doc => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'Scream Not Found' });
            }
            screamData = doc.data();
            screamData.screamId = doc.id;
            return db.collection('comments').orderBy('createdAt', 'desc')
                .where('screamId', '==', request.params.screamId)
                .get();
        })
        .then(data => {
            screamData.comments = [];
            data.forEach(doc => {
                screamData.comments.push(doc.data());
            });
            return response.json(screamData);
        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};

exports.postComment = (request, response) => {
    // Validate 
    if (isEmpty(request.body.body)) {
        return response.status(400).json({ comment: 'Must Not Be Empty'});
    }

    // Create
    const newComment = {
        body: request.body.body,
        createdAt: new Date().toISOString(),
        screamId: request.params.screamId,
        userHandle: request.user.handle,
        userImage: request.user.imageUrl
    };

    db.doc(`/screams/${request.params.screamId}`).get()
        .then(doc => {
            if (!doc.exists) { // Check If Scream Exist
                return response.status(404).json({ error: 'Scream Not Found' });
            }
            else {
                return doc.ref.update({ commentCount: doc.data().commentCount + 1 }); // to undo the .get() 
            }
        })
        .then(() => {
            return db.collection('comments').add(newComment);
        })
        .then(() => {
            return response.json(newComment);
        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};

exports.likeScream = (request, response) => {
    const likeDoc = db.collection('likes')
                        .where('userHandle', '==', request.user.handle)
                        .where('screamId', '==', request.params.screamId)
                        .limit(1);

    const screamDoc = db.doc(`screams/${request.params.screamId}`);

    let screamData;

    // Check If Scream Exists
    screamDoc.get()
        .then(doc => {
            if (doc.exists) {
                screamData = doc.data();
                screamData.screamId = doc.id;
                return likeDoc.get();
            }
            else {
                return response.status(404).json({ error: 'Scream Not Found' });
            }
        })
        .then(data => {
            if (data.empty) { // no like currently
                return db.collection('likes').add({
                    screamId: request.params.screamId,
                    userHandle: request.user.handle
                })
                .then(() => { // nested then, else likeCount will increment even if data is not empty
                    screamData.likeCount++; 
                    return screamDoc.update({ likeCount: screamData.likeCount });
                })
                .then(() => {
                    return response.json(screamData);
                })
            }
            else {
                return response.status(400).json({ error: 'Scream Already Liked'}); // TODO: Unlike the Comment?
            }
        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};

exports.unlikeScream = (request, response) => {
    const likeDoc = db.collection('likes')
                        .where('userHandle', '==', request.user.handle)
                        .where('screamId', '==', request.params.screamId)
                        .limit(1);

    const screamDoc = db.doc(`screams/${request.params.screamId}`);

    let screamData;

    // Check If Scream Exists
    screamDoc.get()
        .then(doc => {
            if (doc.exists) {
                screamData = doc.data();
                screamData.screamId = doc.id;
                return likeDoc.get();
            }
            else {
                return response.status(404).json({ error: 'Scream Not Found' });
            }
        })
        .then(data => {
            if (!data.empty) { 
                db.doc(`/likes/${data.docs[0].id}`).delete()
                    .then(() => {
                        screamData.likeCount--;
                        return screamDoc.update({ likeCount: screamData.likeCount });
                    })
                    .then(() => {
                        return response.json(screamData);
                    })
            }
            else {
                return response.status(400).json({ error: 'Scream Not Liked'}); // TODO: Unlike the Comment?
            }
        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};