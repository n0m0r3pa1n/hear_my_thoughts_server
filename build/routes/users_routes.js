'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _controllersUsersJs = require('../controllers/Users.js');

var UsersController = _interopRequireWildcard(_controllersUsersJs);

var _controllersAuthJs = require('../controllers/Auth.js');

var AuthController = _interopRequireWildcard(_controllersAuthJs);

var Boom = require('boom');
var Joi = require('joi');

exports['default'] = [{
    method: 'GET',
    path: '/users/{email}',
    handler: function* handler(req, reply) {
        var user = yield UsersController.get(req.params.email);
        if (!user) {
            reply(Boom.notFound('User not found!'));
        }

        reply(user);
    },
    config: {
        validate: {
            params: {
                email: Joi.string().required()
            }
        },
        description: 'Test',
        tags: ['api']
    }
}, {
    method: 'POST',
    path: '/users',
    handler: function* handler(req, reply) {
        var user = yield UsersController.add(req.payload.email, req.payload.name);
        if (user != null && user != undefined) {
            reply({ token: AuthController.generateToken(user.id) });
        }
        reply({});
    },
    config: {
        validate: {
            params: {
                name: Joi.string(),
                email: Joi.string().required()
            }
        },
        description: 'Test',
        tags: ['api']
    }
}, {
    method: 'GET',
    path: '/users',
    handler: function* handler(req, reply) {
        reply({ test: AuthController.generateToken('TETETE') });
    },
    config: {
        validate: {},
        auth: false
    }
}, {
    method: 'GET',
    path: '/users2',
    handler: function* handler(req, reply) {
        reply({ test: 'test' });
    },
    config: {
        validate: {},
        auth: 'jwt'
    }
}];
module.exports = exports['default'];