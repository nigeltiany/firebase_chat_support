const functions = require('firebase-functions');

const admin = require('firebase-admin');

const generate_uid = require('../guid')

module.exports = functions.database.ref('/messages/{User_ID}/{Message_ID}').onCreate((createdMessage, context) => {

    /**
     * Stop messages that do not need an initial copy
     * That is: Welcome messages to a new user which an agent does not need a copy of
     */
    if(createdMessage.val().auto){
        return new Promise.resolve()
    }

    /**
     * Stop Recursive Messages from Message replies created by this function
     */
    if(createdMessage.val().__response){
        return new Promise.resolve()
    }
    else {
        return admin.database().ref('/messages/' + context.params.User_ID + '/' + context.params.Message_ID)
            .update({ sentAt: Date.now(), delivered: false }).then(() => {

                // New Message
                if (!createdMessage.hasChild('conversation_id')) {
                    const conversation_id = generate_uid()
                    let queued = createdMessage.val().to === null
                    return admin.database().ref('/messages/' + context.params.User_ID + '/' + context.params.Message_ID)
                        .update({ conversation_id: conversation_id })
                        .then(()=>{

                            let members = {}

                            return admin.database().ref('users/' + context.params.User_ID).once('value', (recipientSnapShot) => {
                                members[recipientSnapShot.key] = {
                                    displayName: recipientSnapShot.val().displayName || 'Anonymous',
                                    role: !queued ? 'admin' : 'member'
                                }
                            }).then(() => {
                                let conversation = admin.database().ref('conversations/').child(conversation_id)
                                return conversation.set({
                                    admins: [!queued? context.params.User_ID : null],
                                    closed: false,
                                    createdAt: Date.now(),
                                    members: members,
                                    subject: createdMessage.val().subject,
                                    updatedAt: Date.now()
                                }).then(() => {
                                    if(queued) {
                                        return admin.database().ref('help_queue/').push().set(
                                            Object.assign({},
                                                createdMessage.val(),
                                                {
                                                    conversation_id: conversation_id,
                                                    createdAt: Date.now()
                                                }
                                            )
                                        )
                                    }

                                    sendMessage(conversation_id, conversation, context, createdMessage).then(() => {
                                        return admin.database().ref('/messages/' + context.params.User_ID + '/' + context.params.Message_ID)
                                            .update({ deliveredAt: Date.now(), delivered: true })
                                    })
                                })
                            })
                        })
                }
                // A message reply
                else {
                    return admin.database().ref('/conversations/' + createdMessage.val().conversation_id).once('value', (conversation) => {
                        Object.keys(conversation.val().members).map((recipient_id) => {
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
                                        participants: conversation.val().members,
                                        subject: conversation.val().subject
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

function sendMessage(conversation_id, conversation, event, messageContexts){
    let recipientList = messageContexts.val().to
    switch (typeof recipientList){
        case 'object':
            return new Promise((resolve,reject) => {
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
                                            messageContexts.val(),
                                            {
                                                conversation_id: conversation_id,
                                                deliveredAt: Date.now()
                                            },
                                            //__response MUST be set to true to avoid recursion
                                            {
                                                __response: true
                                            }
                                        )
                                    ).then(resolve)
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
                                                        messageContexts.val(),
                                                        {
                                                            conversation_id: conversation_id,
                                                            deliveredAt: Date.now()
                                                        },
                                                        //__response MUST be set to true to avoid recursion
                                                        {
                                                            __response: true
                                                        }
                                                    )
                                                ).then(resolve)
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
                                                messageContexts.val(),
                                                {
                                                    conversation_id: conversation_id,
                                                    deliveredAt: Date.now()
                                                },
                                                //__response MUST be set to true to avoid recursion
                                                {
                                                    __response: true
                                                }
                                            )
                                        ).then(resolve)
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
                                                        messageContexts.val(),
                                                        {
                                                            conversation_id: conversation_id,
                                                            deliveredAt: Date.now()
                                                        },
                                                        //__response MUST be set to true to avoid recursion
                                                        {
                                                            __response: true
                                                        }
                                                    )
                                                ).then(resolve)
                                            })
                                    })
                            }
                        })
                    })
                }
            })
    }
}
