'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.isRemote = isRemote;
exports.getExpects = getExpects;
exports.isMatch = isMatch;
exports.getParams = getParams;
exports.getRes = getRes;

var _url = require('url');

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _withDb = require('mime-type/with-db');

var _withDb2 = _interopRequireDefault(_withDb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function decodeParam(val) {
  if (typeof val !== 'string' || val.length === 0) {
    return val;
  }

  return decodeURIComponent(val);
}

function isRemote(str) {
  return str.indexOf('http://') === 0 || str.indexOf('https://') === 0;
}

function getExpects(pattern) {
  var expect = {};
  if (pattern.indexOf(' ') > -1) {
    var _pattern$split = pattern.split(/\s+/);

    var _pattern$split2 = _slicedToArray(_pattern$split, 2);

    expect.expectMethod = _pattern$split2[0];
    expect.expectPattern = _pattern$split2[1];
  } else {
    expect.expectPattern = pattern;
  }

  return expect;
}

function isMatch(req, pattern) {
  var method = req.method;
  var url = req.url;

  var urlObj = (0, _url.parse)(url);

  var _getExpects = getExpects(pattern);

  var expectMethod = _getExpects.expectMethod;
  var expectPattern = _getExpects.expectPattern;
  // Match method first.

  if (expectMethod && expectMethod.toUpperCase() !== method.toUpperCase()) {
    return false;
  }

  if (isRemote(expectPattern)) {
    var _parseUrl = (0, _url.parse)(expectPattern);

    var hostname = _parseUrl.hostname;
    var port = _parseUrl.port;
    var path = _parseUrl.path;

    return hostname === urlObj.hostname && (port || '80') === (urlObj.port || '80') && !!urlObj.path.match((0, _pathToRegexp2.default)(path));
  }

  return !!urlObj.pathname.match((0, _pathToRegexp2.default)(expectPattern));
}

function getParams(url, pattern) {
  var keys = [];
  var path = pattern.trim().indexOf(' ') > -1 ? pattern.split(' ')[1] : pattern;
  if (path === '/') {
    return {};
  }

  var regexp = (0, _pathToRegexp2.default)(path, keys);
  var m = regexp.exec(url);
  if (!keys.length || !m) {
    return {};
  }

  return m.slice(1).reduce(function (prev, ms, index) {
    var key = keys[index];
    var prop = key.name;
    var val = decodeParam(ms);
    if (val !== undefined || !Object.prototype.hasOwnProperty.call(prev, prop)) {
      return _extends({}, prev, _defineProperty({}, prop, val));
    }
    return prev;
  }, {});
}

function getRes(req, callback) {
  var _status = 200;
  var headers = {
    'access-control-allow-origin': '*'
  };

  function normalizeData(data) {
    switch (typeof data === 'undefined' ? 'undefined' : _typeof(data)) {
      case 'string':
        return data;
      default:
        return JSON.stringify(data);
    }
  }

  return {
    type: function type(_type) {
      return this.set('Content-Type', _withDb2.default.lookup(_type));
    },
    set: function set(key, val) {
      if ((0, _isPlainObject2.default)(key)) {
        headers = _extends({}, headers, key);
      } else {
        headers[key] = val;
      }
      return this;
    },
    status: function status(statusCode) {
      _status = statusCode;
      return this;
    },
    json: function json(data) {
      return this.type('json').end(JSON.stringify(data));
    },
    jsonp: function jsonp(data, callbackName) {
      if (!req.query || req.query[callbackName || 'callback'] === undefined) {
        return this.type('json').status(400).end({
          errors: [{
            status: 400,
            detail: 'Should provide a callback for JSONP'
          }]
        });
      }

      var fn = req.query[callbackName || 'callback'];
      return this.type('json').end(fn + '(' + JSON.stringify(data) + ')');
    },
    end: function end(data) {
      callback(_status, headers, normalizeData(data));
      return this;
    }
  };
}