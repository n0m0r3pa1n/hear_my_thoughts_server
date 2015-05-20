var User = require('../models').User

export function *get(email) {
    return yield User.findOne({email: email}).exec()
}

export function* add(email, name) {
    return yield User.findOneOrCreate({email: email}, {email: email, name: name}).exec()
}

export function* exists(userId) {
    let isExisting = yield User.findOne({id: userId}).exec()
    return isExisting != null;
}

