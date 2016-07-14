'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _zh_CN = require('gregorian-calendar/lib/locale/zh_TW');

var _zh_CN2 = _interopRequireDefault(_zh_CN);

var _zh_CN3 = require('rc-calendar/lib/locale/zh_TW');

var _zh_CN4 = _interopRequireDefault(_zh_CN3);

var _zh_CN5 = require('../../time-picker/locale/zh_TW');

var _zh_CN6 = _interopRequireDefault(_zh_CN5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 统一合并为完整的 Locale
var locale = _extends({}, _zh_CN2["default"]);
locale.lang = _extends({
  placeholder: '請選擇日期',
  rangePlaceholder: ['開始日期', '結束日期']
}, _zh_CN4["default"]);

locale.timePickerLocale = _extends({}, _zh_CN6["default"]);

// should add whitespace between char in Button
locale.lang.ok = '確 認';

// All settings at:
// https://github.com/ant-design/ant-design/issues/424

exports["default"] = locale;
module.exports = exports['default'];