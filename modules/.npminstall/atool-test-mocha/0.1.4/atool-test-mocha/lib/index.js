'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (config) {
  var setupFile = (0, _path.join)(__dirname, 'setup.js');
  var compiler = (0, _path.join)(__dirname, './compiler');

  var mochaBin = void 0;
  var cmd = void 0;

  var coverageDir = (0, _path.join)(cwd, 'coverage');
  _fs2.default.access(coverageDir, _fs2.default.R_OK, function (err) {
    if (!err) {
      (0, _child_process.exec)('rm -rf ' + coverageDir);
    }
  });

  var mochaArgs = config.args.join(' ');
  if (config.coverage) {
    mochaBin = (0, _path.join)(require.resolve('mocha'), '../bin/_mocha');
    var istanbul = (0, _path.join)(require.resolve('istanbul'), '../lib/cli.js');
    cmd = 'node ' + istanbul + ' cover ' + mochaBin + ' -- --compilers .:' + compiler + ' --require ' + setupFile + ' ' + mochaArgs;
  } else {
    mochaBin = (0, _path.join)(require.resolve('mocha'), '../bin/mocha');
    cmd = mochaBin + ' --compilers .:' + compiler + ' --require ' + setupFile + ' ' + mochaArgs;
  }

  var command = (0, _os.platform)() === 'win32' ? 'cmd.exe' : 'sh';
  var args = (0, _os.platform)() === 'win32' ? ['/s', '/c'] : ['-c'];

  var cp = (0, _child_process.spawn)(command, args.concat([cmd]), {
    stdio: 'inherit'
  });

  cp.on('exit', function () {
    if (config.coverage) {
      console.log();
      console.log('You can see more detail in coverage/lcov-report/index.html');
      console.log();
    }
  });
};

var _path = require('path');

var _child_process = require('child_process');

var _os = require('os');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = process.cwd();

module.exports = exports['default'];