'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _rcUtil = require('rc-util');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _rcAnimate = require('rc-animate');

var _rcAnimate2 = _interopRequireDefault(_rcAnimate);

var _util = require('./util');

var _SelectTrigger = require('./SelectTrigger');

var _SelectTrigger2 = _interopRequireDefault(_SelectTrigger);

var _TreeNode2 = require('./TreeNode');

var _TreeNode3 = _interopRequireDefault(_TreeNode2);

function noop() {}

function filterFn(input, child) {
  return String((0, _util.getPropValue)(child, (0, _util.labelCompatible)(this.props.treeNodeFilterProp))).indexOf(input) > -1;
}

function saveRef(name, component) {
  this[name] = component;
}

function loopTreeData(data) {
  var level = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  return data.map(function (item, index) {
    var pos = level + '-' + index;
    var props = {
      title: item.label,
      value: item.value || String(item.key || item.label),
      key: item.key || item.value || pos,
      disabled: item.disabled || false,
      selectable: item.hasOwnProperty('selectable') ? item.selectable : true
    };
    var ret = undefined;
    if (item.children && item.children.length) {
      ret = _react2['default'].createElement(
        _TreeNode3['default'],
        props,
        loopTreeData(item.children, pos)
      );
    } else {
      ret = _react2['default'].createElement(_TreeNode3['default'], _extends({}, props, { isLeaf: item.isLeaf }));
    }
    return ret;
  });
}

var SHOW_ALL = 'SHOW_ALL';
var SHOW_PARENT = 'SHOW_PARENT';
var SHOW_CHILD = 'SHOW_CHILD';

var Select = _react2['default'].createClass({
  displayName: 'Select',

  propTypes: {
    children: _react.PropTypes.any,
    multiple: _react.PropTypes.bool,
    filterTreeNode: _react.PropTypes.any,
    showSearch: _react.PropTypes.bool,
    disabled: _react.PropTypes.bool,
    showArrow: _react.PropTypes.bool,
    tags: _react.PropTypes.bool,
    transitionName: _react.PropTypes.string,
    animation: _react.PropTypes.string,
    choiceTransitionName: _react.PropTypes.string,
    onClick: _react.PropTypes.func,
    onChange: _react.PropTypes.func,
    onSelect: _react.PropTypes.func,
    onDeselect: _react.PropTypes.func,
    onSearch: _react.PropTypes.func,
    searchPlaceholder: _react.PropTypes.string,
    placeholder: _react.PropTypes.any,
    inputValue: _react.PropTypes.any,
    value: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.string, _react.PropTypes.object]),
    defaultValue: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.string, _react.PropTypes.object]),
    label: _react.PropTypes.any,
    defaultLabel: _react.PropTypes.any,
    labelInValue: _react.PropTypes.bool,
    dropdownStyle: _react.PropTypes.object,
    drodownPopupAlign: _react.PropTypes.object,
    onDropdownVisibleChange: _react.PropTypes.func,
    maxTagTextLength: _react.PropTypes.number,
    showCheckedStrategy: _react.PropTypes.oneOf([SHOW_ALL, SHOW_PARENT, SHOW_CHILD]),
    // skipHandleInitValue: PropTypes.bool, // Deprecated (use treeCheckStrictly)
    treeCheckStrictly: _react.PropTypes.bool,
    treeIcon: _react.PropTypes.bool,
    treeLine: _react.PropTypes.bool,
    treeDefaultExpandAll: _react.PropTypes.bool,
    treeCheckable: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.node]),
    treeNodeLabelProp: _react.PropTypes.string,
    treeNodeFilterProp: _react.PropTypes.string,
    treeData: _react.PropTypes.array,
    treeDataSimpleMode: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.object]),
    loadData: _react.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      prefixCls: 'rc-tree-select',
      filterTreeNode: filterFn,
      showSearch: true,
      allowClear: false,
      placeholder: '',
      searchPlaceholder: '',
      labelInValue: false,
      defaultValue: [],
      inputValue: '',
      onClick: noop,
      onChange: noop,
      onSelect: noop,
      onDeselect: noop,
      onSearch: noop,
      showArrow: true,
      dropdownMatchSelectWidth: true,
      dropdownStyle: {},
      onDropdownVisibleChange: function onDropdownVisibleChange() {
        return true;
      },
      notFoundContent: 'Not Found',
      showCheckedStrategy: SHOW_CHILD,
      // skipHandleInitValue: false, // Deprecated (use treeCheckStrictly)
      treeCheckStrictly: false,
      treeIcon: false,
      treeLine: false,
      treeDataSimpleMode: false,
      treeDefaultExpandAll: false,
      treeCheckable: false,
      treeNodeFilterProp: 'value',
      treeNodeLabelProp: 'title'
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
    // save parsed treeData, for performance (treeData may be very big)
    this.renderedTreeData = this.renderTreeData();
    value = this.addLabelToValue(props, value);
    value = this.getValue(props, value);
    var inputValue = props.inputValue || '';
    // if (props.combobox) {
    //   inputValue = value.length ? String(value[0].value) : '';
    // }
    this.saveInputRef = saveRef.bind(this, 'inputInstance');
    var open = props.open;
    if (open === undefined) {
      open = props.defaultOpen;
    }
    return {
      value: value,
      inputValue: inputValue,
      open: open,
      focused: false
    };
  },

  componentDidMount: function componentDidMount() {
    if (this.state.inputValue) {
      var inputNode = this.getInputDOMNode();
      if (inputNode && inputNode.value) {
        inputNode.style.width = '';
        inputNode.style.width = inputNode.scrollWidth + 'px';
      }
    }
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      if (this._cacheTreeNodesStates !== 'no' && this._savedValue && nextProps.value === this._savedValue) {
        // 只处理用户直接 在 onChange 里 this.setState({value}); 并且是同一个对象引用。
        // 后续可以对比对象里边的值。
        this._cacheTreeNodesStates = true;
      } else {
        this._cacheTreeNodesStates = false;
      }
      var value = (0, _util.toArray)(nextProps.value);
      // save parsed treeData, for performance (treeData may be very big)
      this.renderedTreeData = this.renderTreeData(nextProps);
      value = this.addLabelToValue(nextProps, value);
      value = this.getValue(nextProps, value);
      this.setState({
        value: value
      });
      // if (nextProps.combobox) {
      //   this.setState({
      //     inputValue: value.length ? String(value[0].key) : '',
      //   });
      // }
    }
  },

  componentDidUpdate: function componentDidUpdate() {
    var state = this.state;
    var props = this.props;
    if (state.open && (0, _util.isMultipleOrTags)(props)) {
      var inputNode = this.getInputDOMNode();
      if (inputNode.value) {
        inputNode.style.width = '';
        inputNode.style.width = inputNode.scrollWidth + 'px';
      } else {
        inputNode.style.width = '';
      }
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    this.clearDelayTimer();
    if (this.dropdownContainer) {
      _reactDom2['default'].unmountComponentAtNode(this.dropdownContainer);
      document.body.removeChild(this.dropdownContainer);
      this.dropdownContainer = null;
    }
  },

  onInputChange: function onInputChange(event) {
    var val = event.target.value;
    var props = this.props;

    this.setState({
      inputValue: val,
      open: true
    });
    // if (isCombobox(props)) {
    //   this.fireChange([{
    //     value: val,
    //   }]);
    // }
    props.onSearch(val);
  },

  onDropdownVisibleChange: function onDropdownVisibleChange(open) {
    var _this = this;

    // selection inside combobox cause click
    if (!open && document.activeElement === this.getInputDOMNode()) {}
    // return;

    // this.setOpenState(open);
    // 加延时，才能产生动画，什么情况？？
    setTimeout(function () {
      if (_this.props.onDropdownVisibleChange(open)) {
        _this.setOpenState(open);
      }
    }, 10);
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

  onInputBlur: function onInputBlur() {
    // if (isMultipleOrTagsOrCombobox(this.props)) {
    //   return;
    // }
    // this.clearDelayTimer();
    // this.delayTimer = setTimeout(() => {
    //   this.setOpenState(false);
    // }, 150);
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
        props.onDeselect(this.isLabelInValue() ? popValue : popValue.key);
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
      // const menu = this.refs.trigger.getPopupEleRefs();
      // if (menu && menu.onKeyDown(event)) {
      //   event.preventDefault();
      //   event.stopPropagation();
      // }
    }
  },

  onSelect: function onSelect(selectedKeys, info) {
    var _this2 = this;

    if (info.selected === false) {
      this.onDeselect(info);
      return;
    }
    var item = info.node;
    var value = this.state.value;
    var props = this.props;
    var selectedValue = (0, _util.getValuePropValue)(item);
    var selectedLabel = this.getLabelFromNode(item);
    var event = selectedValue;
    if (this.isLabelInValue()) {
      event = {
        value: event,
        label: selectedLabel
      };
    }
    props.onSelect(event, item, info);
    var checkEvt = info.event === 'check';
    if ((0, _util.isMultipleOrTags)(props)) {
      if (checkEvt) {
        value = this.getCheckedNodes(info, props).map(function (n) {
          return {
            value: (0, _util.getValuePropValue)(n),
            label: _this2.getLabelFromNode(n)
          };
        });
      } else {
        if (value.some(function (i) {
          return i.value === selectedValue;
        })) {
          return;
        }
        value = value.concat([{
          value: selectedValue,
          label: selectedLabel
        }]);
      }
      // if (!checkEvt && value.indexOf(selectedValue) !== -1) {
      // 设置 multiple 时会有bug。（isValueChange 已有检查，此处注释掉）
      // return;
      // }
    } else {
        if (value.length && value[0].value === selectedValue) {
          // this.setOpenState(false, true);
          this.setOpenState(false);
          return;
        }
        value = [{
          value: selectedValue,
          label: selectedLabel
        }];
        // this.setOpenState(false, true);
        this.setOpenState(false);
      }

    var extraInfo = {
      triggerValue: selectedValue,
      triggerNode: item
    };
    if (checkEvt) {
      extraInfo.checked = info.checked;
      extraInfo.allCheckedNodes = props.treeCheckStrictly ? info.checkedNodes : (0, _util.flatToHierarchy)(info.checkedNodesPositions);
      this._checkedNodes = info.checkedNodesPositions;
      var _tree = this.refs.trigger.popupEle;
      this._treeNodesStates = _tree.checkKeys;
    } else {
      extraInfo.selected = info.selected;
    }

    this.fireChange(value, extraInfo);
    if (props.inputValue === null) {
      this.setState({
        inputValue: ''
      });
    }
    // if (isCombobox(props)) {
    //   this.setState({
    //     inputValue: getPropValue(item, props.treeNodeLabelProp),
    //   });
    // }
  },

  onDeselect: function onDeselect(info) {
    this.removeSelected((0, _util.getValuePropValue)(info.node));
    if (!(0, _util.isMultipleOrTags)(this.props)) {
      this.setOpenState(false);
    }
    if (this.props.inputValue === null) {
      this.setState({
        inputValue: ''
      });
    }
  },

  onPlaceholderClick: function onPlaceholderClick() {
    this.getInputDOMNode().focus();
  },

  onOuterFocus: function onOuterFocus() {
    // 此处会影响展开收起动画，类似问题在 onDropdownVisibleChange 里的 setTimeout 。
    // this.setState({
    //   focused: true,
    // });
  },

  onOuterBlur: function onOuterBlur() {
    // 此处会影响展开收起动画，类似问题在 onDropdownVisibleChange 里的 setTimeout 。
    // this.setState({
    //   focused: false,
    // });
  },

  onClearSelection: function onClearSelection(event) {
    var props = this.props;
    var state = this.state;
    if (props.disabled) {
      return;
    }
    event.stopPropagation();
    if (state.inputValue || state.value.length) {
      this.fireChange([]);
      this.setOpenState(false);
      if (props.inputValue === null) {
        this.setState({
          inputValue: ''
        });
      }
    }
  },

  getLabelFromNode: function getLabelFromNode(child) {
    return (0, _util.getPropValue)(child, this.props.treeNodeLabelProp);
  },

  getLabelFromProps: function getLabelFromProps(props, value) {
    var _this3 = this;

    if (value === undefined) {
      return null;
    }
    var label = null;
    (0, _util.loopAllChildren)(this.renderedTreeData || props.children, function (item) {
      if ((0, _util.getValuePropValue)(item) === value) {
        label = _this3.getLabelFromNode(item);
      }
    });
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

  getSearchPlaceholderElement: function getSearchPlaceholderElement(hidden) {
    var props = this.props;
    var placeholder = undefined;
    if ((0, _util.isMultipleOrTagsOrCombobox)(props)) {
      placeholder = props.placeholder || props.searchPlaceholder;
    } else {
      placeholder = props.searchPlaceholder;
    }
    if (placeholder) {
      return _react2['default'].createElement(
        'span',
        {
          style: { display: hidden ? 'none' : 'block' },
          onClick: this.onPlaceholderClick,
          className: props.prefixCls + '-search__field__placeholder'
        },
        placeholder
      );
    }
    return null;
  },

  getInputElement: function getInputElement() {
    var props = this.props;
    return _react2['default'].createElement(
      'span',
      { className: props.prefixCls + '-search__field__wrap' },
      _react2['default'].createElement('input', {
        ref: this.saveInputRef,
        onBlur: this.onInputBlur,
        onChange: this.onInputChange,
        onKeyDown: this.onInputKeyDown,
        value: this.state.inputValue,
        disabled: props.disabled,
        className: props.prefixCls + '-search__field',
        role: 'textbox'
      }),
      (0, _util.isMultipleOrTags)(props) ? null : this.getSearchPlaceholderElement(!!this.state.inputValue)
    );
  },

  getInputDOMNode: function getInputDOMNode() {
    return this.inputInstance;
  },

  getPopupDOMNode: function getPopupDOMNode() {
    return this.refs.trigger.getPopupDOMNode();
  },

  getPopupComponentRefs: function getPopupComponentRefs() {
    return this.refs.trigger.getPopupEleRefs();
  },

  getValue: function getValue(_props, val) {
    var _this4 = this;

    var value = val;
    if (_props.treeCheckable && _props.treeCheckStrictly) {
      this.halfCheckedValues = [];
      value = [];
      val.forEach(function (i) {
        if (!i.halfChecked) {
          value.push(i);
        } else {
          _this4.halfCheckedValues.push(i);
        }
      });
    }
    if (!(_props.treeCheckable && !_props.treeCheckStrictly)) {
      return value;
    }
    var checkedTreeNodes = undefined;
    if (this._cachetreeData && this._cacheTreeNodesStates && this._checkedNodes) {
      this.checkedTreeNodes = checkedTreeNodes = this._checkedNodes;
    } else {
      // getTreeNodesStates 耗时，做缓存处理。
      this._treeNodesStates = (0, _util.getTreeNodesStates)(this.renderedTreeData || _props.children, value.map(function (item) {
        return item.value;
      }));
      this.checkedTreeNodes = checkedTreeNodes = this._treeNodesStates.checkedNodes;
    }
    var mapLabVal = function mapLabVal(arr) {
      return arr.map(function (itemObj) {
        return {
          value: (0, _util.getValuePropValue)(itemObj.node),
          label: (0, _util.getPropValue)(itemObj.node, _props.treeNodeLabelProp)
        };
      });
    };
    var props = this.props;
    var checkedValues = [];
    if (props.showCheckedStrategy === SHOW_ALL) {
      checkedValues = mapLabVal(checkedTreeNodes);
    } else if (props.showCheckedStrategy === SHOW_PARENT) {
      (function () {
        var posArr = (0, _util.filterParentPosition)(checkedTreeNodes.map(function (itemObj) {
          return itemObj.pos;
        }));
        checkedValues = mapLabVal(checkedTreeNodes.filter(function (itemObj) {
          return posArr.indexOf(itemObj.pos) !== -1;
        }));
      })();
    } else {
      checkedValues = mapLabVal(checkedTreeNodes.filter(function (itemObj) {
        return !itemObj.node.props.children;
      }));
    }
    return checkedValues;
  },

  getCheckedNodes: function getCheckedNodes(info, props) {
    // TODO treeCheckable does not support tags/dynamic
    var checkedNodes = info.checkedNodes;

    if (props.treeCheckStrictly) {
      return checkedNodes;
    }
    var checkedNodesPositions = info.checkedNodesPositions;
    if (props.showCheckedStrategy === SHOW_ALL) {
      checkedNodes = checkedNodes;
    } else if (props.showCheckedStrategy === SHOW_PARENT) {
      (function () {
        var posArr = (0, _util.filterParentPosition)(checkedNodesPositions.map(function (itemObj) {
          return itemObj.pos;
        }));
        checkedNodes = checkedNodesPositions.filter(function (itemObj) {
          return posArr.indexOf(itemObj.pos) !== -1;
        }).map(function (itemObj) {
          return itemObj.node;
        });
      })();
    } else {
      checkedNodes = checkedNodes.filter(function (n) {
        return !n.props.children;
      });
    }
    return checkedNodes;
  },

  getDeselectedValue: function getDeselectedValue(selectedValue) {
    var checkedTreeNodes = this.checkedTreeNodes;
    var unCheckPos = undefined;
    checkedTreeNodes.forEach(function (itemObj) {
      if (itemObj.node.props.value === selectedValue) {
        unCheckPos = itemObj.pos;
      }
    });
    var nArr = unCheckPos.split('-');
    var newVals = [];
    var newCkTns = [];
    checkedTreeNodes.forEach(function (itemObj) {
      var iArr = itemObj.pos.split('-');
      if (itemObj.pos === unCheckPos || nArr.length > iArr.length && (0, _util.isInclude)(iArr, nArr) || nArr.length < iArr.length && (0, _util.isInclude)(nArr, iArr)) {
        // 过滤掉 父级节点 和 所有子节点。
        // 因为 node节点 不选时，其 父级节点 和 所有子节点 都不选。
        return;
      }
      newCkTns.push(itemObj);
      newVals.push(itemObj.node.props.value);
    });
    this.checkedTreeNodes = this._checkedNodes = newCkTns;
    var nv = this.state.value.filter(function (val) {
      return newVals.indexOf(val.value) !== -1;
    });
    this.fireChange(nv, { triggerValue: selectedValue, clear: true });
  },

  setOpenState: function setOpenState(open, needFocus) {
    var _this5 = this;

    this.clearDelayTimer();
    var props = this.props;
    var refs = this.refs;

    // can not optimize, if children is empty
    // if (this.state.open === open) {
    //   return;
    // }
    this.setState({
      open: open
    }, function () {
      if (needFocus || open) {
        if (open || (0, _util.isMultipleOrTagsOrCombobox)(props)) {
          var input = _this5.getInputDOMNode();
          if (input && document.activeElement !== input) {
            input.focus();
          }
        } else if (refs.selection) {
          refs.selection.focus();
        }
      }
    });
  },

  addLabelToValue: function addLabelToValue(props, value_) {
    var _this6 = this;

    var value = value_;
    if (this.isLabelInValue()) {
      value.forEach(function (v, i) {
        if (Object.prototype.toString.call(value[i]) !== '[object Object]') {
          value[i] = {
            value: '',
            label: ''
          };
          return;
        }
        v.label = v.label || _this6.getLabelFromProps(props, v.value);
      });
    } else {
      value = value.map(function (v) {
        return {
          value: v,
          label: _this6.getLabelFromProps(props, v)
        };
      });
    }
    return value;
  },

  clearDelayTimer: function clearDelayTimer() {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
  },

  removeSelected: function removeSelected(selectedVal) {
    var props = this.props;
    if (props.disabled) {
      return;
    }
    this._cacheTreeNodesStates = 'no';
    if (props.treeCheckable && (props.showCheckedStrategy === SHOW_ALL || props.showCheckedStrategy === SHOW_PARENT) && !props.treeCheckStrictly) {
      this.getDeselectedValue(selectedVal);
      return;
    }
    // if (props.treeCheckable) {
    //   // 在 treeCheckable 时，相当于触发节点的 check(uncheck) 事件，
    //   // 但假如 dropdown 没展开过，tree 也就没渲染好，触发不了tree内部方法。
    // }
    var label = undefined;
    var value = this.state.value.filter(function (singleValue) {
      if (singleValue.value === selectedVal) {
        label = singleValue.label;
      }
      return singleValue.value !== selectedVal;
    });
    var canMultiple = (0, _util.isMultipleOrTags)(props);

    if (canMultiple) {
      var _event = selectedVal;
      if (this.isLabelInValue()) {
        _event = {
          value: selectedVal,
          label: label
        };
      }
      props.onDeselect(_event);
    }
    if (props.treeCheckable) {
      if (this.checkedTreeNodes && this.checkedTreeNodes.length) {
        this.checkedTreeNodes = this._checkedNodes = this.checkedTreeNodes.filter(function (item) {
          return value.some(function (i) {
            return i.value === item.node.props.value;
          });
        });
      }
    }
    this.fireChange(value, { triggerValue: selectedVal, clear: true });
  },

  openIfHasChildren: function openIfHasChildren() {
    var props = this.props;
    if (_react2['default'].Children.count(props.children) || (0, _util.isSingleMode)(props)) {
      this.setOpenState(true);
    }
  },

  fireChange: function fireChange(value, extraInfo) {
    var _this7 = this;

    var props = this.props;
    if (!('value' in props)) {
      this.setState({
        value: value
      });
    }
    var vals = value.map(function (i) {
      return i.value;
    });
    var sv = this.state.value.map(function (i) {
      return i.value;
    });
    if (vals.length !== sv.length || !vals.every(function (val, index) {
      return sv[index] === val;
    })) {
      (function () {
        var ex = { preValue: [].concat(_toConsumableArray(_this7.state.value)) };
        if (extraInfo) {
          (0, _objectAssign2['default'])(ex, extraInfo);
        }
        var labs = null;
        var vls = value;
        if (!_this7.isLabelInValue()) {
          labs = value.map(function (i) {
            return i.label;
          });
          vls = vls.map(function (v) {
            return v.value;
          });
        } else if (_this7.halfCheckedValues && _this7.halfCheckedValues.length) {
          _this7.halfCheckedValues.forEach(function (i) {
            if (!vls.some(function (v) {
              return v.value === i.value;
            })) {
              vls.push(i);
            }
          });
        }
        if (ex.clear && props.treeCheckable) {
          var treeData = _this7.renderedTreeData || props.children;
          ex.allCheckedNodes = (0, _util.flatToHierarchy)((0, _util.filterAllCheckedData)(vals, treeData));
        }
        _this7._savedValue = (0, _util.isMultipleOrTags)(props) ? vls : vls[0];
        props.onChange(_this7._savedValue, labs, ex);
      })();
    }
  },

  isLabelInValue: function isLabelInValue() {
    var _props2 = this.props;
    var treeCheckable = _props2.treeCheckable;
    var treeCheckStrictly = _props2.treeCheckStrictly;
    var labelInValue = _props2.labelInValue;

    if (treeCheckable && treeCheckStrictly) {
      return true;
    }
    return labelInValue || false;
  },

  renderTopControlNode: function renderTopControlNode() {
    var _this8 = this;

    var value = this.state.value;

    var props = this.props;
    var choiceTransitionName = props.choiceTransitionName;
    var prefixCls = props.prefixCls;
    var maxTagTextLength = props.maxTagTextLength;

    // single and not combobox, input is inside dropdown
    if ((0, _util.isSingleMode)(props)) {
      var innerNode = _react2['default'].createElement(
        'span',
        {
          key: 'placeholder',
          className: prefixCls + '-selection__placeholder'
        },
        props.placeholder
      );
      if (value.length) {
        innerNode = _react2['default'].createElement(
          'span',
          { key: 'value' },
          value[0].label
        );
      }
      return _react2['default'].createElement(
        'span',
        { className: prefixCls + '-selection__rendered' },
        innerNode
      );
    }

    var selectedValueNodes = [];
    if ((0, _util.isMultipleOrTags)(props)) {
      selectedValueNodes = value.map(function (singleValue) {
        var content = singleValue.label;
        var title = content;
        if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
          content = content.slice(0, maxTagTextLength) + '...';
        }
        return _react2['default'].createElement(
          'li',
          _extends({
            style: _util.UNSELECTABLE_STYLE
          }, _util.UNSELECTABLE_ATTRIBUTE, {
            onMouseDown: _util.preventDefaultEvent,
            className: prefixCls + '-selection__choice',
            key: singleValue.value,
            title: title
          }),
          _react2['default'].createElement('span', {
            className: prefixCls + '-selection__choice__remove',
            onClick: _this8.removeSelected.bind(_this8, singleValue.value)
          }),
          _react2['default'].createElement(
            'span',
            { className: prefixCls + '-selection__choice__content' },
            content
          )
        );
      });
    }
    selectedValueNodes.push(_react2['default'].createElement(
      'li',
      {
        className: prefixCls + '-search ' + prefixCls + '-search--inline',
        key: '__input'
      },
      this.getInputElement()
    ));
    var className = prefixCls + '-selection__rendered';
    if ((0, _util.isMultipleOrTags)(props) && choiceTransitionName) {
      return _react2['default'].createElement(
        _rcAnimate2['default'],
        {
          className: className,
          component: 'ul',
          transitionName: choiceTransitionName
        },
        selectedValueNodes
      );
    }
    return _react2['default'].createElement(
      'ul',
      { className: className },
      selectedValueNodes
    );
  },

  renderTreeData: function renderTreeData(props) {
    var validProps = props || this.props;
    if (validProps.treeData) {
      if (props && props.treeData === this.props.treeData && this.renderedTreeData) {
        // cache and use pre data.
        this._cachetreeData = true;
        return this.renderedTreeData;
      }
      this._cachetreeData = false;
      var treeData = validProps.treeData;
      // process treeDataSimpleMode
      if (validProps.treeDataSimpleMode) {
        var simpleFormat = {
          id: 'id',
          pId: 'pId',
          rootPId: null
        };
        if (Object.prototype.toString.call(validProps.treeDataSimpleMode) === '[object Object]') {
          (0, _objectAssign2['default'])(simpleFormat, validProps.treeDataSimpleMode);
        }
        treeData = (0, _util.processSimpleTreeData)(validProps.treeData, simpleFormat);
      }
      return loopTreeData(treeData);
    }
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
    if (!(0, _util.isMultipleOrTagsOrCombobox)(props)) {
      extraSelectionProps = {
        onKeyDown: this.onKeyDown,
        tabIndex: 0
      };
    }
    var rootCls = (_rootCls = {}, _defineProperty(_rootCls, className, !!className), _defineProperty(_rootCls, prefixCls, 1), _defineProperty(_rootCls, prefixCls + '-open', state.open), _defineProperty(_rootCls, prefixCls + '-focused', state.open || state.focused), _defineProperty(_rootCls, prefixCls + '-disabled', disabled), _defineProperty(_rootCls, prefixCls + '-enabled', !disabled), _rootCls);

    var clear = _react2['default'].createElement('span', {
      key: 'clear',
      className: prefixCls + '-selection__clear',
      onClick: this.onClearSelection
    });
    return _react2['default'].createElement(
      _SelectTrigger2['default'],
      _extends({}, props, {
        treeNodes: props.children,
        treeData: this.renderedTreeData,
        _cachetreeData: this._cachetreeData,
        _treeNodesStates: this._treeNodesStates,
        halfCheckedValues: this.halfCheckedValues,
        multiple: multiple,
        disabled: disabled,
        visible: state.open,
        inputValue: state.inputValue,
        _inputValue: props.inputValue === null,
        inputElement: this.getInputElement(),
        value: state.value,
        onDropdownVisibleChange: this.onDropdownVisibleChange,
        onSelect: this.onSelect,
        ref: 'trigger'
      }),
      _react2['default'].createElement(
        'span',
        {
          style: props.style,
          onClick: props.onClick,
          onBlur: this.onOuterBlur,
          onFocus: this.onOuterFocus,
          className: (0, _classnames2['default'])(rootCls)
        },
        _react2['default'].createElement(
          'span',
          _extends({
            ref: 'selection',
            key: 'selection',
            className: prefixCls + '-selection\n            ' + prefixCls + '-selection--' + (multiple ? 'multiple' : 'single'),
            role: 'combobox',
            'aria-autocomplete': 'list',
            'aria-haspopup': 'true',
            'aria-expanded': state.open
          }, extraSelectionProps),
          ctrlNode,
          allowClear && !multiple ? clear : null,
          multiple || !props.showArrow ? null : _react2['default'].createElement(
            'span',
            {
              key: 'arrow',
              className: prefixCls + '-arrow',
              style: { outline: 'none' }
            },
            _react2['default'].createElement('b', null)
          ),
          multiple ? this.getSearchPlaceholderElement(!!this.state.inputValue || this.state.value.length) : null
        )
      )
    );
  }
});

Select.SHOW_ALL = SHOW_ALL;
Select.SHOW_PARENT = SHOW_PARENT;
Select.SHOW_CHILD = SHOW_CHILD;

exports['default'] = Select;
module.exports = exports['default'];
/* isCombobox,*/

// [`${prefixCls}-combobox`]: isCombobox(props),