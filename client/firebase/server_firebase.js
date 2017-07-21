import firebase from 'firebase'

export function createFireBase ({ config }) {
    let FIREBASE
    // this piece of code may run multiple times in development mode,
    // so we attach the instantiated FIREBASE to `process` to avoid duplications
    if (process.__FIREBASE__) {
        FIREBASE = process.__FIREBASE__
    } else {
        FIREBASE = process.__FIREBASE__ = firebase.initializeApp(config)
        FIREBASE.onServer = true
    }
    return FIREBASE
}

export function createfireBaseDB() {
    let FIREBASE_DB
    if (process.__FIREBASE_DB__) {
        FIREBASE_DB = process.__FIREBASE_DB__
    } else {
        FIREBASE_DB = process.__FIREBASE_DB__ = firebase.database()
        FIREBASE_DB.onServer = true
    }
    return FIREBASE_DB
}