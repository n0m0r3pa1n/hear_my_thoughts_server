/**
 * Created by nmp on 15-5-24.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.setup = setup;

function setup(server) {
    server.connection({
        port: 8082,
        labels: ['stream']
    });

    var io2 = require('socket.io')(server.select('stream').listener);
    io2.on('connection', function (socket) {

        socket.emit('Oh hii2!');

        socket.on('burp', function () {
            socket.emit('Excuse you2!');
        });
    });
}