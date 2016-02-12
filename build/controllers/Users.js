'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.get = get;
exports.create = create;
exports.exists = exists;
exports.getById = getById;
var User = require('../models').User;

function* get(email) {
    return yield User.findOne({ email: email }).exec();
}

function* create(email, name, profilePicture) {
    return yield User.findOneOrCreate({ email: email }, { email: email, name: name, profilePicture: profilePicture });
}

function* exists(userId) {
    var isExisting = yield User.findOne({ _id: userId }).exec();
    return isExisting != null;
}

function* getById(userId) {
    return yield User.findOne({ _id: userId }).exec();
}