var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

Mongo = function (host, port) {
    this.db= new Db('node-mongo-test', new Server(host, port, {auto_reconnect: true, safe: true}, {}));
    this.db.open(function () {});
};
Mongo.prototype.getCollection = function (callback) {
    this.db.collection('games', function(error, game_collection) {
        if( error ) {
            callback(error, null);
        } else {
            callback(null, game_collection);
        }
    }, null);
};
Mongo.prototype.findAll = function (callback) {
    this.getCollection(function (error, game_collection) {
        if (error) {
            callback(error);
        } else {
            game_collection.find().toArray(function (error, results) {
                if (error) {
                    callback(error);
                } else {
                    callback(null, results);
                }
            });
        }
    });
};
Mongo.prototype.findByID = function (id, callback) {
    this.getCollection(function (error, game_collection) {
        if (error) {
            callback(error);
        } else {
            game_collection.findOne({_id : game_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function (error, result) {
                if (error) {
                    callback(error);
                } else {
                    callback(null, result);
                }
            });
        }
    });
};
Mongo.prototype.save = function (games, callback) {
    this.getCollection(function (error, game_collection) {
        if (error) {
            callback(error);
        } else {
            if (typeof(games.length) == 'undefined' ) {
                games = [games];
            }
            for (var i=0;i<games.length;i++) {
                game = games[i];
                game.created = new Date();
            }
            game_collection.update(games, function () {
                callback(null, result);
            })
        }
    });
};

exports.Mongo = Mongo