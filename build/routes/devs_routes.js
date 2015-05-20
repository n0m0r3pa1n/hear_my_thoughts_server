"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _controllersDevsJs = require("../controllers/Devs.js");

var _controllersDevsJs2 = _interopRequireDefault(_controllersDevsJs);

exports["default"] = [{
    method: "GET",
    path: "/devs",
    handler: function* handler(req, reply) {
        var ctrl = new _controllersDevsJs2["default"]();
        ctrl.add();
        reply((yield ctrl.getAll()));
    },
    config: {
        validate: {},
        description: "Test",
        tags: ["api"]
    }
}];
module.exports = exports["default"];