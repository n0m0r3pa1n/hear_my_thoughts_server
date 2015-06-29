var User = require('../models').User

export function* get(email) {
    return yield User.findOne({email: email}).exec()
}

export function* create(email, name) {
    return yield User.findOneOrCreate({email: email}, {email: email, name: name})
}

export function* exists(userId) {
    let isExisting = yield User.findOne({_id: userId}).exec()
    return isExisting != null;
}

export function* getById(userId) {
    return yield User.findOne({_id: userId}).exec()
}

