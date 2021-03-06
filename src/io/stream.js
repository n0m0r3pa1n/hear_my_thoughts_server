/**
 * Created by nmp on 15-5-24.
 */
var Co = require('co')
import * as SessionsController from '../controllers/Sessions.js'

export function setup(server) {
    //server.connection({
    //    port: 8082,
    //    labels: ['stream']
    //})

    var users = {};
    var numUsers = 0;

    var io = require('socket.io')(server.listener)
    var nsp = io.of('/stream');
    nsp.on('connection', function (socket) {
        var addedUser = false;

        socket.on('stream', function (data, room) {
            var updateStream = Co.wrap(function* (room, data) {
               yield SessionsController.updateStream(room, data);
            });
            updateStream(room, data)
            nsp.to(room).emit('stream', {
                stream: data
            })
        })

        socket.on('stream status', function(data, room) {
            nsp.to(room).emit('stream status', {
                is_running: data
            })
        })

        socket.on('add user', function (user, room) {
            // we store the username in the socket session for this client
            socket.join(room)
            socket.user = user;
            socket.room = room;
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