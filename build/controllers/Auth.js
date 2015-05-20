'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.generateToken = generateToken;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _configJs = require('../config.js');

var _UsersJs = require('./Users.js');

var UsersController = _interopRequireWildcard(_UsersJs);

var Co = require('co');

var jwt = require('jsonwebtoken');

var validate = function validate(decoded, request, callback) {
    Co(function* () {
        return yield UsersController.exists(decoded.userId);
    }).then(function (result) {
        return callback(null, result);
    });
};

exports.validate = validate;

function generateToken(userId) {
    return jwt.sign({ userId: userId }, _configJs.PRIVATE_KEY);
}