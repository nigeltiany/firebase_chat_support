const functions = require('firebase-functions');
const admin = require('firebase-admin');

module.exports = functions.database.ref('messages/{User_ID}/{Message_ID}').onUpdate((createdMessage, context) => {
    if(Object.keys(createdMessage.after.val()).indexOf('conversation_id') > -1){
        return admin.database().ref('user_conversations')
            .child(context.params.User_ID)
            .child(createdMessage.after.val().conversation_id)
            .child('messages').update({ [context.params.Message_ID]: true }).then(() => {
                let now = Date.now()
                return admin.database().ref('user_conversations/' + context.params.User_ID + '/' + createdMessage.after.val().conversation_id)
                    .update({
                        priority: 0 - now,
                        updatedAt: now
                    })
            })
    }
})
