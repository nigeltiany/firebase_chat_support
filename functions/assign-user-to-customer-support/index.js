const functions = require('firebase-functions');

const admin = require('firebase-admin');

module.exports = function () {
    return admin.database.ref('/customer-support-agents').orderByValue('clients').orderByValue('updatedAt').limitToFirst()
}


