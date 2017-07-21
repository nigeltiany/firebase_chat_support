import firebase from 'firebase'

export function createFireBase ({ config }) {
    return firebase.initializeApp(config)
}

export function createfireBaseDB() {
    return firebase.database()
}