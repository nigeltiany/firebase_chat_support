const functions = require('firebase-functions');

const admin = require('firebase-admin');

const generate_uid = require('../guid')

module.exports = functions.database.ref('/messages/{User_ID}/{Message_ID}').onCreate(event => {

    /**
     * Stop messages that do not need an initial copy
     * That is: Welcome messages to a new user which an agent does not need a copy of
     */
    if(event.data.val().auto){
        return
    }

    /**
     * Stop Recursive Messages from Message replies created by this function
     */
    if(event.data.val().__response){
        return
    }
    else {
        return admin.database().ref('/messages/' + event.params.User_ID + '/' + event.params.Message_ID)
            .update({ sentAt: Date.now() }).then(() => {

                // New Message
                if (!event.data.hasChild('conversation_id')) {
                    const conversation_id = generate_uid()
                    return admin.database().ref('/messages/' + event.params.User_ID + '/' + event.params.Message_ID)
                        .update({ conversation_id: conversation_id })
                        .then(()=>{
                            let queued = event.data.val().to === null || undefined
                            return admin.database().ref('conversations/').child(conversation_id).set({
                                members: [event.params.User_ID, !queued ? event.data.val().to : null],
                            }).then(() => {
                                if(queued) {
                                    return admin.database().ref('help_queue/').push()
                                        .set(Object.assign({}, event.data.val(), {createdAt: Date.now()}))
                                }
                            })
                        })
                }
                // A message reply
                else {
                    admin.database().ref('/conversations/' + event.data.val().conversation_id).once('value', (conversation) => {
                        console.log(conversation.val().member_uids)
                        conversation.val().member_uids.map((recipient_id) => {
                            // User already has a copy of the message they sent
                            if(recipient_id === event.params.User_ID){
                                return
                            }
                            // Write the reply to each recipient.
                            return admin.database().ref('messages/' + recipient_id).push().set(
                                Object.assign({},
                                    event.data.val(),
                                    {
                                        deliveredAt: Date.now(),
                                        sender: event.params.User_ID
                                    },
                                    //__response MUST be set to true to avoid recursion
                                    {
                                        __response: true
                                    }
                                )
                            )
                        })
                    })
                }

            })
    }
})