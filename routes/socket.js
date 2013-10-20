// Keep track of which names are used so that there are no duplicates
var Users = {
    userNames: [],
    claim: function (name) {
        if (!name || this.userNames[name]) {
            return false;
        } else {
            this.userNames[name] = true;
            return true;
        }
    },
    // find the lowest unused "guest" name and claim it
    getGuestName: function () {
        var name,
            nextUserId = 1;
        do {
            name = 'Guest ' + nextUserId;
            nextUserId += 1;
        } while (!this.claim(name));
        return name;
    },
    // serialize claimed names as an array
    get: function () {
        var res = [];
        for (var user in this.userNames) {
            res.push(user);
        }
        return res;
    },
    free: function (name) {
        if (this.userNames[name]) {
            delete this.userNames[name];
        }
    }
};
/*
 * Serve content over a socket
 */

module.exports = function (socket) {
    var name = Users.getGuestName();

    // send the new user their name and a list of users
    socket.emit('init', {
        name: name,
        users: Users.get()
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
        if (Users.claim(data.name)) {
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
    });
};