'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var PlataSchema = new Schema({
    name: String,
    price: String
}, {
    timestamps: true
});

var PlataModel = _mongoose2.default.model('Plata', PlataSchema);

exports.default = PlataModel;