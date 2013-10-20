/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var Mongo = require('./models/mongo').Mongo;
var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 8888);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
/* if ('development' == app.get('env')) {
  app.use(express.errorHandler());
} */
// mongo
// var mongo = new Mongo('localhost', 27017);

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);
// redirect all others to the index (HTML5 history)
app.get('*', routes.index);
// Socket.io Communication
io.sockets.on('connection', require('./routes/socket'));


server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

/*app.get('/', function(req, res){
    mongo.findAll(function (error, docs) {
        res.send(docs);
    });
});
*/