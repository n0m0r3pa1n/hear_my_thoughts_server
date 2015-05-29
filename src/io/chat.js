/**
 * Created by nmp on 15-5-24.
 */
export function setup(server) {
    server.connection({
        port: 8081,
        labels: ['chat']
    })


    var numUsers = 0;

    var io = require('socket.io')(server.select('chat').listener)
    io.on('connection', function (socket) {
        var users = {};
        var addedUser = false;

        socket.on('new message', function (data, room) {
            io.to(room).emit('new message', {
                message: data,
                user: socket.user
            })
        })

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
    var clients = io.sockets.adapter.rooms[room];

    var users = new Array()
    for (var clientId in clients) {
        users.push(JSON.parse(io.sockets.connected[clientId].user))
    }
    if(users == null) {
        return;
    }

    socket.emit('users list', { users: users })
}


