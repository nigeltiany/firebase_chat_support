const functions = require('firebase-functions');

const admin = require('firebase-admin');

function guid(){
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,a=>(a^Math.random()*16>>a/4).toString(16))
}

module.exports = functions.database.ref('/messages/{User_ID}/{Message_ID}').onCreate(event => {
    if (!event.data.hasChild('conversation_id')) {
        return admin.database().ref('/messages/' + event.params.User_ID + '/' + event.params.Message_ID)
            .update({ conversation_id: guid() })
    }
})