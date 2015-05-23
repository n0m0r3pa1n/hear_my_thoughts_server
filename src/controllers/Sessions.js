var Session = require('../models').Session
var ShortId = require('shortid')

export function* getSessionsForUser(userId) {
    return yield Session.find({$or: [{lecturer: userId}, {participants: userId}]}).exec()
}

export function* create(lecturerId, name) {
    let shortId = yield getUniqueShortId();
    let session = new Session({
        lecturer: lecturerId,
        name: name,
        shortId: shortId
    })

    yield session.save()
    return session;
}

export function* find(shortId) {
    return yield Session.findOne({shortId: shortId}).exec();
}

export function join(session, userId) {
    let participants = session.participants;
    if(participants === undefined || participants === null) {
        participants = [];
    }

    let size = participants.length;
    for(let i=0; i < size; i++) {
        if(String(participants[i]) === String(userId)) {
            return;
        }
    }

    participants.push(userId);
    session.save(function(result, error) {
    });
}

export function leave(session, userId) {
    let participants = session.participants;
    if(participants === undefined || participants === null) {
        return;
    }

    let size = participants.length;
    for(let i=0; i < size; i++) {
        if(String(participants[i]) === String(userId)) {
            participants.splice(i, 1);
            return;
        }
    }

    session.save(function(result, error) {
    });
}

function* getUniqueShortId() {
    let shortId = ShortId.generate();
    let session = yield Session.findOne({shortId: shortId}).exec();
    let isDuplicate = session != null
    if(isDuplicate) {
        shortId = yield getUniqueShortId();
    }

    return shortId;
}

export function* exists(userId) {
    let isExisting = yield Session.findOne({id: userId}).exec()
    return isExisting != null;
}

