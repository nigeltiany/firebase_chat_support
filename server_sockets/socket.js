const SocketCluster = require('socketcluster');
const start = () => new SocketCluster.create({
    // workers: 1, // Number of worker processes
    // brokers: 1, // Number of broker processes
    port: 8000, // The port number on which your server should listen
    appName: 'drone', // A unique name for your app

    // Switch wsEngine to 'uws' for a MAJOR performance boost (beta)
    wsEngine: 'uws',

    /* A JS file which you can use to configure each of your
     * workers/servers - This is where most of your backend code should go
     */
    workerController: __dirname + '/worker.js',

    /* JS file which you can use to configure each of your
     * brokers - Useful for scaling horizontally across multiple machines (optional)
     */
    // brokerController: __dirname + '/broker.js',

    // Whether or not to reboot the worker in case it crashes (defaults to true)
    rebootWorkerOnCrash: true
});

const socketConnection = {
    start
}

module.exports = socketConnection
