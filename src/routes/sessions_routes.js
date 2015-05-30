import * as SessionsController from '../controllers/Sessions.js'

var Joi = require('joi')
var Boom = require('boom')

export default [
    {
        method: 'GET',
        path: '/sessions/{shortId}/actions/join',
        handler: function* (req, reply) {
            let session = yield SessionsController.find(req.params.shortId);
            if(session === null) {
                reply(Boom.notFound("Wrong session code!"));
            }
            SessionsController.join(session, req.auth.credentials);
            reply(session)
        },
        config: {
            validate: {
                params: {
                    shortId: Joi.string().required()
                }
            },
            description: 'Let a user join a session',
            tags: ['api']
        }
    },
    {
        method: 'GET',
        path: '/sessions/{shortId}/chat',
        handler: function* (req, reply) {
            let messages = yield SessionsController.getChatMessages(req.params.shortId);
            if(messages === null) {
                reply(Boom.notFound("Wrong session code!"));
            }

            reply({messages: messages})
        },
        config: {
            validate: {
                params: {
                    shortId: Joi.string().required()
                }
            },
            description: 'Get chat messages for user',
            tags: ['api']
        }
    },
    {
        method: 'GET',
        path: '/sessions/{shortId}/actions/leave',
        handler: function* (req, reply) {
            let session = yield SessionsController.find(req.params.shortId);
            if(session == null) {
                reply(Boom.notFound("Wrong session code!"));
            }
            SessionsController.leave(session, req.auth.credentials._id);
            reply(session)
        },
        config: {
            validate: {
                params: {
                    shortId: Joi.string().required()
                }
            },
            description: 'Let a user leave a session',
            tags: ['api']
        }
    },
    {
        method: 'POST',
        path: '/sessions',
        handler: function* (req, reply) {
            var session = yield SessionsController.create(req.auth.credentials._id, req.payload.name)
            reply(session)
        },
        config: {
            validate: {
                payload: {
                    name: Joi.string().required()
                }
            },
            description: 'Create a session',
            tags: ['api']
        }
    }
]