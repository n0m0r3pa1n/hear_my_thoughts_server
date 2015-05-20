'use strict';

var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var Timestamps = require('mongoose-timestamp');
var Co = require('co');
Timestamps = require('mongoose-timestamp');

Mongoose.plugin(function (schema) {

    schema.statics.findOneOrCreate = function findOneOrCreate(condition, doc) {
        var wrapper = Co.wrap(function* (self, condition, doc) {
            var foundDoc = yield self.findOne(condition).exec();
            if (foundDoc) {
                return foundDoc;
            } else {
                return yield self.create(doc);
            }
        });

        var self = this;
        return wrapper(self, condition, doc);
    };
});

var userSchema = new Schema({
    name: String,
    email: { type: String, required: true },
    physicalAddress: String
});

userSchema.plugin(Timestamps);

module.exports.User = Mongoose.model('User', userSchema);