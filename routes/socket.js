'use strict';
var Mongo = require('../models/mongo').Mongo;
var User = function () {
    var name = '', hash = '';
    return {
        getName: function () {
            return this.name;
        },
        setName: function (newName) {
            this.name = newName;
        },
        getHash: function () {
            return this.hash;
        },
        setHash: function (newHash) {
            this.hash = newHash;
        }
    };
};
// Keep track of which names are used so that there are no duplicates
var Players = {
    users: [],
    add: function (name, hash) {
        var newUser = new User();
        newUser.setName(name);
        newUser.setHash(hash);
        this.users[hash] = newUser;
        return this.users[hash];
    },
    destroy: function (hash) {
        delete this.users[hash];
    }
};
/*
 * Serve content over a socket
 */

module.exports = function (socket) {
    var user, players = new Players();
    socket.on('user:login', function (data) {
        user = players.add(data.name, data.hash);
    });

    /*socket.on('pass:tag', function (data) {
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
    });*/

    // clean up when a user leaves, and broadcast it to other users
    socket.on('disconnect', function () {
        socket.broadcast.emit('user:left', {
            name: user.name
        });
        Players.destroy(user.hash);
    });
};