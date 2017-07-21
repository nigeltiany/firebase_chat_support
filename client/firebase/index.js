// this is aliased in webpack config based on server/client build
import { createFireBase, createfireBaseDB } from '_firebase'

export const firebase = createFireBase({
    config: {
        apiKey: "AIzaSyA2qhaVfG2P7FlfZP7x80UysSiLrQr1ZZ4",
        authDomain: "lawn-care-5feaf.firebaseapp.com",
        databaseURL: "https://lawn-care-5feaf.firebaseio.com",
        projectId: "lawn-care-5feaf",
        storageBucket: "lawn-care-5feaf.appspot.com",
        messagingSenderId: "517689819608"
    }
})

export const firebase_DB = createfireBaseDB()