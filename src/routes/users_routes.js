import * as UsersController from '../controllers/Users.js'
import * as AuthController from '../controllers/Auth.js'

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
    },
    {
        method: "POST",
        path: "/users",
        handler: function*(req,reply) {
            let user = yield UsersController.add(req.payload.email, req.payload.name);
            if (user != null && user != undefined) {
                reply({token: AuthController.generateToken(user.id)})
            }
            reply({})
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
    },
    {
        method: "GET",
        path: "/users",
        handler: function*(req,reply) {
            reply({test: AuthController.generateToken("TETETE")});
        },
        config: {
            validate: {

            },
            auth: false
        }
    },

    {
        method: "GET",
        path: "/users2",
        handler: function*(req,reply) {
            reply({test: "test"});
        },
        config: {
            validate: {

            },
            auth: 'jwt'
        }
    },

]