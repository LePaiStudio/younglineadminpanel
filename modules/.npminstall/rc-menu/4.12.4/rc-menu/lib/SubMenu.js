'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _SubPopupMenu = require('./SubPopupMenu');

var _SubPopupMenu2 = _interopRequireDefault(_SubPopupMenu);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _KeyCode = require('rc-util/lib/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _guid = require('rc-util/lib/guid');

var _guid2 = _interopRequireDefault(_guid);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint react/no-is-mounted:0 */

var SubMenu = _react2["default"].createClass({
  displayName: 'SubMenu',

  propTypes: {
    parentMenu: _react.PropTypes.object,
    title: _react.PropTypes.node,
    onClick: _react.PropTypes.func,
    onOpenChange: _react.PropTypes.func,
    rootPrefixCls: _react.PropTypes.string,
    eventKey: _react.PropTypes.string,
    multiple: _react.PropTypes.bool,
    active: _react.PropTypes.bool,
    open: _react.PropTypes.bool,
    onSelect: _react.PropTypes.func,
    closeSubMenuOnMouseLeave: _react.PropTypes.bool,
    openSubMenuOnMouseEnter: _react.PropTypes.bool,
    onDeselect: _react.PropTypes.func,
    onDestroy: _react.PropTypes.func,
    onItemHover: _react.PropTypes.func,
    onMouseEnter: _react.PropTypes.func,
    onMouseLeave: _react.PropTypes.func,
    onTitleMouseEnter: _react.PropTypes.func,
    onTitleMouseLeave: _react.PropTypes.func,
    onTitleClick: _react.PropTypes.func
  },

  mixins: [require('./SubMenuStateMixin')],

  getDefaultProps: function getDefaultProps() {
    return {
      onMouseEnter: _util.noop,
      onMouseLeave: _util.noop,
      onTitleMouseEnter: _util.noop,
      onTitleMouseLeave: _util.noop,
      onTitleClick: _util.noop,
      title: ''
    };
  },
  getInitialState: function getInitialState() {
    this.isSubMenu = 1;
    return {
      defaultActiveFirst: false
    };
  },
  componentWillUnmount: function componentWillUnmount() {
    var props = this.props;
    if (props.onDestroy) {
      props.onDestroy(props.eventKey);
    }
    if (props.parentMenu.subMenuInstance === this) {
      this.clearSubMenuTimers();
    }
  },
  onDestroy: function onDestroy(key) {
    this.props.onDestroy(key);
  },
  onKeyDown: function onKeyDown(e) {
    var keyCode = e.keyCode;
    var menu = this.menuInstance;

    if (keyCode === _KeyCode2["default"].ENTER) {
      this.onTitleClick(e);
      this.setState({
        defaultActiveFirst: true
      });
      return true;
    }

    if (keyCode === _KeyCode2["default"].RIGHT) {
      if (this.props.open) {
        menu.onKeyDown(e);
      } else {
        this.triggerOpenChange(true);
        this.setState({
          defaultActiveFirst: true
        });
      }
      return true;
    }
    if (keyCode === _KeyCode2["default"].LEFT) {
      var handled = void 0;
      if (this.props.open) {
        handled = menu.onKeyDown(e);
      } else {
        return undefined;
      }
      if (!handled) {
        this.triggerOpenChange(false);
        handled = true;
      }
      return handled;
    }

    if (this.props.open && (keyCode === _KeyCode2["default"].UP || keyCode === _KeyCode2["default"].DOWN)) {
      return menu.onKeyDown(e);
    }
  },
  onOpenChange: function onOpenChange(e) {
    this.props.onOpenChange(this.addKeyPath(e));
  },
  onMouseEnter: function onMouseEnter(e) {
    var props = this.props;
    this.clearSubMenuLeaveTimer(props.parentMenu.subMenuInstance !== this);
    props.onMouseEnter({
      key: props.eventKey,
      domEvent: e
    });
  },
  onTitleMouseEnter: function onTitleMouseEnter(e) {
    var props = this.props;
    var parentMenu = props.parentMenu;
    this.clearSubMenuTitleLeaveTimer(parentMenu.subMenuInstance !== this);
    if (parentMenu.menuItemInstance) {
      parentMenu.menuItemInstance.clearMenuItemMouseLeaveTimer(true);
    }
    props.onItemHover({
      key: props.eventKey,
      item: this,
      hover: true,
      trigger: 'mouseenter'
    });
    if (props.openSubMenuOnMouseEnter) {
      this.triggerOpenChange(true);
    }
    this.setState({
      defaultActiveFirst: false
    });
    props.onTitleMouseEnter({
      key: props.eventKey,
      domEvent: e
    });
  },
  onTitleMouseLeave: function onTitleMouseLeave(e) {
    var _this = this;

    var props = this.props;

    var parentMenu = props.parentMenu;
    parentMenu.subMenuInstance = this;
    parentMenu.subMenuTitleLeaveFn = function () {
      var eventKey = props.eventKey;
      if (_this.isMounted()) {
        // leave whole sub tree
        // still active
        if (props.mode === 'inline' && props.active) {
          props.onItemHover({
            key: eventKey,
            item: _this,
            hover: false,
            trigger: 'mouseleave'
          });
        }
        props.onTitleMouseLeave({
          key: props.eventKey,
          domEvent: e
        });
      }
    };
    parentMenu.subMenuTitleLeaveTimer = setTimeout(parentMenu.subMenuTitleLeaveFn, 100);
  },
  onMouseLeave: function onMouseLeave(e) {
    var _this2 = this;

    var props = this.props;

    var parentMenu = props.parentMenu;
    parentMenu.subMenuInstance = this;
    parentMenu.subMenuLeaveFn = function () {
      var eventKey = props.eventKey;
      if (_this2.isMounted()) {
        // leave whole sub tree
        // still active
        if (props.mode !== 'inline') {
          if (props.active) {
            props.onItemHover({
              key: eventKey,
              item: _this2,
              hover: false,
              trigger: 'mouseleave'
            });
          }
          if (props.open) {
            if (props.closeSubMenuOnMouseLeave) {
              _this2.triggerOpenChange(false);
            }
          }
        }
        // trigger mouseleave
        props.onMouseLeave({
          key: eventKey,
          domEvent: e
        });
      }
    };
    // prevent popup menu and submenu gap
    parentMenu.subMenuLeaveTimer = setTimeout(parentMenu.subMenuLeaveFn, 100);
  },
  onTitleClick: function onTitleClick(e) {
    var props = this.props;

    props.onTitleClick({
      key: props.eventKey,
      domEvent: e
    });
    if (props.openSubMenuOnMouseEnter) {
      return;
    }
    this.triggerOpenChange(!props.open, 'click');
    this.setState({
      defaultActiveFirst: false
    });
  },
  onSubMenuClick: function onSubMenuClick(info) {
    this.props.onClick(this.addKeyPath(info));
  },
  onSelect: function onSelect(info) {
    this.props.onSelect(info);
  },
  onDeselect: function onDeselect(info) {
    this.props.onDeselect(info);
  },
  getPrefixCls: function getPrefixCls() {
    return this.props.rootPrefixCls + '-submenu';
  },
  getActiveClassName: function getActiveClassName() {
    return this.getPrefixCls() + '-active';
  },
  getDisabledClassName: function getDisabledClassName() {
    return this.getPrefixCls() + '-disabled';
  },
  getOpenClassName: function getOpenClassName() {
    return this.props.rootPrefixCls + '-submenu-open';
  },
  saveMenuInstance: function saveMenuInstance(c) {
    this.menuInstance = c;
  },
  addKeyPath: function addKeyPath(info) {
    return _extends({}, info, {
      keyPath: (info.keyPath || []).concat(this.props.eventKey)
    });
  },
  triggerOpenChange: function triggerOpenChange(open, type) {
    var key = this.props.eventKey;
    this.onOpenChange({
      key: key,
      item: this,
      trigger: type,
      open: open
    });
  },
  clearSubMenuTimers: function clearSubMenuTimers(callFn) {
    this.clearSubMenuLeaveTimer(callFn);
    this.clearSubMenuTitleLeaveTimer(callFn);
  },
  clearSubMenuTitleLeaveTimer: function clearSubMenuTitleLeaveTimer(callFn) {
    var parentMenu = this.props.parentMenu;
    if (parentMenu.subMenuTitleLeaveTimer) {
      clearTimeout(parentMenu.subMenuTitleLeaveTimer);
      parentMenu.subMenuTitleLeaveTimer = null;
      if (callFn && parentMenu.subMenuTitleLeaveFn) {
        parentMenu.subMenuTitleLeaveFn();
      }
      parentMenu.subMenuTitleLeaveFn = null;
    }
  },
  clearSubMenuLeaveTimer: function clearSubMenuLeaveTimer(callFn) {
    var parentMenu = this.props.parentMenu;
    if (parentMenu.subMenuLeaveTimer) {
      clearTimeout(parentMenu.subMenuLeaveTimer);
      parentMenu.subMenuLeaveTimer = null;
      if (callFn && parentMenu.subMenuLeaveFn) {
        parentMenu.subMenuLeaveFn();
      }
      parentMenu.subMenuLeaveFn = null;
    }
  },
  renderChildren: function renderChildren(children) {
    var props = this.props;
    var baseProps = {
      mode: props.mode === 'horizontal' ? 'vertical' : props.mode,
      visible: props.open,
      level: props.level + 1,
      inlineIndent: props.inlineIndent,
      focusable: false,
      onClick: this.onSubMenuClick,
      onSelect: this.onSelect,
      onDeselect: this.onDeselect,
      onDestroy: this.onDestroy,
      selectedKeys: props.selectedKeys,
      eventKey: props.eventKey + '-menu-',
      openKeys: props.openKeys,
      openTransitionName: props.openTransitionName,
      openAnimation: props.openAnimation,
      onOpenChange: this.onOpenChange,
      closeSubMenuOnMouseLeave: props.closeSubMenuOnMouseLeave,
      defaultActiveFirst: this.state.defaultActiveFirst,
      multiple: props.multiple,
      prefixCls: props.rootPrefixCls,
      id: this._menuId,
      ref: this.saveMenuInstance
    };
    return _react2["default"].createElement(
      _SubPopupMenu2["default"],
      baseProps,
      children
    );
  },
  render: function render() {
    var _classes;

    this.haveOpen = this.haveOpen || this.props.open;
    var props = this.props;
    var prefixCls = this.getPrefixCls();
    var classes = (_classes = {}, _defineProperty(_classes, props.className, !!props.className), _defineProperty(_classes, prefixCls + '-' + props.mode, 1), _classes);

    classes[this.getOpenClassName()] = this.props.open;
    classes[this.getActiveClassName()] = props.active;
    classes[this.getDisabledClassName()] = props.disabled;
    this._menuId = this._menuId || (0, _guid2["default"])();
    classes[prefixCls] = true;
    classes[prefixCls + '-' + props.mode] = 1;
    var titleClickEvents = {};
    var mouseEvents = {};
    var titleMouseEvents = {};
    if (!props.disabled) {
      titleClickEvents = {
        onClick: this.onTitleClick
      };
      mouseEvents = {
        onMouseLeave: this.onMouseLeave,
        onMouseEnter: this.onMouseEnter
      };
      // only works in title, not outer li
      titleMouseEvents = {
        onMouseEnter: this.onTitleMouseEnter,
        onMouseLeave: this.onTitleMouseLeave
      };
    }
    var style = {};
    if (props.mode === 'inline') {
      style.paddingLeft = props.inlineIndent * props.level;
    }
    return _react2["default"].createElement(
      'li',
      _extends({ className: (0, _classnames2["default"])(classes) }, mouseEvents),
      _react2["default"].createElement(
        'div',
        _extends({
          style: style,
          className: prefixCls + '-title'
        }, titleMouseEvents, titleClickEvents, {
          'aria-open': props.open,
          'aria-owns': this._menuId,
          'aria-haspopup': 'true'
        }),
        props.title
      ),
      this.renderChildren(props.children)
    );
  }
});

exports["default"] = SubMenu;
module.exports = exports['default'];