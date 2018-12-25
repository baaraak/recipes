'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _methodOverride = require('method-override');

var _methodOverride2 = _interopRequireDefault(_methodOverride);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _constants = require('./config/constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var server = require('http').Server(app);

app.use((0, _cors2.default)());
app.use((0, _helmet2.default)());
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use((0, _methodOverride2.default)());

// Mount API routes
app.use(_constants2.default.apiPrefix, _routes2.default);

server.listen(_constants2.default.port, function () {
  console.log('\n    Port: ' + _constants2.default.port + '\n    Env: ' + app.get('env') + '\n  ');
});

exports.default = app;