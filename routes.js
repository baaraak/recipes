'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

var _authenticate = require('./middleware/authenticate');

var _authenticate2 = _interopRequireDefault(_authenticate);

var _errorHandler = require('./middleware/error-handler');

var _errorHandler2 = _interopRequireDefault(_errorHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = new _express.Router();

routes.post('/auth/login', _controller2.default.login);

routes.get('/getAll', _controller2.default.getAll);

routes.post('/company', _controller2.default.addCompany);
routes.post('/company/delete', _controller2.default.deleteCompany);
routes.post('/plata', _controller2.default.addPlata);
routes.post('/plata/delete', _controller2.default.deletePlata);

routes.use(_errorHandler2.default);

exports.default = routes;