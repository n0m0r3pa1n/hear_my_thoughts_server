/**
 * Created by nmp on 15-5-24.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.setup = setup;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _controllersSessionsJs = require('../controllers/Sessions.js');

var SessionsController = _interopRequireWildcard(_controllersSessionsJs);

var Co = require('co');

function setup(server) {
    //server.connection({
    //    port: 8081,
    //    labels: ['chat']
    //})

    var numUsers = 0;

    var io = require('socket.io')(server.listener);
    var nsp = io.of('/chat');
    nsp.on('connection', function (socket) {
        var users = {};
        var addedUser = false;

        socket.on('add user', function (user, room) {
            console.log(user);
            socket.user = user;
            socket.room = room;

            socket.join(room);

            sendChatUsersList(io, socket, room);
            // add the client's username to the global list
            users[user] = user;
            ++numUsers;
            addedUser = true;
            socket.emit('login', {
                numUsers: numUsers
            });

            socket.broadcast.emit('user joined', {
                user: socket.user,
                numUsers: numUsers
            });
        });

        socket.on('new message', function (data, room, userId) {
            var updateStream = Co.wrap(function* (room, data, userId) {
                yield SessionsController.saveChatMessage(room, userId, data);
            });
            updateStream(room, data, userId);
            console.log('new message', data);
            nsp.to(room).emit('new message', {
                message: data,
                user: socket.user
            });
        });

        socket.on('disconnect', function () {
            // remove the username from global usernames list
            if (addedUser) {
                delete users[socket.user];
                --numUsers;

                //difference between broadcast and without is that the event
                //will not be broadcasted to the current socket if you use it
                socket.broadcast.emit('user left', {
                    user: socket.user,
                    numUsers: numUsers
                });
            }
        });
    });

    var nsp2 = io.of('/stream');
    var users = {};
    var numUsers2 = 0;
    nsp2.on('connection', function (socket) {
        var addedUser = false;

        socket.on('stream', function (data, room) {
            var updateStream = Co.wrap(function* (room, data) {
                yield SessionsController.updateStream(room, data);
            });
            updateStream(room, data);
            nsp2.to(room).emit('stream', {
                stream: data
            });
        });

        socket.on('stream status', function (data, room) {
            nsp2.to(room).emit('stream status', {
                is_running: data
            });
        });

        socket.on('add user', function (user, room) {
            // we store the username in the socket session for this client
            socket.join(room);
            socket.user = user;
            socket.room = room;
            // add the client's username to the global list
            users[user] = user;
            ++numUsers2;
            addedUser = true;
            socket.emit('login', {
                numUsers: numUsers2
            });

            socket.broadcast.emit('user joined', {
                user: socket.user,
                numUsers: numUsers2
            });
        });

        socket.on('disconnect', function () {
            // remove the username from global usernames list
            if (addedUser) {
                delete users[socket.user];
                --numUsers2;

                //difference between broadcast and without is that the event
                //will not be broadcasted to the current socket if you use it
                socket.broadcast.emit('user left', {
                    user: socket.user,
                    numUsers: numUsers
                });
            }
        });
    });
}

function sendChatUsersList(io, socket, room) {
    var clients = io.nsps['/chat'].adapter.rooms[room].sockets;

    var users = new Array();
    for (var clientId in clients) {
        users.push(JSON.parse(io.nsps['/chat'].sockets[clientId].user));
    }
    if (users == null || users.length == 0) {
        return;
    }

    socket.emit('users list', { users: users });
}