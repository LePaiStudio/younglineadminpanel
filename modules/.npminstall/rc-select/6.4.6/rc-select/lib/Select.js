'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _rcUtil = require('rc-util');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _OptGroup = require('./OptGroup');

var _OptGroup2 = _interopRequireDefault(_OptGroup);

var _rcAnimate = require('rc-animate');

var _rcAnimate2 = _interopRequireDefault(_rcAnimate);

var _componentClasses = require('component-classes');

var _componentClasses2 = _interopRequireDefault(_componentClasses);

var _util = require('./util');

var _SelectTrigger = require('./SelectTrigger');

var _SelectTrigger2 = _interopRequireDefault(_SelectTrigger);

var _FilterMixin = require('./FilterMixin');

var _FilterMixin2 = _interopRequireDefault(_FilterMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function noop() {}

function filterFn(input, child) {
  return String((0, _util.getPropValue)(child, this.props.optionFilterProp)).indexOf(input) > -1;
}

function saveRef(name, component) {
  this[name] = component;
}

var Select = _react2["default"].createClass({
  displayName: 'Select',

  propTypes: {
    defaultActiveFirstOption: _react.PropTypes.bool,
    multiple: _react.PropTypes.bool,
    filterOption: _react.PropTypes.any,
    showSearch: _react.PropTypes.bool,
    disabled: _react.PropTypes.bool,
    allowClear: _react.PropTypes.bool,
    showArrow: _react.PropTypes.bool,
    tags: _react.PropTypes.bool,
    prefixCls: _react.PropTypes.string,
    className: _react.PropTypes.string,
    transitionName: _react.PropTypes.string,
    optionLabelProp: _react.PropTypes.string,
    optionFilterProp: _react.PropTypes.string,
    animation: _react.PropTypes.string,
    choiceTransitionName: _react.PropTypes.string,
    onChange: _react.PropTypes.func,
    onBlur: _react.PropTypes.func,
    onSelect: _react.PropTypes.func,
    onSearch: _react.PropTypes.func,
    placeholder: _react.PropTypes.any,
    onDeselect: _react.PropTypes.func,
    labelInValue: _react.PropTypes.bool,
    value: _react.PropTypes.any,
    defaultValue: _react.PropTypes.any,
    dropdownStyle: _react.PropTypes.object,
    maxTagTextLength: _react.PropTypes.number
  },

  mixins: [_FilterMixin2["default"]],

  getDefaultProps: function getDefaultProps() {
    return {
      prefixCls: 'rc-select',
      filterOption: filterFn,
      defaultOpen: false,
      labelInValue: false,
      defaultActiveFirstOption: true,
      showSearch: true,
      allowClear: false,
      placeholder: '',
      defaultValue: [],
      onChange: noop,
      onBlur: noop,
      onSelect: noop,
      onSearch: noop,
      onDeselect: noop,
      showArrow: true,
      dropdownMatchSelectWidth: true,
      dropdownStyle: {},
      dropdownMenuStyle: {},
      optionFilterProp: 'value',
      optionLabelProp: 'value',
      notFoundContent: 'Not Found'
    };
  },
  getInitialState: function getInitialState() {
    var props = this.props;
    var value = [];
    if ('value' in props) {
      value = (0, _util.toArray)(props.value);
    } else {
      value = (0, _util.toArray)(props.defaultValue);
    }
    value = this.addLabelToValue(props, value);
    var inputValue = '';
    if (props.combobox) {
      inputValue = value.length ? String(value[0].key) : '';
    }
    this.saveInputRef = saveRef.bind(this, 'inputInstance');
    this.saveInputMirrorRef = saveRef.bind(this, 'inputMirrorInstance');
    var open = props.open;
    if (open === undefined) {
      open = props.defaultOpen;
    }
    return {
      value: value,
      inputValue: inputValue,
      open: open
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      var value = (0, _util.toArray)(nextProps.value);
      value = this.addLabelToValue(nextProps, value);
      this.setState({
        value: value
      });
      if (nextProps.combobox) {
        this.setState({
          inputValue: value.length ? String(value[0].key) : ''
        });
      }
    }
  },
  componentDidUpdate: function componentDidUpdate() {
    var state = this.state;
    var props = this.props;

    if (state.open && (0, _util.isMultipleOrTags)(props)) {
      var inputNode = this.getInputDOMNode();
      var mirrorNode = this.getInputMirrorDOMNode();
      if (inputNode.value) {
        inputNode.style.width = '';
        inputNode.style.width = mirrorNode.clientWidth + 'px';
      } else {
        inputNode.style.width = '';
      }
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    this.clearBlurTime();
    if (this.dropdownContainer) {
      _reactDom2["default"].unmountComponentAtNode(this.dropdownContainer);
      document.body.removeChild(this.dropdownContainer);
      this.dropdownContainer = null;
    }
  },
  onInputChange: function onInputChange(event) {
    var val = event.target.value;
    var props = this.props;

    this.setInputValue(val);
    this.setState({
      open: true
    });
    if ((0, _util.isCombobox)(props)) {
      this.fireChange([{
        key: val
      }]);
    }
  },
  onDropdownVisibleChange: function onDropdownVisibleChange(open) {
    this.setOpenState(open);
  },


  // combobox ignore
  onKeyDown: function onKeyDown(event) {
    var props = this.props;
    if (props.disabled) {
      return;
    }
    var keyCode = event.keyCode;
    if (this.state.open && !this.getInputDOMNode()) {
      this.onInputKeyDown(event);
    } else if (keyCode === _rcUtil.KeyCode.ENTER || keyCode === _rcUtil.KeyCode.DOWN) {
      this.setOpenState(true);
      event.preventDefault();
    }
  },
  onInputKeyDown: function onInputKeyDown(event) {
    var props = this.props;
    if (props.disabled) {
      return;
    }
    var state = this.state;
    var keyCode = event.keyCode;
    if ((0, _util.isMultipleOrTags)(props) && !event.target.value && keyCode === _rcUtil.KeyCode.BACKSPACE) {
      var value = state.value.concat();
      if (value.length) {
        var popValue = value.pop();
        props.onDeselect(props.labelInValue ? popValue : popValue.key);
        this.fireChange(value);
      }
      return;
    }
    if (keyCode === _rcUtil.KeyCode.DOWN) {
      if (!state.open) {
        this.openIfHasChildren();
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    } else if (keyCode === _rcUtil.KeyCode.ESC) {
      if (state.open) {
        this.setOpenState(false);
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }

    if (state.open) {
      var menu = this.refs.trigger.getInnerMenu();
      if (menu && menu.onKeyDown(event)) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  },
  onMenuSelect: function onMenuSelect(_ref) {
    var item = _ref.item;

    var value = this.state.value;
    var props = this.props;
    var selectedValue = (0, _util.getValuePropValue)(item);
    var selectedLabel = this.getLabelFromOption(item);
    var event = selectedValue;
    if (props.labelInValue) {
      event = {
        key: event,
        label: selectedLabel
      };
    }
    props.onSelect(event, item);
    if ((0, _util.isMultipleOrTags)(props)) {
      if ((0, _util.findIndexInValueByKey)(value, selectedValue) !== -1) {
        return;
      }
      value = value.concat([{
        key: selectedValue,
        label: selectedLabel
      }]);
    } else {
      if (value.length && value[0].key === selectedValue) {
        this.setOpenState(false, true);
        return;
      }
      value = [{
        key: selectedValue,
        label: selectedLabel
      }];
      this.setOpenState(false, true);
    }
    this.fireChange(value);
    var inputValue = void 0;
    if ((0, _util.isCombobox)(props)) {
      inputValue = (0, _util.getPropValue)(item, props.optionLabelProp);
    } else {
      inputValue = '';
    }
    this.setInputValue(inputValue, false);
  },
  onMenuDeselect: function onMenuDeselect(_ref2) {
    var item = _ref2.item;
    var domEvent = _ref2.domEvent;

    if (domEvent.type === 'click') {
      this.removeSelected((0, _util.getValuePropValue)(item));
    }
    this.setInputValue('', false);
  },
  onArrowClick: function onArrowClick(e) {
    e.stopPropagation();
    if (!this.props.disabled) {
      this.setOpenState(!this.state.open, true);
    }
  },
  onPlaceholderClick: function onPlaceholderClick() {
    if (this.getInputDOMNode()) {
      this.getInputDOMNode().focus();
    }
  },
  onOuterFocus: function onOuterFocus() {
    this.clearBlurTime();
    this._focused = true;
    this.updateFocusClassName();
  },
  onPopupFocus: function onPopupFocus() {
    // fix ie scrollbar, focus element again
    this.maybeFocus(true, true);
  },
  onOuterBlur: function onOuterBlur() {
    var _this = this;

    this.blurTimer = setTimeout(function () {
      _this._focused = false;
      _this.updateFocusClassName();
      var props = _this.props;
      var value = _this.state.value;

      if ((0, _util.isSingleMode)(props) && props.showSearch && _this.state.inputValue && props.defaultActiveFirstOption) {
        var options = _this._options || [];
        if (options.length) {
          var firstOption = (0, _util.findFirstMenuItem)(options);
          if (firstOption) {
            value = [{
              key: firstOption.key,
              label: _this.getLabelFromOption(firstOption)
            }];
            _this.fireChange(value);
          }
        }
      }
      props.onBlur(_this.getVLForOnChange(value));
    }, 10);
  },
  onClearSelection: function onClearSelection(event) {
    var props = this.props;
    var state = this.state;
    if (props.disabled) {
      return;
    }
    var inputValue = state.inputValue;
    var value = state.value;

    event.stopPropagation();
    if (inputValue || value.length) {
      if (value.length) {
        this.fireChange([]);
      }
      this.setOpenState(false, true);
      if (inputValue) {
        this.setInputValue('');
      }
    }
  },
  onChoiceAnimationLeave: function onChoiceAnimationLeave() {
    this.refs.trigger.refs.trigger.forcePopupAlign();
  },
  getLabelBySingleValue: function getLabelBySingleValue(children, value) {
    var _this2 = this;

    if (value === undefined) {
      return null;
    }
    var label = null;
    _react2["default"].Children.forEach(children, function (child) {
      if (child.type === _OptGroup2["default"]) {
        var maybe = _this2.getLabelBySingleValue(child.props.children, value);
        if (maybe !== null) {
          label = maybe;
        }
      } else if ((0, _util.getValuePropValue)(child) === value) {
        label = _this2.getLabelFromOption(child);
      }
    });
    return label;
  },
  getLabelFromOption: function getLabelFromOption(child) {
    return (0, _util.getPropValue)(child, this.props.optionLabelProp);
  },
  getLabelFromProps: function getLabelFromProps(props, value) {
    return this.getLabelByValue(props.children, value);
  },
  getVLForOnChange: function getVLForOnChange(vls_) {
    var vls = vls_;
    if (vls !== undefined) {
      if (!this.props.labelInValue) {
        vls = vls.map(function (v) {
          return v.key;
        });
      }
      return (0, _util.isMultipleOrTags)(this.props) ? vls : vls[0];
    }
    return vls;
  },
  getLabelByValue: function getLabelByValue(children, value) {
    var label = this.getLabelBySingleValue(children, value);
    if (label === null) {
      return value;
    }
    return label;
  },
  getDropdownContainer: function getDropdownContainer() {
    if (!this.dropdownContainer) {
      this.dropdownContainer = document.createElement('div');
      document.body.appendChild(this.dropdownContainer);
    }
    return this.dropdownContainer;
  },
  getPlaceholderElement: function getPlaceholderElement() {
    var props = this.props;
    var state = this.state;

    var hidden = false;
    if (state.inputValue) {
      hidden = true;
    }
    if (state.value.length) {
      hidden = true;
    }
    if ((0, _util.isCombobox)(props) && state.value.length === 1 && !state.value[0].key) {
      hidden = false;
    }
    var placeholder = props.placeholder;
    if (placeholder) {
      return _react2["default"].createElement(
        'div',
        _extends({
          onMouseDown: _util.preventDefaultEvent,
          style: _extends({
            display: hidden ? 'none' : 'block'
          }, _util.UNSELECTABLE_STYLE)
        }, _util.UNSELECTABLE_ATTRIBUTE, {
          onClick: this.onPlaceholderClick,
          className: props.prefixCls + '-selection__placeholder'
        }),
        placeholder
      );
    }
    return null;
  },
  getInputElement: function getInputElement() {
    var props = this.props;
    return _react2["default"].createElement(
      'div',
      { className: props.prefixCls + '-search__field__wrap' },
      _react2["default"].createElement('input', {
        ref: this.saveInputRef,
        onChange: this.onInputChange,
        onKeyDown: this.onInputKeyDown,
        value: this.state.inputValue,
        disabled: props.disabled,
        className: props.prefixCls + '-search__field'
      }),
      _react2["default"].createElement(
        'span',
        {
          ref: this.saveInputMirrorRef,
          className: props.prefixCls + '-search__field__mirror'
        },
        this.state.inputValue
      )
    );
  },
  getInputDOMNode: function getInputDOMNode() {
    return this.inputInstance;
  },
  getInputMirrorDOMNode: function getInputMirrorDOMNode() {
    return this.inputMirrorInstance;
  },
  getPopupDOMNode: function getPopupDOMNode() {
    return this.refs.trigger.getPopupDOMNode();
  },
  getPopupMenuComponent: function getPopupMenuComponent() {
    return this.refs.trigger.getInnerMenu();
  },
  setOpenState: function setOpenState(open, needFocus) {
    var _this3 = this;

    var props = this.props;
    var state = this.state;

    if (state.open === open) {
      this.maybeFocus(open, needFocus);
      return;
    }
    var nextState = {
      open: open
    };
    // clear search input value when open is false in singleMode.
    if (!open && (0, _util.isSingleMode)(props) && props.showSearch) {
      this.setInputValue('');
    }
    if (!open) {
      this.maybeFocus(open, needFocus);
    }
    this.setState(nextState, function () {
      if (open) {
        _this3.maybeFocus(open, needFocus);
      }
    });
  },
  setInputValue: function setInputValue(inputValue) {
    var fireSearch = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    this.setState({
      inputValue: inputValue
    });
    if (fireSearch) {
      this.props.onSearch(inputValue);
    }
  },
  clearBlurTime: function clearBlurTime() {
    if (this.blurTimer) {
      clearTimeout(this.blurTimer);
      this.blurTimer = null;
    }
  },
  updateFocusClassName: function updateFocusClassName() {
    var refs = this.refs;
    var props = this.props;
    // avoid setState and its side effect

    if (this._focused) {
      (0, _componentClasses2["default"])(refs.root).add(props.prefixCls + '-focused');
    } else {
      (0, _componentClasses2["default"])(refs.root).remove(props.prefixCls + '-focused');
    }
  },
  maybeFocus: function maybeFocus(open, needFocus) {
    if (needFocus || open) {
      var input = this.getInputDOMNode();
      var _document = document;
      var activeElement = _document.activeElement;

      if (input && (open || (0, _util.isMultipleOrTagsOrCombobox)(this.props))) {
        if (activeElement !== input) {
          input.focus();
        }
      } else {
        var selection = this.refs.selection;
        if (activeElement !== selection) {
          selection.focus();
        }
      }
    }
  },
  addLabelToValue: function addLabelToValue(props, value_) {
    var _this4 = this;

    var value = value_;
    if (props.labelInValue) {
      value.forEach(function (v) {
        v.label = v.label || _this4.getLabelFromProps(props, v.key);
      });
    } else {
      value = value.map(function (v) {
        return {
          key: v,
          label: _this4.getLabelFromProps(props, v)
        };
      });
    }
    return value;
  },
  removeSelected: function removeSelected(selectedKey) {
    var props = this.props;
    if (props.disabled) {
      return;
    }
    var label = void 0;
    var value = this.state.value.filter(function (singleValue) {
      if (singleValue.key === selectedKey) {
        label = singleValue.label;
      }
      return singleValue.key !== selectedKey;
    });
    var canMultiple = (0, _util.isMultipleOrTags)(props);

    if (canMultiple) {
      var event = selectedKey;
      if (props.labelInValue) {
        event = {
          key: selectedKey,
          label: label
        };
      }
      props.onDeselect(event);
    }
    this.fireChange(value);
  },
  openIfHasChildren: function openIfHasChildren() {
    var props = this.props;
    if (_react2["default"].Children.count(props.children) || (0, _util.isSingleMode)(props)) {
      this.setOpenState(true);
    }
  },
  fireChange: function fireChange(value) {
    var props = this.props;
    if (!('value' in props)) {
      this.setState({
        value: value
      });
    }
    props.onChange(this.getVLForOnChange(value));
  },
  renderTopControlNode: function renderTopControlNode() {
    var _this5 = this;

    var _state = this.state;
    var value = _state.value;
    var open = _state.open;
    var inputValue = _state.inputValue;

    var props = this.props;
    var choiceTransitionName = props.choiceTransitionName;
    var prefixCls = props.prefixCls;
    var maxTagTextLength = props.maxTagTextLength;
    var showSearch = props.showSearch;

    var className = prefixCls + '-selection__rendered';
    // search input is inside topControlNode in single, multiple & combobox. 2016/04/13
    var innerNode = null;
    if ((0, _util.isSingleMode)(props)) {
      var selectedValue = null;
      if (value.length) {
        var showSelectedValue = false;
        var opacity = 1;
        if (!showSearch) {
          showSelectedValue = true;
        } else {
          if (open) {
            showSelectedValue = !inputValue;
            if (showSelectedValue) {
              opacity = 0.4;
            }
          } else {
            showSelectedValue = true;
          }
        }
        selectedValue = _react2["default"].createElement(
          'div',
          {
            key: 'value',
            className: prefixCls + '-selection-selected-value',
            style: {
              display: showSelectedValue ? 'block' : 'none',
              opacity: opacity
            }
          },
          value[0].label
        );
      }
      if (!showSearch) {
        innerNode = [selectedValue];
      } else {
        innerNode = [selectedValue, _react2["default"].createElement(
          'div',
          {
            className: prefixCls + '-search ' + prefixCls + '-search--inline',
            key: 'input',
            style: {
              display: open ? 'block' : 'none'
            }
          },
          this.getInputElement()
        )];
      }
    } else {
      var selectedValueNodes = [];
      if ((0, _util.isMultipleOrTags)(props)) {
        selectedValueNodes = value.map(function (singleValue) {
          var content = singleValue.label;
          var title = content;
          if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
            content = content.slice(0, maxTagTextLength) + '...';
          }
          var disabled = (0, _util.toArray)(props.children).some(function (child) {
            var childValue = (0, _util.getValuePropValue)(child);
            return childValue === singleValue.key && child.props && child.props.disabled;
          });
          var choiceClassName = disabled ? prefixCls + '-selection__choice ' + prefixCls + '-selection__choice__disabled' : prefixCls + '-selection__choice';
          return _react2["default"].createElement(
            'li',
            _extends({
              style: _util.UNSELECTABLE_STYLE
            }, _util.UNSELECTABLE_ATTRIBUTE, {
              onMouseDown: _util.preventDefaultEvent,
              className: choiceClassName,
              key: singleValue.key,
              title: title
            }),
            _react2["default"].createElement(
              'div',
              { className: prefixCls + '-selection__choice__content' },
              content
            ),
            disabled ? null : _react2["default"].createElement('span', {
              className: prefixCls + '-selection__choice__remove',
              onClick: _this5.removeSelected.bind(_this5, singleValue.key)
            })
          );
        });
      }
      selectedValueNodes.push(_react2["default"].createElement(
        'li',
        {
          className: prefixCls + '-search ' + prefixCls + '-search--inline',
          key: '__input'
        },
        this.getInputElement()
      ));

      if ((0, _util.isMultipleOrTags)(props) && choiceTransitionName) {
        innerNode = _react2["default"].createElement(
          _rcAnimate2["default"],
          {
            onLeave: this.onChoiceAnimationLeave,
            component: 'ul',
            transitionName: choiceTransitionName
          },
          selectedValueNodes
        );
      } else {
        innerNode = _react2["default"].createElement(
          'ul',
          null,
          selectedValueNodes
        );
      }
    }
    return _react2["default"].createElement(
      'div',
      { className: className },
      this.getPlaceholderElement(),
      innerNode
    );
  },
  render: function render() {
    var _rootCls;

    var props = this.props;
    var multiple = (0, _util.isMultipleOrTags)(props);
    var state = this.state;
    var className = props.className;
    var disabled = props.disabled;
    var allowClear = props.allowClear;
    var prefixCls = props.prefixCls;

    var ctrlNode = this.renderTopControlNode();
    var extraSelectionProps = {};
    var open = this.state.open;

    var options = [];
    if (open) {
      options = this.renderFilterOptions();
    }
    this._options = options;
    if (open && ((0, _util.isMultipleOrTagsOrCombobox)(props) || !props.showSearch) && !options.length) {
      open = false;
    }
    if (!(0, _util.isMultipleOrTagsOrCombobox)(props)) {
      extraSelectionProps = {
        onKeyDown: this.onKeyDown,
        tabIndex: 0
      };
    }
    var rootCls = (_rootCls = {}, _defineProperty(_rootCls, className, !!className), _defineProperty(_rootCls, prefixCls, 1), _defineProperty(_rootCls, prefixCls + '-open', open), _defineProperty(_rootCls, prefixCls + '-focused', open || !!this._focused), _defineProperty(_rootCls, prefixCls + '-combobox', (0, _util.isCombobox)(props)), _defineProperty(_rootCls, prefixCls + '-disabled', disabled), _defineProperty(_rootCls, prefixCls + '-enabled', !disabled), _defineProperty(_rootCls, prefixCls + '-allow-clear', !!props.allowClear), _rootCls);
    var clearStyle = _extends({}, _util.UNSELECTABLE_STYLE, {
      display: 'none'
    });
    if (state.inputValue || state.value.length) {
      clearStyle.display = 'block';
    }
    var clear = _react2["default"].createElement('span', _extends({
      key: 'clear',
      onMouseDown: _util.preventDefaultEvent,
      style: clearStyle
    }, _util.UNSELECTABLE_ATTRIBUTE, {
      className: prefixCls + '-selection__clear',
      onClick: this.onClearSelection
    }));
    return _react2["default"].createElement(
      _SelectTrigger2["default"],
      {
        onPopupFocus: this.onPopupFocus,
        dropdownAlign: props.dropdownAlign,
        dropdownClassName: props.dropdownClassName,
        dropdownMatchSelectWidth: props.dropdownMatchSelectWidth,
        defaultActiveFirstOption: props.defaultActiveFirstOption,
        dropdownMenuStyle: props.dropdownMenuStyle,
        transitionName: props.transitionName,
        animation: props.animation,
        prefixCls: props.prefixCls,
        dropdownStyle: props.dropdownStyle,
        combobox: props.combobox,
        showSearch: props.showSearch,
        options: options,
        multiple: multiple,
        disabled: disabled,
        visible: open,
        inputValue: state.inputValue,
        value: state.value,
        onDropdownVisibleChange: this.onDropdownVisibleChange,
        getPopupContainer: props.getPopupContainer,
        onMenuSelect: this.onMenuSelect,
        onMenuDeselect: this.onMenuDeselect,
        ref: 'trigger'
      },
      _react2["default"].createElement(
        'div',
        {
          style: props.style,
          ref: 'root',
          onBlur: this.onOuterBlur,
          onFocus: this.onOuterFocus,
          className: (0, _classnames2["default"])(rootCls)
        },
        _react2["default"].createElement(
          'div',
          _extends({
            ref: 'selection',
            key: 'selection',
            className: prefixCls + '-selection\n            ' + prefixCls + '-selection--' + (multiple ? 'multiple' : 'single'),
            role: 'combobox',
            'aria-autocomplete': 'list',
            'aria-haspopup': 'true',
            'aria-expanded': open
          }, extraSelectionProps),
          ctrlNode,
          allowClear && !multiple ? clear : null,
          multiple || !props.showArrow ? null : _react2["default"].createElement(
            'span',
            _extends({
              key: 'arrow',
              className: prefixCls + '-arrow',
              style: _util.UNSELECTABLE_STYLE
            }, _util.UNSELECTABLE_ATTRIBUTE, {
              onMouseDown: _util.preventDefaultEvent,
              onClick: this.onArrowClick
            }),
            _react2["default"].createElement('b', null)
          )
        )
      )
    );
  }
});

exports["default"] = Select;
module.exports = exports['default'];