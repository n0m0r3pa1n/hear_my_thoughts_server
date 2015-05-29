var Models = require('../models')
var Session = Models.Session
var Stream = Models.Stream
var ShortId = require('shortid')

export function* getSessionsForUser(userId) {
    return yield Session.find({$or: [{lecturer: userId}, {participants: userId}]}).populate('lecturer participants stream chat').exec()
}

export function* create(lecturerId, name) {
    let shortId = yield getUniqueShortId();
    let session = new Session({
        lecturer: lecturerId,
        name: name,
        shortId: shortId,
        stream: null
    })

    yield session.save();
    return session;
}

export function* updateStream(shortId, streamText) {
    let session = yield find(shortId);
    if(session == null) {
        return;
    }

    if(session.stream == null || session.stream == undefined) {
        let stream  = new Stream({text: streamText})
        yield stream.save()
        session.stream = stream;
        yield session.save()
        return;
    }

    let stream = yield Stream.findOne({_id: session.stream.id}).exec();
    stream.text = streamText;
    yield stream.save()
}

export function* find(shortId) {
    return yield Session.findOne({shortId: shortId}).populate('participants stream').exec();
}

export function join(session, user) {
    let participants = session.participants;
    if(participants === undefined || participants === null) {
        participants = [];
    }

    let size = participants.length;
    for(let i=0; i < size; i++) {
        if(String(participants[i]._id) === String(user._id)) {
            return;
        }
    }

    participants.push(user);
    session.save(function(error, result) {
        console.log(error)
    });
}

export function leave(session, userId) {
    let participants = session.participants;
    if(participants === undefined || participants === null) {
        return;
    }

    let size = participants.length;
    for(let i=0; i < size; i++) {
        if(String(participants[i]._id) === String(userId)) {
            participants.splice(i, 1);
            return;
        }
    }

    session.save(function(result, error) {
    });
}

function* getUniqueShortId() {
    let shortId = ShortId.generate();
    shortId = shortId.length > 5 ? shortId.substr(0, 3) : shortId;
    let session = yield Session.findOne({shortId: shortId}).exec();
    let isDuplicate = session != null
    if(isDuplicate !== false) {
        shortId = yield getUniqueShortId();
    }

    return shortId;
}

export function* exists(userId) {
    let isExisting = yield Session.findOne({id: userId}).exec()
    return isExisting != null;
}

