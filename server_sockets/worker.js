const uuid_v5 = require('uuid/v5');

module.exports.run = function (worker) {
    const ws = worker.scServer;

    ws.on('connection', () => {
        console.log('connected')
    })

    ws.on('disconnect', () => {
        console.log('disconnected')
    })

    ws.emit('Welcome',{ title: 'Welcome to lawn care.', message: 'my name is linda, i\'m at you\'re service' })

    ws.emit('address', ws.remoteAddress)
}