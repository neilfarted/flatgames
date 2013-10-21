'use strict';

// Keep track of which names are used so that there are no duplicates
var Users = {
    userNames: [],
    // find the lowest unused "guest" name and claim it
    getGuestName: function () {
        var name,
            nextUserId = 1;
        do {
            name = 'Guest ' + nextUserId;
            nextUserId += 1;
        } while (this.userNames.indexOf(name) > -1);
        return name;
    },
    free: function (name) {
        var idx;
        while (-1 < (idx = this.userNames.indexOf(name))) {
            this.userNames.splice(idx, 1);
        }
    }
}, Players = {
    count: 0,
    add: function () {
        this.count += 1;
        return this.count;
    },
    destroy: function () {
        this.count -= 1;
        return this.count;
    }
};
/*
 * Serve content over a socket
 */

module.exports = function (socket) {
    var name = Users.getGuestName();
    Players.add();
    socket.on('pass:tag', function (data) {
        socket.broadcast.emit('get:tag', {
            id: data.id === 0 ? 1 : 0
        });
    });
    // send the new user their name and a list of users
    socket.emit('init', {
        name: name,
        users: Users.userNames,
        messages: [],
        players: Players.count
    });

    // notify other clients that a new user has joined
    socket.broadcast.emit('user:join', {
        name: name
    });

    // broadcast a user's message to other users
    socket.on('send:message', function (data) {
        socket.broadcast.emit('send:message', {
            user: name,
            text: data.message
        });
    });

    // validate a user's name change, and broadcast it on success
    socket.on('change:name', function (data, fn) {
        if (Users.userNames.indexOf(data.name) === -1) {
            var oldName = name;
            Users.free(oldName);

            name = data.name;

            socket.broadcast.emit('change:name', {
                oldName: oldName,
                newName: name
            });
            fn(true);
        } else {
            fn(false);
        }
    });

    // clean up when a user leaves, and broadcast it to other users
    socket.on('disconnect', function () {
        socket.broadcast.emit('user:left', {
            name: name
        });
        Users.free(name);
        Players.destroy();
    });
};