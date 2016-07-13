'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Checkbox = function (_React$Component) {
  _inherits(Checkbox, _React$Component);

  function Checkbox(props) {
    _classCallCheck(this, Checkbox);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Checkbox).call(this, props));

    _initialiseProps.call(_this);

    var checked = false;
    if ('checked' in props) {
      checked = props.checked;
    } else {
      checked = props.defaultChecked;
    }
    _this.state = {
      checked: checked,
      focus: false
    };
    return _this;
  }

  _createClass(Checkbox, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if ('checked' in nextProps) {
        this.setState({
          checked: nextProps.checked
        });
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _reactAddonsPureRenderMixin2["default"].shouldComponentUpdate.apply(this, args);
    }
  }, {
    key: 'render',
    value: function render() {
      var _classNames;

      var props = _extends({}, this.props);
      // Remove React warning.
      // Warning: Input elements must be either controlled or uncontrolled
      // (specify either the value prop, or the defaultValue prop, but not both).
      delete props.defaultChecked;

      var state = this.state;
      var prefixCls = props.prefixCls;
      var checked = state.checked;
      if (typeof checked === 'boolean') {
        checked = checked ? 1 : 0;
      }
      var className = (0, _classnames2["default"])((_classNames = {}, _defineProperty(_classNames, props.className, !!props.className), _defineProperty(_classNames, prefixCls, 1), _defineProperty(_classNames, prefixCls + '-checked', checked), _defineProperty(_classNames, prefixCls + '-checked-' + checked, !!checked), _defineProperty(_classNames, prefixCls + '-focused', state.focus), _defineProperty(_classNames, prefixCls + '-disabled', props.disabled), _classNames));
      return _react2["default"].createElement(
        'span',
        {
          className: className,
          style: props.style
        },
        _react2["default"].createElement('span', { className: prefixCls + '-inner' }),
        _react2["default"].createElement('input', {
          name: props.name,
          type: props.type,
          readOnly: props.readOnly,
          disabled: props.disabled,
          className: prefixCls + '-input',
          checked: !!checked,
          onFocus: this.handleFocus,
          onBlur: this.handleBlur,
          onChange: this.handleChange
        })
      );
    }
  }]);

  return Checkbox;
}(_react2["default"].Component);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.handleFocus = function (e) {
    _this2.setState({ focus: true });
    _this2.props.onFocus(e);
  };

  this.handleBlur = function (e) {
    _this2.setState({ focus: false });
    _this2.props.onBlur(e);
  };

  this.handleChange = function (e) {
    var checked = _this2.state.checked;

    if (!('checked' in _this2.props)) {
      _this2.setState({
        checked: !checked
      });
    }
    _this2.props.onChange({
      target: _extends({}, _this2.props, {
        checked: !checked
      }),
      stopPropagation: function stopPropagation() {
        e.stopPropagation();
      },
      preventDefault: function preventDefault() {
        e.preventDefault();
      }
    });
  };
};

exports["default"] = Checkbox;


Checkbox.propTypes = {
  name: _react2["default"].PropTypes.string,
  prefixCls: _react2["default"].PropTypes.string,
  style: _react2["default"].PropTypes.object,
  type: _react2["default"].PropTypes.string,
  className: _react2["default"].PropTypes.string,
  defaultChecked: _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.number, _react2["default"].PropTypes.bool]),
  checked: _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.number, _react2["default"].PropTypes.bool]),
  onFocus: _react2["default"].PropTypes.func,
  onBlur: _react2["default"].PropTypes.func,
  onChange: _react2["default"].PropTypes.func
};

Checkbox.defaultProps = {
  prefixCls: 'rc-checkbox',
  style: {},
  type: 'checkbox',
  className: '',
  defaultChecked: false,
  onFocus: function onFocus() {},
  onBlur: function onBlur() {},
  onChange: function onChange() {}
};
module.exports = exports['default'];