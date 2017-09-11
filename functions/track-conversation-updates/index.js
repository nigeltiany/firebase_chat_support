const functions = require('firebase-functions');
const admin = require('firebase-admin');

module.exports = functions.database.ref('messages/{User_ID}/{Message_ID}').onUpdate((event) => {
    if(event.data.hasChild('conversation_id')){
        return admin.database().ref('user_conversations')
            .child(event.params.User_ID)
            .child(event.data.val().conversation_id)
            .update({
                priority: 1 - Date.now(),
                updatedAt: Date.now()
            })
    }
})