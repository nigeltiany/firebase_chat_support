const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://the-confab-roots.firebaseio.com'
});

exports.welcome_new_user = require('./welcome-new-users')
exports.messenger = require('./messenger')
exports.user_conversation_linker = require('./link-user-to-conversation')
exports.track_conversation_updates = require('./track-conversation-updates')
