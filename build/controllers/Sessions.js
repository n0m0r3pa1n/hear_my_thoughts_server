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
    return yield Session.find({ $or: [{ lecturer: userId }, { participants: userId }] }).exec();
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
    return yield Session.findOne({ shortId: shortId }).exec();
}

function join(session, userId) {
    var participants = session.participants;
    if (participants === undefined || participants === null) {
        participants = [];
    }

    var size = participants.length;
    for (var i = 0; i < size; i++) {
        if (String(participants[i]) === String(userId)) {
            return;
        }
    }

    participants.push(userId);
    session.save(function (result, error) {});
}

function leave(session, userId) {
    var participants = session.participants;
    if (participants === undefined || participants === null) {
        return;
    }

    var size = participants.length;
    for (var i = 0; i < size; i++) {
        if (String(participants[i]) === String(userId)) {
            participants.splice(i, 1);
            return;
        }
    }

    session.save(function (result, error) {});
}

function* getUniqueShortId() {
    var shortId = ShortId.generate();
    var session = yield Session.findOne({ shortId: shortId }).exec();
    var isDuplicate = session != null;
    if (isDuplicate) {
        shortId = yield getUniqueShortId();
    }

    return shortId;
}

function* exists(userId) {
    var isExisting = yield Session.findOne({ id: userId }).exec();
    return isExisting != null;
}