/**
 * Created by nmp on 15-5-24.
 */
export function setup(server) {
    server.connection({
        port: 8081,
        labels: ['chat']
    })

    var users = {};
    var numUsers = 0;

    var io = require('socket.io')(server.select('chat').listener)
    io.on('connection', function (socket) {
        var addedUser = false;

        socket.on('new message', function (data, room) {
            io.to(room).emit('new message', {
                message: data,
                user: socket.user
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

                // echo globally that this client has left
                socket.broadcast.emit('user left', {
                    user: socket.user,
                    numUsers: numUsers
                });
            }
        });
    });
}