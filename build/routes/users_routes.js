'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _controllersUsersJs = require('../controllers/Users.js');

var UsersController = _interopRequireWildcard(_controllersUsersJs);

var _controllersSessionsJs = require('../controllers/Sessions.js');

var SessionsController = _interopRequireWildcard(_controllersSessionsJs);

var _controllersAuthJs = require('../controllers/Auth.js');

var AuthController = _interopRequireWildcard(_controllersAuthJs);

var _configJs = require('../config.js');

var Boom = require('boom');
var Joi = require('joi');

exports['default'] = [{
    method: "GET",
    path: "/users/{email}",
    handler: function* handler(req, reply) {
        var user = yield UsersController.get(req.params.email);
        if (!user) {
            reply(Boom.notFound("User not found!"));
        }

        reply(AuthController.getToken(user.id));
    },
    config: {
        validate: {
            params: {
                email: Joi.string().required()
            }
        },
        auth: false,
        description: 'Get a user by email',
        tags: ['api']
    }
}, {
    method: "POST",
    path: "/users",
    handler: function* handler(req, reply) {
        var user = yield UsersController.create(req.payload.email, req.payload.name, req.payload.profilePicture);
        if (user != null && user != undefined) {
            reply({
                _id: user.id,
                token: AuthController.generateToken(user.id),
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            });
        }
        reply(Boom.notFound("User not found!"));
    },
    config: {
        validate: {
            payload: {
                name: Joi.string().required(),
                email: Joi.string().email().required(),
                profilePicture: Joi.string().optional()
            }
        },
        auth: false,
        description: 'Get token when the user is successfully created!',
        tags: ['api']
    }
}, {
    method: "GET",
    path: "/user/sessions",
    handler: function* handler(req, reply) {
        var sessions = yield SessionsController.getSessionsForUser(req.auth.credentials._id);
        reply({ sessions: sessions });
    },
    config: {
        description: 'Get sessions for user',
        tags: ['api']
    }
}];
module.exports = exports['default'];