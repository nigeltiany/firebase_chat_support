const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const welcome_new_user = require('./welcome-new-users')

exports.welcome_new_user = welcome_new_user
exports.issue_chat_id = require('./issue-chat-id')