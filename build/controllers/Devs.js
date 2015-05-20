"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Developer = require("../models").Developer;

var DevelopersController = (function () {
    function DevelopersController() {
        _classCallCheck(this, DevelopersController);
    }

    _createClass(DevelopersController, [{
        key: "contructor",
        value: function contructor() {}
    }, {
        key: "getAll",
        value: function* getAll() {
            var devs = yield Developer.find({}).exec();
            console.log(devs);
            return devs;
        }
    }, {
        key: "add",
        value: function add() {
            var dev = new Developer({ email: "Test123" });
            dev.save();
            return dev;
        }
    }]);

    return DevelopersController;
})();

exports["default"] = DevelopersController;
module.exports = exports["default"];