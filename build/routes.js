'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _routesDevs_routesJs = require('./routes/devs_routes.js');

var _routesDevs_routesJs2 = _interopRequireDefault(_routesDevs_routesJs);

var _routesUsers_routesJs = require('./routes/users_routes.js');

var _routesUsers_routesJs2 = _interopRequireDefault(_routesUsers_routesJs);

var routes = [];
routes = routes.concat(_routesDevs_routesJs2['default']);
routes = routes.concat(_routesUsers_routesJs2['default']);

exports['default'] = routes;
module.exports = exports['default'];