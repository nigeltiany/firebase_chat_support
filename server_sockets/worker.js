const uuid_v5 = require('uuid/v5');

module.exports.run = function (worker) {
    const ws = worker.scServer;

    ws.on('connection', (socket) => {
        console.log('connected')
        socket.emit('welcome',{ title: 'Welcome to lawn care.', message: 'my name is linda, i\'m at you\'re service' })

        socket.emit('address', socket.remoteAddress)
    })

    ws.on('disconnect', () => {
        console.log('disconnected')
    })
}