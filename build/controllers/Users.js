'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.get = get;
exports.add = add;
exports.exists = exists;
var User = require('../models').User;

function* get(email) {
    return yield User.findOne({ email: email }).exec();
}

function* add(email, name) {
    return yield User.findOneOrCreate({ email: email }, { email: email, name: name }).exec();
}

function* exists(userId) {
    var isExisting = yield User.findOne({ id: userId }).exec();
    return isExisting != null;
}