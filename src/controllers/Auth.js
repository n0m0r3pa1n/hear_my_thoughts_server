var Co = require('co')
import {PRIVATE_KEY} from '../config.js'
import * as UsersController from './Users.js'
var jwt = require('jsonwebtoken')

export var validate = function (decoded, request, callback) {
    Co(function* () {
        return yield UsersController.exists(decoded.userId)
    }).then(function(result) {
        return callback(null, result);
    });

};

export function generateToken(userId) {
    return jwt.sign({userId: userId}, PRIVATE_KEY);
}
