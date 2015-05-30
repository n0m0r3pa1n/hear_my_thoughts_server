'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.getSessionsForUser = getSessionsForUser;
exports.create = create;
exports.updateStream = updateStream;
exports.find = find;
exports.getChatMessages = getChatMessages;
exports.saveChatMessage = saveChatMessage;
exports.join = join;
exports.leave = leave;
exports.exists = exists;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _UsersJs = require('./Users.js');

var UsersController = _interopRequireWildcard(_UsersJs);

var Models = require('../models');
var Session = Models.Session;
var Stream = Models.Stream;
var Message = Models.Message;
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
    return yield Session.findOne({ shortId: shortId }).populate('participants stream chat').exec();
}

function* getChatMessages(shortId) {
    var session = yield find(shortId);
    if (session == null) {
        return null;
    }

    var newChat = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = session.chat[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var message = _step.value;

            message = yield Message.findOne(message).populate('user').exec();
            newChat.push(message);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return newChat;
}

function* saveChatMessage(shortId, userId, message) {
    var session = yield find(shortId);
    if (session == null) {
        return;
    }

    var user = yield UsersController.getById(userId.toString());
    if (user == null) return;

    if (session.chat == null || session.chat == undefined || session.chat.length <= 0) {
        session.chat = [];
    }
    var message = new Message({
        user: user,
        text: message
    });

    yield message.save();

    session.chat.push(message);
    yield session.save();
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