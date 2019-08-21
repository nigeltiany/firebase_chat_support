const functions = require('firebase-functions');

const admin = require('firebase-admin');

const generate_uid = require('../guid')

module.exports = functions.database.ref('/messages/{User_ID}/{Message_ID}').onCreate((createdMessage, context) => {

    /**
     * Stop messages that do not need an initial copy
     * That is: Welcome messages to a new user which an agent does not need a copy of
     */
    if(createdMessage.val().auto){
        return
    }

    /**
     * Stop Recursive Messages from Message replies created by this function
     */
    if(createdMessage.val().__response){
        return
    }
    else {
        return admin.database().ref('/messages/' + context.params.User_ID + '/' + context.params.Message_ID)
            .update({ sentAt: Date.now(), delivered: false }).then(() => {

                // New Message
                if (!createdMessage.hasChild('conversation_id')) {
                    const conversation_id = generate_uid()
                    return admin.database().ref('/messages/' + context.params.User_ID + '/' + context.params.Message_ID)
                        .update({ conversation_id: conversation_id })
                        .then(()=>{
                            let queued = createdMessage.val().to === null || undefined
                            return admin.database().ref('conversations/').child(conversation_id).set({
                                members: [context.params.User_ID, !queued ? createdMessage.val().to : null],
                            }).then(() => {
                                if(queued) {
                                    return admin.database().ref('help_queue/').push()
                                        .set(Object.assign({}, createdMessage.val(), {createdAt: Date.now()}))
                                }
                            })
                        })
                }
                // A message reply
                else {
                    return admin.database().ref('/conversations/' + createdMessage.val().conversation_id).once('value', (conversation) => {
                        conversation.val().member_uids.map((recipient_id) => {
                            // User already has a copy of the message they sent
                            if(recipient_id === context.params.User_ID){
                                // updates only
                                return admin.database().ref('messages/' + context.params.User_ID + '/' + context.params.Message_ID)
                                    .update({ participants: conversation.val().members })
                            }
                            // Write the reply to each recipient.
                            return admin.database().ref('messages/' + recipient_id).push().set(
                                Object.assign({},
                                    createdMessage.val(),
                                    {
                                        deliveredAt: Date.now(),
                                        participants: conversation.val().members
                                    },
                                    //__response MUST be set to true to avoid recursion
                                    {
                                        __response: true
                                    }
                                )
                            )
                        })
                    }).then(() => {
                        // Update delivered status
                        return admin.database().ref('/messages/' + context.params.User_ID + '/' + context.params.Message_ID)
                            .update({ delivered: true, deliveredAt: Date.now() })
                    })
                }

            })
    }
})
