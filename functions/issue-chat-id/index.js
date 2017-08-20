const functions = require('firebase-functions');

const admin = require('firebase-admin');

const generate_uid = require('../guid')

module.exports = functions.database.ref('/messages/{User_ID}/{Message_ID}').onCreate(event => {
    if (!event.data.hasChild('conversation_id')) {
        const id = generate_uid()
        return admin.database().ref('/messages/' + event.params.User_ID + '/' + event.params.Message_ID)
            .update({ conversation_id: id })
            .then(()=>{
                let queued = event.data.val().to === null || undefined
                return admin.database().ref('conversations/').child(id).set({
                    members: [event.params.User_ID, !queued ? event.data.val().to : null],
                }).then(() => {
                    if(queued) {
                        return admin.database().ref('help_queue/').push().set(Object.assign({}, event.data.val(), {createdAt: Date.now()}))
                    }
                })
            })
    }
})