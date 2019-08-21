const functions = require('firebase-functions');
const admin = require('firebase-admin');

module.exports = functions.database.ref('messages/{User_ID}/{Message_ID}/conversation_id').onCreate((createdConversation, context) => {
    return admin.database().ref('user_conversations')
        .child(context.params.User_ID)
        .child(createdConversation.val())
        .child('messages').update({ [context.params.Message_ID]: true }).then(() => {
            let now = Date.now()
            return admin.database().ref('user_conversations/' + context.params.User_ID + '/' + createdConversation.val())
                .update({
                    priority: 1 - now,
                    updatedAt: now
                })
        })
})
