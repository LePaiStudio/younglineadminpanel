'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getProxyConfig;

var _cdeps = require('./cdeps');

var _cdeps2 = _interopRequireDefault(_cdeps);

var _fs = require('fs');

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getProxyConfig(configPath, args) {
  var cwd = args.cwd;
  var log = args.log;

  var proxyFile = (0, _path.join)(cwd, configPath);
  var defaultProxy = {};
  var clearCacheDelay = args.query.watchDelay || 300;
  var cache = undefined;
  var timer = undefined;

  var watchDirs = args.query.watchDirs || [];
  if (typeof watchDirs === 'string') watchDirs = [watchDirs];
  watchDirs = watchDirs.map(function (watchDir) {
    return (0, _path.join)(cwd, watchDir);
  });

  if ((0, _fs.existsSync)(proxyFile)) {
    log.info('load rule from ' + configPath);
  }

  function loadFile() {
    if (!cache && (0, _fs.existsSync)(proxyFile)) {
      log.debug('reload ' + configPath);
      var depList = (0, _cdeps2.default)(proxyFile);
      depList.forEach(function (dep) {
        return delete require.cache[require.resolve(dep)];
      });

      Object.keys(require.cache).forEach(function (key) {
        watchDirs.forEach(function (watchDir) {
          if (key.indexOf(watchDir) === 0) {
            log.debug('DELETE CACHE REQUIRE: ' + key);
            delete require.cache[key];
          }
        });
      });

      try {
        cache = require(proxyFile);
      } catch (e) {
        log.error(configPath + ' parse error');
      }
    }
    return cache;
  }

  function clearCache() {
    cache = null;
  }

  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(clearCache, clearCacheDelay);
    return loadFile() || defaultProxy;
  };
}
module.exports = exports['default'];