'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createServer;

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _plugin = require('./plugin');

var _spmLog = require('spm-log');

var _spmLog2 = _interopRequireDefault(_spmLog);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultCwd = process.cwd();
var defaultArgs = {
  port: '8000',
  cwd: defaultCwd,
  enabledMiddlewareServeIndex: true,
  enabledMiddlewareStatic: true,
  resolveDir: [defaultCwd]
};
var data = {};

function createServer(_args, callback) {
  var args = _extends({}, defaultArgs, _args);
  _spmLog2.default.config(args);

  var port = args.port;
  var cwd = args.cwd;
  var resolveDir = args.resolveDir;

  var pluginNames = args.plugins;
  var context = { port: port, cwd: cwd };
  context.set = function (key, val) {
    data[key] = val;
  };
  context.get = function (key) {
    return data[key];
  };
  context.set('__server_listen_log', true);

  if (args.enabledMiddlewareStatic) {
    pluginNames.push((0, _path.join)(__dirname, './plugins/static'));
  }
  if (args.enabledMiddlewareServeIndex) {
    pluginNames.push((0, _path.join)(__dirname, './plugins/serve-index'));
  }

  var plugins = (0, _plugin.resolvePlugins)(pluginNames, resolveDir, cwd);
  function _applyPlugins(name, pluginArgs, _callback) {
    return (0, _plugin.applyPlugins)(plugins, name, context, pluginArgs, _callback);
  }
  context.applyPlugins = _applyPlugins;
  _spmLog2.default.debug('dora', '[plugins] ' + JSON.stringify(plugins));

  var app = context.app = (0, _koa2.default)();
  var server = void 0;

  process.on('exit', function () {
    _applyPlugins('process.exit');
  });

  _async2.default.series([function (next) {
    return _applyPlugins('middleware.before', null, next);
  }, function (next) {
    return _applyPlugins('middleware', null, next);
  }, function (next) {
    return _applyPlugins('middleware.after', null, next);
  }, function (next) {
    server = context.server = _http2.default.createServer(app.callback());next();
  }, function (next) {
    return _applyPlugins('server.before', null, next);
  }, function (next) {
    server.listen(port, function () {
      if (context.get('__server_listen_log')) {
        _spmLog2.default.info('dora', 'listened on ' + port);
      }
      context.set('__ready', true);
      next();
    });
  }, function (next) {
    return _applyPlugins('server.after', null, next);
  }], callback);
}
module.exports = exports['default'];