const functions = require('firebase-functions');

const admin = require('firebase-admin');

const _sortBy = require('lodash.sortby'); const _isEqual = require('lodash.isequal'); const _intersection = require('lodash.intersection');

module.exports = functions.database.ref('/users/{userID}').onCreate(event => {

    admin.database().ref('customer-support-agents')
        .orderByChild('lastClientAt')
        .once("value", function (snapshot) {

            let agentsByLongestWaiting = []
            snapshot.forEach((agent) => { agentsByLongestWaiting.push(Object.assign({ uid: agent.key }, agent.val())) })

            let agentsByLeastClients = _sortBy(agentsByLongestWaiting, ['clients'])

            let available_agent =  _intersection(agentsByLeastClients, agentsByLongestWaiting).find((agent) => {
                return agent.available === true && agent.online === true // && agent.activeInRole === true
            })

            admin.database().ref('users/' + available_agent.uid + '/displayName').once("value", function(agent) {
                let agentName = agent.val()

                return admin.database().ref('messages/' + event.params.userID).push().set({
                    auto: true, // Used to ignore sending message to agent until recipient replies
                    title: 'Welcome to Lawn Care',
                    sender: agentName,
                    participants: [agentName],
                    message: "Welcome to lawn care. Let us know if you have any questions",
                    recipients: [event.params.userID, available_agent.uid]
                }).then(() => {
                    let thisMoment = Date.now()

                    return admin.database().ref('customer-support-agents/' + available_agent.uid).set(
                        Object.assign({}, available_agent, {
                            clients: available_agent.clients + 1,
                            conversations: available_agent.conversations + 1,
                            lastClientAt: thisMoment,
                            updatedAt: thisMoment
                        })
                    )
                })
            })

    })
})