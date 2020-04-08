"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var arr = [1, 2, 3, 4, 5];
arr.map(function (item) {
  return console.info(item);
});
_promise2.default.resolve("hello").then(function () {
  return console.info("ok");
});