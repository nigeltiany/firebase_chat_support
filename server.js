'use strict';

const Hapi = require('hapi');
const Inert = require('inert');

const server = new Hapi.Server();
server.connection({
    port: 5000
});


server.register([Inert], function (err) {

    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/{path*}',
        config: {
            auth: false,
            cache: {
                expiresIn: 24 * 60 * 60 * 1000,
                privacy: 'public'
            }
        },
        handler: {
            directory: {
                path: __dirname + '/.static_client',
                listing: false,
                index: true
            }
        }
    });

    // Example api call
    server.route({
        method: 'GET',
        path: '/api/call',
        handler: function (request, reply) {
            reply({
              message: 'Hello!'
            })
        }
    });
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});

module.exports = server;
