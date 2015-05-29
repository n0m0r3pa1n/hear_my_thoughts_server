'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.getSessionsForUser = getSessionsForUser;
exports.create = create;
exports.find = find;
exports.join = join;
exports.leave = leave;
exports.exists = exists;
var Session = require('../models').Session;
var ShortId = require('shortid');

function* getSessionsForUser(userId) {
    return yield Session.find({ $or: [{ lecturer: userId }, { participants: userId }] }).populate('lecturer participants stream chat').exec();
}

function* create(lecturerId, name) {
    var shortId = yield getUniqueShortId();
    var session = new Session({
        lecturer: lecturerId,
        name: name,
        shortId: shortId
    });

    yield session.save();
    return session;
}

function* find(shortId) {
    return yield Session.findOne({ shortId: shortId }).populate('participants stream').exec();
}

function join(session, user) {
    var participants = session.participants;
    if (participants === undefined || participants === null) {
        participants = [];
    }

    var size = participants.length;
    for (var i = 0; i < size; i++) {
        if (String(participants[i]._id) === String(user._id)) {
            return;
        }
    }

    participants.push(user);
    session.save(function (error, result) {
        console.log(error);
    });
}

function leave(session, userId) {
    var participants = session.participants;
    if (participants === undefined || participants === null) {
        return;
    }

    var size = participants.length;
    for (var i = 0; i < size; i++) {
        if (String(participants[i]._id) === String(userId)) {
            participants.splice(i, 1);
            return;
        }
    }

    session.save(function (result, error) {});
}

function* getUniqueShortId() {
    var shortId = ShortId.generate();
    shortId = shortId.length > 5 ? shortId.substr(0, 3) : shortId;
    var session = yield Session.findOne({ shortId: shortId }).exec();
    var isDuplicate = session != null;
    if (isDuplicate !== false) {
        shortId = yield getUniqueShortId();
    }

    return shortId;
}

function* exists(userId) {
    var isExisting = yield Session.findOne({ id: userId }).exec();
    return isExisting != null;
}