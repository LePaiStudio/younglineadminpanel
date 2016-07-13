'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (args) {
  var cwd = args.cwd;
  var getProxyConfig = args.getProxyConfig;
  var log = args.log;


  return {
    summary: function summary() {
      return 'Anyproxy rule: dora-plugin-proxy';
    },
    shouldInterceptHttpsReq: function shouldInterceptHttpsReq() {
      return true;
    },
    shouldUseLocalResponse: function shouldUseLocalResponse(req) {
      return batchMatch(req, getProxyConfig(), function (val) {
        if (typeof val === 'function') {
          return true;
        }
        if (typeof val === 'string' && !(0, _utils.isRemote)(val)) {
          return true;
        }
        if ((0, _isPlainObject2.default)(val) || Array.isArray(val)) {
          return true;
        }
      }) || false;
    },
    dealLocalResponse: function dealLocalResponse(_req, reqBody, callback) {
      var req = _req;
      return batchMatch(req, getProxyConfig(), function (val, pattern) {
        // Add body, query, params to req Object
        if (reqBody) {
          // TODO: support FormData
          req.body = reqBody.toString();
        }
        var urlObj = (0, _url.parse)(req.url);
        if (urlObj.query) {
          req.query = (0, _qs.parse)(urlObj.query);
        }
        req.params = (0, _utils.getParams)(urlObj.pathname, pattern);

        // Handle with custom function
        if (typeof val === 'function') {
          log.info(req.method + ' ' + req.url + ' matches ' + pattern + ', respond with custom function');
          val(req, (0, _utils.getRes)(req, callback));
          return true;
        }

        // Handle with local file
        if (typeof val === 'string' && !(0, _utils.isRemote)(val)) {
          log.info(req.method + ' ' + req.url + ' matches ' + pattern + ', respond with local file');
          (0, _utils.getRes)(req, callback).end((0, _fs.readFileSync)((0, _path.join)(cwd, val), 'utf-8'));
          return true;
        }

        // Handle with object or array
        if ((0, _isPlainObject2.default)(val) || Array.isArray(val)) {
          log.info(req.method + ' ' + req.url + ' matches ' + pattern + ', respond with object or array');
          (0, _utils.getRes)(req, callback).json(val);
          return true;
        }
      });
    },

    /**
    //=======================
    //when ready to send a request to server
    //向服务端发出请求之前
    //=======================
    */
    replaceRequestProtocol: function replaceRequestProtocol(req) {
      return batchMatch(req, getProxyConfig(), function (val) {
        if (val.indexOf('https://') === 0) {
          return 'https';
        }
      }) || 'http';
    },
    replaceRequestOption: function replaceRequestOption(req, option) {
      var newOption = option;
      var reqObj = _url2.default.parse(req.url);
      var isModified = false;

      function setOption(val) {
        var _urlLib$parse = _url2.default.parse(val);

        var hostname = _urlLib$parse.hostname;
        var port = _urlLib$parse.port;
        var path = _urlLib$parse.path;

        newOption.hostname = hostname;
        if (port) {
          newOption.port = port;
        }
        newOption.path = winPath((0, _path.join)(path, reqObj.path));
        // Fix anyproxy
        delete newOption.headers.host;
      }

      batchMatch(req, getProxyConfig(), function (val, pattern) {
        if ((0, _utils.isRemote)(val)) {
          log.info(req.method + ' ' + req.url + ' matches ' + pattern + ', forward to ' + val);
          isModified = true;
          setOption(val);
          return true;
        }
      });

      if (!isModified) {
        newOption.hostname = args.hostname;
        newOption.port = args.port;
        log.debug(req.method + ' ' + req.url + ' don\'t match any rule, forward to ' + args.hostname + ':' + args.port);
      }

      return newOption;
    },
    replaceRequestData: function replaceRequestData(req, data) {
      return data;
    },


    /**
    //=======================
    //when ready to send the response to user after receiving response from server
    //向用户返回服务端的响应之前
    //=======================
    */
    replaceResponseStatusCode: function replaceResponseStatusCode(req, res, statusCode) {
      return statusCode;
    },
    replaceResponseHeader: function replaceResponseHeader(req, res, header) {
      return _extends({}, header, {
        'access-control-allow-origin': '*'
      });
    },
    replaceServerResDataAsync: function replaceServerResDataAsync(req, res, serverResData, callback) {
      callback(serverResData);
    },
    pauseBeforeSendingResponse: function pauseBeforeSendingResponse() {
      return 1;
    }
  };
};

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _utils = require('./utils');

var _path = require('path');

var _fs = require('fs');

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _qs = require('qs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function batchMatch(req, proxyConfig, fn) {
  for (var pattern in proxyConfig) {
    if (proxyConfig.hasOwnProperty(pattern)) {
      var val = proxyConfig[pattern];
      if ((0, _utils.isMatch)(req, pattern)) {
        var result = fn(val, pattern);
        if (result) {
          return result;
        }
      }
    }
  }
}

function winPath(path) {
  return path.replace(/\\/g, '/');
}

module.exports = exports['default'];