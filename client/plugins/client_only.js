import Vue from 'vue'

import VueSocketCluster from 'vue-socket-cluster'

Vue.use(VueSocketCluster, {
    connections: [{
        name: 'chat',
        hostname: '127.0.0.1',
        secure: false,
        port: 8000,
        rejectUnauthorized: false
    }]
})