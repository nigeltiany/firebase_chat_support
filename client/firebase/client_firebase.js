import Firebase from 'firebase/app'
import 'firebase/database'

export function firebase ({ config, version }) {
    Firebase.initializeApp(config)
    return Firebase.database().ref(version)
}