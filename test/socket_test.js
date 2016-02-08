var Mongoose = require("mongoose")
var sinon = require('sinon')
var should = require('chai').should()
var assert = require('chai').assert
var expect = require('chai').expect
var io = require('socket.io-client');
var Co = require('co');

var socketURL = 'http://localhost:8081';

var options = {
    transports: ['websocket'],
    'force new connection': true
};

describe("Socket", function () {
    it('Should receive unseen events', function (done) {
        var client1 = io.connect(socketURL, options);
        console.log(client1)
        var client2 = io.connect(socketURL, options);

        client1.on('connect_error', function (error) {
            console.log(error)
        })
        client1.on('connect', function (data, error) {
            console.log('AAAAAAAAAAAAAAAAAAAAA')
            console.log('connect 1')
            client2.on('connect', function (data, error) {
                console.log('connect 2')
                done()
            })

        })
    })
})