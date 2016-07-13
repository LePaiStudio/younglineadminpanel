"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reduceAsync;
function reduceAsync(arr, memo, iterator, callback) {
  var _memo = memo;
  var index = 0;

  function next() {
    index = index + 1;
    if (arr[index]) {
      return run(arr[index]); // eslint-disable-line no-use-before-define
    }
    if (callback) callback(null, _memo);
    return _memo;
  }

  function run(item) {
    iterator(_memo, item, function (err, result) {
      _memo = result;
      next();
    });
  }

  return run(arr[index]);
}
module.exports = exports['default'];