const functions = require('firebase-functions');

const admin = require('firebase-admin');

const assign_user_customer_support = require('../assign-user-to-customer-support')

module.exports = functions.database.ref('/users/{userID}').onCreate(event => {

    var available_agent = assign_user_customer_support()

    console.log(available_agent)

    return admin.database().ref('/messages/' + event.params.userID).set({
        title: 'Welcome to Lawn Care',
        sender: "Nigel Tiany",
        senderID: "SomeID_ndjnkoieoan",
        message: "Welcome to lawn care",
        recipients: [event.params.userID] // + senderID
    })
})
