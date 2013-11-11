/*jslint node:true */
/*globals */
'use strict';

var express = require('express'),
    http = require('http'),
    path = require('path'),
    app = module.exports = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    AngularAppName = '',
    scriptPaths = [];

// all environments
app.set('port', process.env.PORT || 8888);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express['static'](path.join(__dirname, 'public')));
app.use(app.router);

if ('production' === app.get('env')) {
    AngularAppName = 'flatGames';
    scriptPaths = ['/js/app.js', '/js/controllers.js', '/js/services.js', '/js/directives.js'];
} else {
    app.use(express.errorHandler());
    AngularAppName = 'flatGames';
    scriptPaths = ['/js/lib/angular/angular-mocks.js', '/js/app.js', '/js/controllers.js', '/js/services.js', '/js/directives.js', '/test/e2e/app.js'];
}
// mongo
// var mongo = new Mongo('localhost', 27017);

// serve index and view partials
app.get('/', function (req, res) {
    res.render('index', {
        angularApp: AngularAppName,
        scripts: scriptPaths
    });
});
app.get('/partials/:name', function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
});

require('./routes/api')(app);

// redirect all others to the index (HTML5 history) ??? needed? ???
app.get('*', function (req, res) {
    res.render('index', {
        angularApp: AngularAppName,
        scripts: scriptPaths
    });
});

// Socket.io Communication
require('./routes/socket')(io);
//io.sockets.on('connection', require('./routes/socket'));


server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port') + ' running in ' + app.get('env') + ' mode.');
});

/*app.get('/', function(req, res){
    mongo.findAll(function (error, docs) {
        res.send(docs);
    });
});
*/