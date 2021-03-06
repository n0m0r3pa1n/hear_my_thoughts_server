import * as UsersController from '../controllers/Users.js'
import * as SessionsController from '../controllers/Sessions.js'
import * as AuthController from '../controllers/Auth.js'
import {AUTH_TYPE} from '../config.js'

var Boom = require('boom')
var Joi = require('joi')

export default [
    {
        method: "GET",
        path: "/users/{email}",
        handler: function*(req,reply) {
            let user = yield UsersController.get(req.params.email);
            if(!user) {
                reply(Boom.notFound("User not found!"))
            }

            reply(AuthController.getToken(user.id));
        },
        config: {
            validate: {
                params: {
                    email: Joi.string().required()
                },
            },
            auth: false,
            description: 'Get a user by email',
            tags: ['api']
        }
    },
    {
        method: "POST",
        path: "/users",
        handler: function*(req,reply) {
            let user = yield UsersController.create(req.payload.email, req.payload.name, req.payload.profilePicture);
            if (user != null && user != undefined) {
                reply({
                    _id: user.id,
                    token: AuthController.generateToken(user.id),
                    name: user.name,
                    email: user.email,
                    profilePicture: user.profilePicture
                })
            }
            reply(Boom.notFound("User not found!"))
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
    },
    {
        method: "GET",
        path: "/user/sessions",
        handler: function*(req,reply) {
            let sessions = yield SessionsController.getSessionsForUser(req.auth.credentials._id);
            reply({sessions: sessions});
        },
        config: {
            description: 'Get sessions for user',
            tags: ['api']
        }
    }
]