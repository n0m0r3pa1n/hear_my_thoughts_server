'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _controllersAuthJs = require('./controllers/Auth.js');

var AuthenticationController = _interopRequireWildcard(_controllersAuthJs);

var _configJs = require('./config.js');

var _routesJs = require('./routes.js');

var _routesJs2 = _interopRequireDefault(_routesJs);

var Mongoose = require('mongoose');
var Hapi = require('hapi');
var Co = require('co');

var dbURI = process.env.MONGOLAB_URI || 'mongodb://localhost/devs';

Mongoose.connect(dbURI);
var serverPort = process.env.PORT || 8080;

var pack = require('../package'),
    swaggerOptions = {
    basePath: dbURI.contains('localhost') ? 'http://localhost:' + serverPort : '',
    apiVersion: pack.version
};

var server = new Hapi.Server();

server.connection({
    port: serverPort,
    routes: {
        cors: true
    }
});

server.connection({
    port: 8081,
    labels: ['chat']
});

server.connection({
    port: 8082,
    labels: ['stream']
});

var io = require('socket.io')(server.select('chat').listener);
io.on('connection', function (socket) {

    socket.emit('Oh hii!');

    socket.on('burp', function () {
        socket.emit('Excuse you!');
    });
});

var io2 = require('socket.io')(server.select('stream').listener);
io2.on('connection', function (socket) {

    socket.emit('Oh hii2!');

    socket.on('burp', function () {
        socket.emit('Excuse you2!');
    });
});

server.register({
    register: require('hapi-swagger'),
    options: swaggerOptions
}, function (err) {
    if (err) {
        server.log(['error'], 'hapi-swagger load error: ' + err);
    } else {
        server.log(['start'], 'hapi-swagger interface loaded');
    }
});

server.register(require('hapi-auth-jwt2'), function (err) {

    if (err) {
        console.log(err);
    }

    server.auth.strategy('jwt', 'jwt', true, {
        key: _configJs.PRIVATE_KEY, // Never Share your secret key
        validateFunc: AuthenticationController.validate // validate function defined above
    });
});

_routesJs2['default'].forEach(function (route) {
    route.handler = Co.wrap(route.handler);
});

server.route(_routesJs2['default']);

if (!module.parent) {
    server.start(function () {
        console.log('Example is rocking your world at port %s', serverPort);
    });
}

module.exports = server;