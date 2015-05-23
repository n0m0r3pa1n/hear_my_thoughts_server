'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _routesUsers_routesJs = require('./routes/users_routes.js');

var _routesUsers_routesJs2 = _interopRequireDefault(_routesUsers_routesJs);

var _routesSessions_routesJs = require('./routes/sessions_routes.js');

var _routesSessions_routesJs2 = _interopRequireDefault(_routesSessions_routesJs);

var routes = [];
routes = routes.concat(_routesUsers_routesJs2['default']);
routes = routes.concat(_routesSessions_routesJs2['default']);

exports['default'] = routes;
module.exports = exports['default'];