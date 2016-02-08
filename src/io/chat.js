/**
 * Created by nmp on 15-5-24.
 */
var Co = require('co')
import * as SessionsController from '../controllers/Sessions.js'

export function setup(server) {
    //server.connection({
    //    port: 8081,
    //    labels: ['chat']
    //})


    var numUsers = 0;

    var io = require('socket.io')(server.listener)
    var nsp = io.of('/chat');
    nsp.on('connection', function (socket) {
        var users = {};
        var addedUser = false;

        socket.on('add user', function (user, room) {
            socket.user = user;
            socket.room = room;

            socket.join(room)

            sendChatUsersList(io, socket, room)
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
            updateStream(room, data, userId)
            nsp.to(room).emit('new message', {
                message: data,
                user: socket.user
            });
        })

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


