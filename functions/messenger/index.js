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
            .update({ sentAt: Date.now(), delivered: false }).then(() => {

                // New Message
                if (!event.data.hasChild('conversation_id')) {
                    const conversation_id = generate_uid()
                    let queued = event.data.val().to === null
                    return admin.database().ref('/messages/' + event.params.User_ID + '/' + event.params.Message_ID)
                        .update({ conversation_id: conversation_id })
                        .then(()=>{

                            let members = {}

                            return admin.database().ref('users/' + event.params.User_ID).once('value', (recipientSnapShot) => {
                                members[recipientSnapShot.key] = {
                                    displayName: recipientSnapShot.val().displayName || 'Anonymous',
                                    role: !queued ? 'admin' : 'member'
                                }
                            }).then(() => {
                                let conversation = admin.database().ref('conversations/').child(conversation_id)
                                return conversation.set({
                                    admins: [!queued? event.params.User_ID : null],
                                    closed: false,
                                    createdAt: Date.now(),
                                    members: members,
                                    subject: event.data.val().subject,
                                    updatedAt: Date.now()
                                }).then(() => {
                                    if(queued) {
                                        return admin.database().ref('help_queue/').push().set(
                                            Object.assign({},
                                                event.data.val(),
                                                {
                                                    conversation_id: conversation_id,
                                                    createdAt: Date.now()
                                                }
                                            )
                                        )
                                    }

                                    sendMessage(conversation_id, conversation, event, event.data.val().to)
                                })
                            })
                        })
                }
                // A message reply
                else {
                    return admin.database().ref('/conversations/' + event.data.val().conversation_id).once('value', (conversation) => {
                        Object.keys(conversation.val().members).map((recipient_id) => {
                            // User already has a copy of the message they sent
                            if(recipient_id === event.params.User_ID){
                                // updates only
                                return admin.database().ref('messages/' + event.params.User_ID + '/' + event.params.Message_ID)
                                    .update({ participants: conversation.val().members })
                            }
                            // Write the reply to each recipient.
                            return admin.database().ref('messages/' + recipient_id).push().set(
                                Object.assign({},
                                    event.data.val(),
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
                        return admin.database().ref('/messages/' + event.params.User_ID + '/' + event.params.Message_ID)
                            .update({ delivered: true, deliveredAt: Date.now() })
                    })
                }

            })
    }
})

function sendMessage(conversation_id, conversation, event, recipientList){
    switch (typeof recipientList){
        case 'object':
            if(recipientList instanceof Set) {
                recipientList.forEach((identifier) => {
                    return admin.database().ref('users/' + identifier).once('value', (recipientSnapShot) => {

                        if(recipientSnapShot.val()){
                            return conversation.child('members').update({
                                [identifier]: {
                                    displayName: recipientSnapShot.val().displayName || 'Anonymous',
                                    role: 'member'
                                }
                            }).then(() => {
                                return admin.database().ref('messages/' + identifier).push().set(
                                    Object.assign({},
                                        event.data.val(),
                                        {
                                            conversation_id: conversation_id,
                                            deliveredAt: Date.now()
                                        },
                                        //__response MUST be set to true to avoid recursion
                                        {
                                            __response: true
                                        }
                                    )
                                )
                            })
                        }
                        else{
                            return admin.database().ref('users').orderByChild('displayName').equalTo(identifier)
                                .once('child_added', (recipientSnapShot) => {
                                    return conversation.child('members')
                                        .update({
                                            [recipientSnapShot.key]: {
                                                displayName: recipientSnapShot.val().displayName || 'Anonymous',
                                                role: 'member'
                                            }
                                        }).then(() => {
                                            return admin.database().ref('messages/' + recipientSnapShot.key).push().set(
                                                Object.assign({},
                                                    event.data.val(),
                                                    {
                                                        conversation_id: conversation_id,
                                                        deliveredAt: Date.now()
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
                })
            }
            else if(recipientList instanceof Object){
                Object.keys(recipientList).map((identifier) => {
                    return admin.database().ref('users/' + identifier).once('value', (recipientSnapShot) => {
                        if(recipientSnapShot.val()){
                            return conversation.child('members')
                                .update({
                                    [identifier]: {
                                        displayName: recipientSnapShot.val().displayName || 'Anonymous',
                                        role: 'member'
                                    }
                                }).then(() => {
                                    return admin.database().ref('messages/' + identifier).push().set(
                                        Object.assign({},
                                            event.data.val(),
                                            {
                                                conversation_id: conversation_id,
                                                deliveredAt: Date.now()
                                            },
                                            //__response MUST be set to true to avoid recursion
                                            {
                                                __response: true
                                            }
                                        )
                                    )
                                })
                        }
                        else {
                            return admin.database().ref().child('users').orderByChild('displayName').equalTo(identifier)
                                .once('child_added', (recipientSnapShot) => {
                                    return conversation.child('members')
                                        .update({
                                            [recipientSnapShot.key]: {
                                                displayName: recipientSnapShot.val().displayName || 'Anonymous',
                                                role: 'member'                                                                        }
                                        }).then(() => {
                                            return admin.database().ref('messages/' + recipientSnapShot.key).push().set(
                                                Object.assign({},
                                                    event.data.val(),
                                                    {
                                                        conversation_id: conversation_id,
                                                        deliveredAt: Date.now()
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
                })
            }
    }
}