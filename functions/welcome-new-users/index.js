const functions = require('firebase-functions');

const admin = require('firebase-admin');

const generate_uid = require('../guid')

const _sortBy = require('lodash.sortby'); const _isEqual = require('lodash.isequal'); const _intersection = require('lodash.intersection');

module.exports = functions.database.ref('/users/{userID}').onCreate(event => {

    return admin.database().ref('customer-support-agents')
        .orderByChild('lastClientAt')
        .once("value")
        .then((snapshot) => {

            let agentsByLongestWaiting = []
            snapshot.forEach((agent) => { agentsByLongestWaiting.push(Object.assign({ uid: agent.key }, agent.val())) })

            let agentsByLeastClients = _sortBy(agentsByLongestWaiting, ['clients'])

            let available_agent =  _intersection(agentsByLeastClients, agentsByLongestWaiting).find((agent) => {
                return agent.available === true && agent.online === true // && agent.activeInRole === true
            })

            return admin.database().ref('users/' + available_agent.uid).once("value").then((agent) => {
                let agentName = (agent.val() && agent.val().displayName) || 'Team'
                let conversation_uid = generate_uid()

                return admin.database().ref('messages/' + event.params.userID).push().set({
                    auto: true, // Used to ignore sending message to agent until recipient replies
                    title: 'Welcome to Lawn Care',
                    sender: agentName,
                    conversation_id: conversation_uid,
                    participants: [event.data.displayName || 'Anonymous', agentName],
                    message: "Welcome to lawn care. Let us know if you have any questions",
                    delivered: true,
                    deliveredAt: Date.now()
                }).then(() => {
                    let thisMoment = Date.now()

                    //Update Customer Agent Relationship
                    return admin.database().ref('customer-support-agents/' + available_agent.uid).set(
                        Object.assign({}, available_agent, {
                            clients: available_agent.clients + 1,
                            conversations: available_agent.conversations + 1,
                            lastClientAt: thisMoment,
                            updatedAt: thisMoment
                        })
                        // Then update conversations participants relationship
                    ).then(() => {
                        return admin.database().ref('conversations/').child(conversation_uid).set({
                            admins: [agent.key],
                            closed: false,
                            createdAt: Date.now(),
                            // One to one index mapping between a users name in the members array and their id in the members_uids array
                            members: [event.data.displayName || 'Anonymous', agentName],
                            member_uids: [event.params.userID, available_agent.uid],
                            subject: 'Welcome to Lawn Care',
                            updatedAt: Date.now()
                        })
                    })

                })
            })

        })
})