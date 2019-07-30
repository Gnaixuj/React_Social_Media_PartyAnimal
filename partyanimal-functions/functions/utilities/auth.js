const { admin, db } = require('./admin');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Check If User is Logged In & Automatically Sets the User Handle/Image When User Post a Scream (bearer)
exports.FBAuth = (request, response, next) => {
    let idToken;
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
        idToken = request.headers.authorization.split('Bearer ')[1]; // [0]: 'Bearer '; [1] - rest of the string (token)
    }
    else {
        console.error('No Token Found');
        return response.status(403).json({ error: 'Unauthorized' });
    }

    admin.auth().verifyIdToken(idToken) // check if this token is issued by our application 
        .then(decodedToken => {
            request.user = decodedToken; // this does not contain the user handle (it's stored in the db)
            return db.collection('users')
                .where('userId', '==', request.user.uid)
                .limit(1) // limits results to just 1 document
                .get(); 
        })  
        .then(data => { // data - array with 1 element
            request.user.handle = data.docs[0].data().handle;
            request.user.imageUrl = data.docs[0].data().imageUrl;
            return next(); // allow request to proceed to the routes
        })
        .catch(err => {
            console.error('Error While Verifying Token ', err);
            return response.status(403).json(err);
        });
};