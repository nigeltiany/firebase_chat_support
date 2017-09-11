const functions = require('firebase-functions');
const admin = require('firebase-admin');

module.exports = functions.database.ref('messages/{User_ID}/{Message_ID}/conversation_id').onCreate((event) => {
    return admin.database().ref('user_conversations')
        .child(event.params.User_ID)
        .child(event.data.val())
        .child('messages').update({ [event.params.Message_ID]: true }).then(() => {
            let now = Date.now()
            return admin.database().ref('user_conversations/' + event.params.User_ID + '/' + event.data.val())
                .update({
                    priority: 1 - now,
                    updatedAt: now
                })
        })
})