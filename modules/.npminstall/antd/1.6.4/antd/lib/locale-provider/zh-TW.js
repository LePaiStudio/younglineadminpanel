'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _zh_TW = require('rc-pagination/lib/locale/zh-TW');

var _zh_TW2 = _interopRequireDefault(_zh_TW);

var _zh_TW3 = require('../date-picker/locale/zh-TW');

var _zh_TW4 = _interopRequireDefault(_zh_TW3);

var _zh_TW5 = require('../time-picker/locale/zh-TW');

var _zh_TW6 = _interopRequireDefault(_zh_TW5);

var _zh_TW7 = require('../calendar/locale/zh-TW');

var _zh_TW8 = _interopRequireDefault(_zh_TW7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports["default"] = {
  Pagination: _zh_TW2["default"],
  DatePicker: _zh_TW4["default"],
  TimePicker: _zh_TW6["default"],
  Calendar: _zh_TW8["default"],
  Table: {
    filterTitle: '篩選菜單',
    filterConfirm: 'OK',
    filterReset: '重置',
    emptyText: '沒有資料'
  },
  Modal: {
    okText: 'OK',
    cancelText: '取消',
    justOkText: 'OK'
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: '取消'
  },
  Transfer: {
    notFoundContent: '無法找到相關項目',
    searchPlaceholder: '在這裡搜索',
    itemUnit: '項目',
    itemsUnit: '多個項目'
  },
  Select: {
    notFoundContent: '無法找到相關項目'
  }
};
module.exports = exports['default'];