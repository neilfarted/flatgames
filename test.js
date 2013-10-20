/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 8001);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);
app.use(express.errorHandler());

// serve index and view partials
app.get('/', routes.mock);
app.get('/partials/:name', routes.partials);
// redirect all others to the index (HTML5 history)
app.get('*', routes.mock);
// Socket.io Communication
io.sockets.on('connection', require('./routes/socket'));


server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
