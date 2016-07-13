'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.emit = emit;

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _isAliEnv2 = require('is-ali-env');

var _isAliEnv3 = _interopRequireDefault(_isAliEnv2);

var _os = require('os');

var _path = require('path');

var _fs = require('fs');

var _formData = require('form-data');

var _formData2 = _interopRequireDefault(_formData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = process.cwd();
var URL = 'http://10.244.30.23:7001/monitor';
var version = require('../package.json').version;
var exec = require('child_process').execSync;

// 获取安装的真实版本
function getRealVersion(moduleName) {
  var version = '';
  try {
    var pkgFile = (0, _path.join)(cwd, 'node_modules', moduleName, 'package.json');
    version = require(pkgFile).version;
  } catch (e) {}

  return version;
}

function getPkgJSON() {
  var ret = {};
  try {
    ret = JSON.parse((0, _fs.readFileSync)((0, _path.join)(cwd, 'package.json'), 'utf-8'));
  } catch (e) {}

  ['dependencies', 'devDependencies'].map(function (deps) {
    if (ret[deps]) {
      Object.keys(ret[deps]).map(function (key) {
        var realVersion = getRealVersion(key);
        if (realVersion) {
          ret[deps][key] = realVersion;
        }
      });
    }
  });

  return ret;
}

function getGitUserInfo() {
  var gitUserName = '';
  var gitUserEmail = '';
  try {
    gitUserName = exec('git config --get user.name').toString().trim();
  } catch (e) {}
  try {
    gitUserEmail = exec('git config --get user.email').toString().trim();
  } catch (e) {}

  return {
    gitUserName: gitUserName,
    gitUserEmail: gitUserEmail
  };
}

function getData() {
  return {
    pkgJSON: getPkgJSON(),
    platform: (0, _os.platform)(),
    arch: (0, _os.arch)(),
    release: (0, _os.release)(),
    user: process.env.USER,
    hostname: process.env.HOSTNAME || '',
    command: process.argv
  };
}

function emit() {
  var type = arguments.length <= 0 || arguments[0] === undefined ? 'executeCommand' : arguments[0];
  var extraData = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  (0, _isAliEnv3.default)().then(function (_isAliEnv) {
    if (_isAliEnv) {
      (function () {
        var data = _extends({}, getData(), extraData, getGitUserInfo(), {
          type: type
        });

        var form = new _formData2.default();
        Object.keys(data).forEach(function (key) {
          if (_typeof(data[key])) {
            form.append(key, JSON.stringify(data[key]));
          } else {
            form.append(key, data[key]);
          }
        });

        (0, _nodeFetch2.default)(URL + '?version=' + version, {
          method: 'POST',
          timeout: opts.timeout || 2000,
          body: form
        });
      })();
    }
  });
}