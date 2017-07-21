// this is aliased in webpack config based on server/client build
import { createFireBase, createfireBaseDB } from '_firebase'

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

}