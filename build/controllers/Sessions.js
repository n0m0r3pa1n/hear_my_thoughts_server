'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.getSessionsForUser = getSessionsForUser;
exports.create = create;
exports.updateStream = updateStream;
exports.find = find;
exports.join = join;
exports.leave = leave;
exports.exists = exists;
var Models = require('../models');
var Session = Models.Session;
var Stream = Models.Stream;
var ShortId = require('shortid');

function* getSessionsForUser(userId) {
    return yield Session.find({ $or: [{ lecturer: userId }, { participants: userId }] }).populate('lecturer participants stream chat').exec();
}

function* create(lecturerId, name) {
    var shortId = yield getUniqueShortId();
    var session = new Session({
        lecturer: lecturerId,
        name: name,
        shortId: shortId,
        stream: null
    });

    yield session.save();
    return session;
}

function* updateStream(shortId, streamText) {
    var session = yield find(shortId);
    if (session == null) {
        return;
    }

    if (session.stream == null || session.stream == undefined) {
        var _stream = new Stream({ text: streamText });
        yield _stream.save();
        session.stream = _stream;
        yield session.save();
        return;
    }

    var stream = yield Stream.findOne({ _id: session.stream.id }).exec();
    stream.text = streamText;
    yield stream.save();
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