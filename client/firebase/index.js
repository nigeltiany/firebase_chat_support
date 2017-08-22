// this is aliased in webpack config based on server/client build
import { createFireBase, createfireBaseDB } from '_firebase'
import { mapState } from 'vuex'

export default new class firebase {

    constructor() {
        this.firebase = createFireBase({
            config: {
                apiKey: "AIzaSyA2qhaVfG2P7FlfZP7x80UysSiLrQr1ZZ4",
                authDomain: "lawn-care-5feaf.firebaseapp.com",
                databaseURL: "https://lawn-care-5feaf.firebaseio.com",
                projectId: "lawn-care-5feaf",
                storageBucket: "lawn-care-5feaf.appspot.com",
                messagingSenderId: "517689819608"
            }
        })

        this.database = createfireBaseDB()
        this.auth = this.firebase.auth()
    }

    static userIsAuthenticated() {
        if(this.auth.currentUser) {
            return true
        }
        return false
    }

    user() {
        return this.auth.currentUser
    }

    signInAnonymously() {
        this.firebase.auth().signInAnonymously().catch(function(error) {
            console.log(error)
        })
    }

    authStateChanged(callback) {
        this.firebase.auth().onAuthStateChanged((user) => {
            callback(user, this.database)
        });
    }

    subscribeToMessages(callback) {

        this.database.ref('messages/'+ this.user().uid).on('child_added', (newMessage) => {
            if(newMessage.val().conversation_id) {
                callback(Object.assign({}, { id: newMessage.key }, newMessage.val()))
            }
        })

        this.database.ref('messages/'+ this.user().uid).on('child_changed', (updatedMessage) => {
            if(updatedMessage.val().conversation_id) {
                callback(Object.assign({}, { id: updatedMessage.key }, updatedMessage.val()))
            }
        })
    }

    sendMessageReply(message) {
        if(!message.conversation_id){
            return
        }
        this.database.ref('messages/'+ this.user().uid).push().set(message)
    }

    markMessagesInConversationAsRead(conversation_id) {
        this.database.ref('messages/' + this.user().uid).orderByChild('conversation_id').equalTo(conversation_id)
            .once("value",(conversationMessages) => {
                console.log(conversationMessages.val())
                conversationMessages.forEach((message) => {
                    this.database.ref('messages/' + this.user().uid + "/" + message.key).update({ read: true })
                })
            })
    }
}