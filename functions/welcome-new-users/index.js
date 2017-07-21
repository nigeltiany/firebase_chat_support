const functions = require('firebase-functions');

const admin = require('firebase-admin');

module.exports = functions.database.ref('/users/{userID}').onCreate(event => {
    return admin.database().ref('/messages/' + event.params.userID).set({
        title: 'Welcome to Lawn Care',
        sender: "Nigel Tiany",
        senderID: "SomeID_ndjnkoieoan",
        message: "Welcome to lawn care"
    })
})
