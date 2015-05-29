var Mongoose = require('mongoose')
var Schema = Mongoose.Schema
var Timestamps = require('mongoose-timestamp')
var Co = require("co")
Timestamps = require('mongoose-timestamp')

Mongoose.plugin(function(schema) {

    schema.statics.findOneOrCreate = function findOneOrCreate(condition, doc) {
        var wrapper = Co.wrap(function* (self, condition, doc) {
            try {
                var foundDoc = yield self.findOne(condition).exec()
                if (foundDoc) {
                    return foundDoc
                } else {
                    return yield self.create(doc)
                }
            } catch (e) {
                console.log(e);
            }
        })

        var self = this
        return wrapper(self, condition, doc)
    };
});

var userSchema = new Schema(
    {
        name: String,
        email: {type: String, required: true},
        physicalAddress: String
    }
)


var messageSchema = new Schema({
    text: String,
    user: {type: Schema.Types.ObjectId, ref: 'User'}
})

var streamSchema = new Schema({
    text: String,
    audioLink: String
})

var sessionSchema = new Schema(
    {
        shortId: {type: String, unique: true},
        name: String,
        lecturer: {type: Schema.Types.ObjectId, ref: 'User'},
        participants: [{type: Schema.Types.ObjectId, ref: 'User'}],
        stream: {type: Schema.Types.ObjectId, ref: 'Stream'},
        content: String,
        chat: [{type: Schema.Types.ObjectId, ref: 'Message'}]
    }
)


userSchema.plugin(Timestamps)
sessionSchema.plugin(Timestamps)
messageSchema.plugin(Timestamps)
streamSchema.plugin(Timestamps)

module.exports.User = Mongoose.model('User', userSchema)
module.exports.Message = Mongoose.model('Message', messageSchema)
module.exports.Stream = Mongoose.model('Stream', streamSchema)
module.exports.Session = Mongoose.model('Session', sessionSchema)
