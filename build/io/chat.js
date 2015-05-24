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
        port: 8081,
        labels: ['chat']
    });

    var usernames = {};
    var numUsers = 0;

    var io = require('socket.io')(server.select('chat').listener);
    io.on('connection', function (socket) {
        var addedUser = false;

        socket.on('new message', function (data, room) {
            io.to(room).emit('new message', {
                message: data,
                username: socket.username
            });
        });

        socket.on('add user', function (username, room) {
            // we store the username in the socket session for this client
            socket.join(room);
            socket.username = username;
            socket.room = room;
            // add the client's username to the global list
            usernames[username] = username;
            ++numUsers;
            addedUser = true;
            socket.emit('login', {
                numUsers: numUsers
            });

            socket.emit('user joined', {
                username: socket.username,
                numUsers: numUsers
            });
        });

        socket.on('disconnect', function () {
            // remove the username from global usernames list
            if (addedUser) {
                delete usernames[socket.username];
                --numUsers;

                // echo globally that this client has left
                socket.emit('user left', {
                    username: socket.username,
                    numUsers: numUsers
                });
            }
        });
    });
}