'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.default = authenticate;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _constants = require('../config/constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sessionSecret = _constants2.default.security.sessionSecret;
function authenticate(req, res, next) {
  var _this = this;

  var authorization = req.headers.authorization;

  _jsonwebtoken2.default.verify(authorization, sessionSecret, function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(err, decoded) {
      var user;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!err) {
                _context.next = 2;
                break;
              }

              return _context.abrupt('return', res.sendStatus(401));

            case 2:
              _context.prev = 2;
              _context.next = 5;
              return _user2.default.findById(decoded._id);

            case 5:
              user = _context.sent;

              if (user) {
                _context.next = 8;
                break;
              }

              return _context.abrupt('return', res.sendStatus(401));

            case 8:
              req.currentUser = user;
              next();
              _context.next = 15;
              break;

            case 12:
              _context.prev = 12;
              _context.t0 = _context['catch'](2);

              next(_context.t0);

            case 15:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this, [[2, 12]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
}