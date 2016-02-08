var Mongoose = require('mongoose')
var Hapi = require('hapi')
var Co = require('co')

import * as AuthenticationController from './controllers/Auth.js'
import * as Chat from './io/chat.js'
import * as Stream from './io/stream.js'
import {PRIVATE_KEY} from './config.js'
import routes from "./routes.js"

var dbURI = process.env.MONGOLAB_URI || 'mongodb://localhost/devs'

Mongoose.connect(dbURI)
var serverPort = process.env.PORT || 8080

var pack = require('../package'),
    swaggerOptions = {
        basePath: (dbURI.indexOf('localhost') > -1 ? ('http://localhost:' + serverPort ) : '') ,
        apiVersion: pack.version
    };

var server = new Hapi.Server()

server.connection({
    port: serverPort,
    labels: ['api', 'ws'],
    routes: {
        cors: true
    }
})


var apiServer = server.select('api')
var wsServer = server.select('ws')

Chat.setup(wsServer)
//Stream.setup(wsServer)

apiServer.register({
    register: require('hapi-swagger'),
    options: swaggerOptions
}, function (err) {
    if (err) {
        server.log(['error'], 'hapi-swagger load error: ' + err)
    }else{
        server.log(['start'], 'hapi-swagger interface loaded')
    }
});

apiServer.register(require('hapi-auth-jwt2'), function (err) {

    if (err) {
        console.log(err);
    }

    server.auth.strategy('jwt', 'jwt', true,
        {
            key: PRIVATE_KEY, // Never Share your secret key
            validateFunc: AuthenticationController.validate       // validate function defined above
        });
});



routes.forEach(function(route) {
    route.handler = Co.wrap(route.handler)
})

apiServer.route(routes)

if (!module.parent) {
    server.start(function() {
        console.log('Example is rocking your world at port %s', serverPort)
    })
}

module.exports = server
