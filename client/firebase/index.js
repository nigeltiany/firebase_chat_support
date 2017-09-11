// this is aliased in webpack config based on server/client build
import { createFireBase, createfireBaseDB } from '_firebase'
import { mapState } from 'vuex'
import takeRight from 'lodash.takeright'

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
        const conversations = this.database.ref('user_conversations/' + this.user().uid).limitToLast(16).orderByChild('priority')

        function lastNMessages(n=100, conversation){
            return takeRight(Object.keys(conversation.val().messages) , n)
        }

        conversations.on('child_added', (conversationSnapShot) => {
            lastNMessages(100, conversationSnapShot).map((messageKey) => {
                this.database.ref('messages/'+ this.user().uid + '/' + messageKey).once('value', (messageSnapShot) => {
                    callback(Object.assign({}, { id: messageSnapShot.key }, messageSnapShot.val()))

                })

                this.database.ref('messages/'+ this.user().uid + '/' + messageKey).on('child_changed', (messageSnapShot) => {
                    callback(Object.assign({}, { id: messageSnapShot.key }, messageSnapShot.val()))
                })
            })
        })

        conversations.on('child_changed', (conversationSnapShot) => {
            lastNMessages(100, conversationSnapShot).map((messageKey) => {
                this.database.ref('messages/'+ this.user().uid + '/' + messageKey).once('value', (messageSnapShot) => {
                    callback(Object.assign({}, { id: messageSnapShot.key }, messageSnapShot.val()))

                })

                this.database.ref('messages/'+ this.user().uid + '/' + messageKey).on('child_changed', (messageSnapShot) => {
                    callback(Object.assign({}, { id: messageSnapShot.key }, messageSnapShot.val()))
                })
            })
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
                conversationMessages.forEach((message) => {
                    if(message.val().__response || message.val().auto){
                        this.database.ref('messages/' + this.user().uid + "/" + message.key).update({ read: true })
                    }
                })
            })
    }

    sendNewMessage(message){
        if(!message.to){
            return
        }
        this.database.ref('messages/'+ this.user().uid).push().set(message)
    }
}