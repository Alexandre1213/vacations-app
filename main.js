const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
var firebase = require("firebase");

var cors = require('cors')
app.use(cors());

var config = {
    apiKey: process.env.FB_API_KEY,
    authDomain: process.env.FB_AUTH_DOMAIN,
    databaseURL: process.env.FB_DB_URL,
    projectId: process.env.FB_PROJECT_ID,
    storageBucket: process.env.FB_STORAGE_BUCKET,
    messagingSenderId: process.env.FB_MSG_SENDER_ID 
};
firebase.initializeApp(config);
var database = firebase.database();

function writeUserData(userId, data) {
    database.ref('users/' + userId).set({
      data: data
    });
}

app.get(/\/[0-9]{6}/gm, (req, res) => {
    // GET from FireBase
    
});

app.post(/\/[0-9]{6}/gm, (req, res) => {
    // POST to FireBase
    
});

app.listen(port, () => console.log(`Starting server on port ${port} !`));