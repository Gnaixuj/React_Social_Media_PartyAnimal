const admin = require('firebase-admin');

const serviceAccount = require('../partyanimal-a0fbf-firebase-adminsdk-stb8a-3cae3e4693.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://partyanimal-a0fbf.firebaseio.com"
  });

const db = admin.firestore();

module.exports = { admin, db };
