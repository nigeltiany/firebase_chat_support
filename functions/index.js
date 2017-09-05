const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.welcome_new_user = require('./welcome-new-users')
exports.messenger = require('./messenger')
exports.user_conversation_linker = require('./link-user-to-conversation')