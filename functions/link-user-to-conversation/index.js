const functions = require('firebase-functions');
const admin = require('firebase-admin');

module.exports = functions.database.ref('messages/{User_ID}/{Message_ID}/conversation_id').onCreate((event) => {
    return admin.database().ref('user_conversations').child(event.params.User_ID).push({ conversation_id: event.data.val() })
})