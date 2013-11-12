/*jslint node:true */
'use strict';
var Mongo = require('../models/mongo').Mongo;
var mongo = new Mongo('localhost', 27017);
module.exports = function (app) {
    app.get('/api/getAll/:name', function (req, res) {
        mongo.getAllFrom(req.params.name, function (error, result) {
            if (error) {
                res.send({error:error});
            } else {
                res.send({result:result});
            }
        });
    });
};