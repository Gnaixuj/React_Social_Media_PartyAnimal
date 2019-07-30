const functions = require('firebase-functions');

const express = require('express'); // npm install --save express
const app = express();

// Imports
const { getScreams, 
        postScream, 
        get1Scream, 
        postComment, 
        likeScream, 
        unlikeScream, 
        deleteScream } = require('./handlers/screams');
const { signUp, 
        login, 
        uploadProfileImg, 
        addUserDetails, 
        getUserDetails, 
        getUserDetailsPublic, 
        markReadNotification } = require('./handlers/users');
const { FBAuth } = require('./utilities/auth');
const { db } = require('./utilities/admin');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// Scream Routes:
// GET All Screams Route
app.get('/getscreams', getScreams);
// POST 1 Scream Route (just need to post a body)        
app.post('/postscream', FBAuth, postScream); // express allow a 2nd argument (a function) to any route
// DELETE Scream
app.delete('/scream/:screamId', FBAuth, deleteScream);
// GET A Particular Scream
app.get('/scream/:screamId', get1Scream); // : tells application that this is a route parameter
// POST Comment
app.post('/scream/:screamId/comment', FBAuth, postComment);
// GET Like Scream
app.get('/scream/:screamId/like', FBAuth, likeScream);
// GET Unlike Scream
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream);

// User Routes:
// POST Sign Up Route
app.post('/signup', signUp);
// POST Login Route
app.post('/login', login);
// POST Upload Profile Pic Route (doesn't work on deploy)
app.post('/user/image', FBAuth, uploadProfileImg) // FBAUth required as it's a protected route (only user can upload)
// POST Add User Details
app.post('/user', FBAuth, addUserDetails);
// GET Autenticated User Details
app.get('/user', FBAuth, getUserDetails);
// GET Allow Other Users to View Selected Details
app.get('/user/:handle', getUserDetailsPublic);
// POST Change Read Notification to True
app.post('/notifications', FBAuth, markReadNotification);

exports.api = functions.https.onRequest(app); // we want it to be in the form https://baseurl.com/api/ 
                                              //(we might have our own website in the base url)

exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
    .onCreate((snapshot) => { // snapshot of document (not saved)
        db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then(doc => {
                if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) { // ensure no noti if user like own scream
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'like',
                        read: false,
                        screamId: doc.id
                    });
                }
                return;
            })
            .catch(err => {
                console.error(err);
                return;
            });
    });

exports.deleteNotificationOnUnlike = functions.firestore.document('likes/{id}')
    .onDelete((snapshot) => { // snapshot of document (not saved)
        return db.doc(`/notifications/${snapshot.id}`).delete()
            .catch(err => {
                console.error(err);
                return;
            });
    });

exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
    .onCreate((snapshot) => {
        db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then(doc => {
                if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'comment',
                        read: false,
                        screamId: doc.id
                    });
                }
                return;
            })
            .catch(err => {
                console.error(err);
                return;
            });
    });

// When User Change their Profile Pics, All Profile Pics of Past Scream will be Updated with New Image
exports.onUserImageChange = functions.firestore.document('/users/{id}')
    .onUpdate((change) => {
        console.log(change.before.data()); // TBR
        console.log(change.after.data()); // TBR

        if (change.before.data().imageUrl !== change.after.data().imageUrl) {
            let batch = db.batch(); // batch write
            return db.collection('screams')
                .where('userHandle', '==', change.before.data().handle).get()
                    .then(data => {
                        data.forEach(doc => {
                            const screams = db.doc(`/screams/${doc.id}`);
                            batch.update(screams, { userImage: change.after.data().imageUrl });
                        });
                        return db.collection('comments')
                            .where('userHandle', '==', change.before.data().handle).get();
                    })
                    .then(data => {
                        data.forEach(doc => {
                            const comments = db.doc(`/comments/${doc.id}`);
                            batch.update(comments, { userImage: change.after.data().imageUrl });
                        });
                        return batch.commit();
                    })
                    .catch(err => {
                        console.error(err);
                        return;
                    });
        }
        else { return; }          
    });

// If a Scream is Deleted, All Corresponding Comments, Likes, Notifications will be Deleted
exports.onScreamDelete = functions.firestore.document('/screams/{screamId}')  // corresponds
    .onDelete((snapshot, context) => { // context has the parameters
        console.log(snapshot); // TBR
        console.log(context); // TBR
        const screamId = context.params.screamId;                             // screamId
        let batch = db.batch();
        return db.collection('comments')
            .where('screamId', '==', screamId).get()
                .then(data => {
                    data.forEach(doc => {
                        const comments = db.doc(`/comments/${doc.id}`);
                        batch.delete(comments);
                    });
                    return db.collection('likes')
                        .where('screamId', '==', screamId).get();
                })
                .then(data => {
                    data.forEach(doc => {
                        const likes = db.doc(`/likes/${doc.id}`);
                        batch.delete(likes);
                    });
                    return db.collection('notifications')
                        .where('screamId', '==', screamId).get();
                })
                .then(data => {
                    data.forEach(doc => {
                        const notifications = db.doc(`/notifications/${doc.id}`);
                        batch.delete(notifications);
                    })
                    return batch.commit();
                })
                .catch(err => {
                    console.error(err);
                    return;
                });
    });
