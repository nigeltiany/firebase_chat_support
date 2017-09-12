const functions = require('firebase-functions');
const admin = require('firebase-admin');

module.exports = functions.database.ref('messages/{User_ID}/{Message_ID}').onUpdate((event) => {
    if(event.data.hasChild('conversation_id')){
        return admin.database().ref('user_conversations')
            .child(event.params.User_ID)
            .child(event.data.val().conversation_id)
            .child('messages').update({ [event.params.Message_ID]: true }).then(() => {
                let now = Date.now()
                return admin.database().ref('user_conversations/' + event.params.User_ID + '/' + event.data.val().conversation_id)
                    .update({
                        priority: 0 - now,
                        updatedAt: now
                    })
            })
    }
})