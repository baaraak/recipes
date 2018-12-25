'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _user = require('./models/user');

var _user2 = _interopRequireDefault(_user);

var _company = require('./models/company');

var _company2 = _interopRequireDefault(_company);

var _plata = require('./models/plata');

var _plata2 = _interopRequireDefault(_plata);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createError = function createError(message, status) {
  var err = new Error(message);
  err.status = status;
  return err;
};

var Controller = function Controller() {
  var _this = this;

  (0, _classCallCheck3.default)(this, Controller);

  this.login = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
      var _req$body, username, password;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _req$body = req.body, username = _req$body.username, password = _req$body.password;

              if (!(username === 'admin' && password === 'admin')) {
                _context.next = 5;
                break;
              }

              return _context.abrupt('return', res.status(200).json({ success: true }));

            case 5:
              return _context.abrupt('return', res.status(401).json({ success: false, error: 'לא נכון' }));

            case 6:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();

  this.addCompany = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res, next) {
      var _req$body2, name, data, company;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _req$body2 = req.body, name = _req$body2.name, data = _req$body2.data;

              if (!(!name || !data)) {
                _context2.next = 3;
                break;
              }

              return _context2.abrupt('return', res.status(400).json({ success: false, error: 'הכנס שם, ופרטים' }));

            case 3:
              _context2.prev = 3;
              company = new _company2.default({ name: name, data: data });

              company.save();
              res.json({ success: true, company: company });
              _context2.next = 12;
              break;

            case 9:
              _context2.prev = 9;
              _context2.t0 = _context2['catch'](3);
              return _context2.abrupt('return', res.status(400).json({ success: false, error: 'db error' }));

            case 12:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this, [[3, 9]]);
    }));

    return function (_x4, _x5, _x6) {
      return _ref2.apply(this, arguments);
    };
  }();

  this.deleteCompany = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res, next) {
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return _company2.default.remove({ name: req.body.name });

            case 3:
              return _context3.abrupt('return', res.json({ success: true }));

            case 6:
              _context3.prev = 6;
              _context3.t0 = _context3['catch'](0);
              return _context3.abrupt('return', res.status(400).json({ success: false, error: 'db error' }));

            case 9:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this, [[0, 6]]);
    }));

    return function (_x7, _x8, _x9) {
      return _ref3.apply(this, arguments);
    };
  }();

  this.addPlata = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res, next) {
      var _req$body3, name, price, plata;

      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _req$body3 = req.body, name = _req$body3.name, price = _req$body3.price;

              if (!(!name || !price)) {
                _context4.next = 3;
                break;
              }

              return _context4.abrupt('return', res.status(400).json({ success: false, error: 'הכנס שם, ומחיר' }));

            case 3:
              _context4.prev = 3;
              plata = new _plata2.default({ name: name, price: price });

              plata.save();
              res.json({ success: true, plata: plata });
              _context4.next = 12;
              break;

            case 9:
              _context4.prev = 9;
              _context4.t0 = _context4['catch'](3);
              return _context4.abrupt('return', res.status(400).json({ success: false, error: 'db error' }));

            case 12:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, _this, [[3, 9]]);
    }));

    return function (_x10, _x11, _x12) {
      return _ref4.apply(this, arguments);
    };
  }();

  this.deletePlata = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res, next) {
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return _plata2.default.remove({ name: req.body.name });

            case 3:
              return _context5.abrupt('return', res.json({ success: true }));

            case 6:
              _context5.prev = 6;
              _context5.t0 = _context5['catch'](0);
              return _context5.abrupt('return', res.status(400).json({ success: false, error: 'db error' }));

            case 9:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, _this, [[0, 6]]);
    }));

    return function (_x13, _x14, _x15) {
      return _ref5.apply(this, arguments);
    };
  }();

  this.getAll = function () {
    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(req, res, next) {
      var companies, platot;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return _company2.default.find();

            case 3:
              companies = _context6.sent;
              _context6.next = 6;
              return _plata2.default.find();

            case 6:
              platot = _context6.sent;
              return _context6.abrupt('return', res.json({ success: true, companies: companies, platot: platot }));

            case 10:
              _context6.prev = 10;
              _context6.t0 = _context6['catch'](0);

              console.log('in catch', _context6.t0);
              return _context6.abrupt('return', res.status(400).json({ success: false, error: 'db error' }));

            case 14:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, _this, [[0, 10]]);
    }));

    return function (_x16, _x17, _x18) {
      return _ref6.apply(this, arguments);
    };
  }();
};

exports.default = new Controller();