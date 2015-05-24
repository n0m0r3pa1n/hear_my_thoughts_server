'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _controllersSessionsJs = require('../controllers/Sessions.js');

var SessionsController = _interopRequireWildcard(_controllersSessionsJs);

var Joi = require('joi');
var Boom = require('boom');

exports['default'] = [{
    method: 'GET',
    path: '/sessions/{shortId}/actions/join',
    handler: function* handler(req, reply) {
        var session = yield SessionsController.find(req.params.shortId);
        if (session === null) {
            reply(Boom.notFound('Wrong session code!'));
        }
        SessionsController.join(session, req.auth.credentials);
        reply(session);
    },
    config: {
        validate: {
            params: {
                shortId: Joi.string().required()
            }
        }
    }
}, {
    method: 'GET',
    path: '/sessions/{shortId}/actions/leave',
    handler: function* handler(req, reply) {
        var session = yield SessionsController.find(req.params.shortId);
        if (session == null) {
            reply(Boom.notFound('Wrong session code!'));
        }
        SessionsController.leave(session, req.auth.credentials._id);
        reply(session);
    },
    config: {
        validate: {
            params: {
                shortId: Joi.string().required()
            }
        }
    }
}, {
    method: 'POST',
    path: '/sessions',
    handler: function* handler(req, reply) {
        var session = yield SessionsController.create(req.auth.credentials._id, req.payload.name);
        reply(session);
    },
    config: {
        validate: {
            payload: {
                name: Joi.string().required()
            }
        }
    }
}];
module.exports = exports['default'];