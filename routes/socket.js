'use strict';
var Mongo = require('../models/mongo').Mongo;
var User = function (name, ip) {
    var _user = {
        name: name || '',
        ip: ip || ''
    };
    return _user;
};
// Keep track of which names are used so that there are no duplicates
var Players = function () {
    return {
        users: [],
        add: function (user) {
            var ip = user.ip;
            this.users[ip] = user;
            return this.users[ip];
        },
        getUser: function (ip) {
            return this.users[ip];
        },
        getAllUserNames: function () {
            var prop, retArr = [];
            for (prop in this.users) {
                if (this.users.hasOwnProperty(prop)) {
                    retArr.push({name: this.users[prop].name});
                }
            }
            return retArr;
        },
        /*checkIp: function (name, ip) {
            var user = this.users[ip];
            return user && user.getIp() === ip;
        },*/
        destroy: function (ip) {
            delete this.users[ip];
        }
    };
};
/*
 * Serve content over a socket
 */

module.exports = function (io) {
    var user, players = new Players(), timeouts = [];
    function logout(ip) {
        players.destroy(ip);
        io.sockets.emit('lobby:leave', {
            name: user.name,
            users: players.getAllUserNames()
        });
    }
    io.sockets.on('connection', function (socket) {
        var ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;
        if (timeouts[ip]) {
            clearTimeout(timeouts[ip]);
        }
        user = players.getUser(ip);
        if (user) {
            socket.emit('login:success', {name: user.name});
        }
        socket.on('lobby:enter', function (data) {
            socket.emit('lobby:init', {
                users: players.getAllUserNames()
            });
        });
        socket.on('logout', function () {
            logout(ip);
        });
        /*socket.get('user', function (error, user) {
            var name;
            console.log({error: error, user: user});
            if (error || !user || !user.getName) {
                console.log('i think this means the user is not logged in, or the user object is not right');
            } else {
                name = user.getName();
                if (players.checkIp(name, ip)) {
                    console.log('user is logged in and the ip matches');
                    user = players.getUser(name);
                } else {
                    console.log('user is new or the ip is wrong.');
                    user = players.add(new User(name, ip));
                    socket.emit('lobby:join', {
                        user: user
                    });
                }
            }
            console.log('emitting lobby init');
            socket.emit('lobby:init', {
                users: players.users
            });
        });*/
        socket.on('user:login', function (data) {
            user = players.add(new User(data.name, ip));
            socket.emit('login:success', {name: data.name});
            io.sockets.emit('lobby:join', {
                user: user
            });
            /*socket.set('user', user, function () {
                console.log('set user: ' + user);
            });*/
            //socket.broadcast.emit('send:message', {text: user.getName()});
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
            timeouts[ip] = setTimeout(function () {
                /*socket.broadcast.emit('user:left', {
                    name: user.name
                });
                console.log('destroying ' + user.name);*/
                logout(ip);
            }, 10000);
        });
    });
};