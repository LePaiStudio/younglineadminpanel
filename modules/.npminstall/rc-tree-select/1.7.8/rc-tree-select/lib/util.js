/* eslint no-loop-func: 0*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getValuePropValue = getValuePropValue;
exports.getPropValue = getPropValue;
exports.isCombobox = isCombobox;
exports.isMultipleOrTags = isMultipleOrTags;
exports.isMultipleOrTagsOrCombobox = isMultipleOrTagsOrCombobox;
exports.isSingleMode = isSingleMode;
exports.toArray = toArray;
exports.preventDefaultEvent = preventDefaultEvent;
exports.labelCompatible = labelCompatible;
exports.isInclude = isInclude;
exports.loopAllChildren = loopAllChildren;
exports.flatToHierarchy = flatToHierarchy;
exports.filterParentPosition = filterParentPosition;
exports.handleCheckState = handleCheckState;
exports.getTreeNodesStates = getTreeNodesStates;
exports.recursiveCloneChildren = recursiveCloneChildren;
exports.filterAllCheckedData = filterAllCheckedData;
exports.processSimpleTreeData = processSimpleTreeData;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function getValuePropValue(child) {
  var props = child.props;
  if ('value' in props) {
    return props.value;
  }
  if (child.key) {
    return child.key;
  }
  throw new Error('no key or value for ' + child);
}

function getPropValue(child, prop) {
  if (prop === 'value') {
    return getValuePropValue(child);
  }
  return child.props[prop];
}

function isCombobox(props) {
  return props.combobox;
}

function isMultipleOrTags(props) {
  return props.multiple || props.tags || props.treeCheckable;
}

function isMultipleOrTagsOrCombobox(props) {
  return isMultipleOrTags(props) || isCombobox(props);
}

function isSingleMode(props) {
  return !isMultipleOrTagsOrCombobox(props);
}

function toArray(value) {
  var ret = value;
  if (value === undefined) {
    ret = [];
  } else if (!Array.isArray(value)) {
    ret = [value];
  }
  return ret;
}

function preventDefaultEvent(e) {
  e.preventDefault();
}

var UNSELECTABLE_STYLE = {
  userSelect: 'none',
  WebkitUserSelect: 'none'
};

exports.UNSELECTABLE_STYLE = UNSELECTABLE_STYLE;
var UNSELECTABLE_ATTRIBUTE = {
  unselectable: 'unselectable'
};

exports.UNSELECTABLE_ATTRIBUTE = UNSELECTABLE_ATTRIBUTE;

function labelCompatible(prop) {
  var newProp = prop;
  if (newProp === 'label') {
    newProp = 'title';
  }
  return newProp;
}

function isInclude(smallArray, bigArray) {
  // attention: [0,0,1] [0,0,10]
  return smallArray.every(function (ii, i) {
    return ii === bigArray[i];
  });
}

/*
export function getCheckedKeys(node, checkedKeys, allCheckedNodesKeys) {
  const nodeKey = node.props.eventKey;
  let newCks = [...checkedKeys];
  let nodePos;
  const unCheck = allCheckedNodesKeys.some(item => {
    if (item.key === nodeKey) {
      nodePos = item.pos;
      return true;
    }
  });
  if (unCheck) {
    const nArr = nodePos.split('-');
    newCks = [];
    allCheckedNodesKeys.forEach(item => {
      const iArr = item.pos.split('-');
      if (item.pos === nodePos ||
        nArr.length > iArr.length && isInclude(iArr, nArr) ||
        nArr.length < iArr.length && isInclude(nArr, iArr)) {
        // 过滤掉 父级节点 和 所有子节点。
        // 因为 node节点 不选时，其 父级节点 和 所有子节点 都不选。
        return;
      }
      newCks.push(item.key);
    });
  } else {
    newCks.push(nodeKey);
  }
  return newCks;
}
*/

function getChildrenlength(children) {
  var len = 1;
  if (Array.isArray(children)) {
    len = children.length;
  }
  return len;
}

function getSiblingPosition(index, len, siblingPosition) {
  if (len === 1) {
    siblingPosition.first = true;
    siblingPosition.last = true;
  } else {
    siblingPosition.first = index === 0;
    siblingPosition.last = index === len - 1;
  }
  return siblingPosition;
}

function loopAllChildren(childs, callback, parent) {
  var loop = function loop(children, level, _parent) {
    var len = getChildrenlength(children);
    _react2['default'].Children.forEach(children, function (item, index) {
      var pos = level + '-' + index;
      if (item && item.props.children && item.type) {
        loop(item.props.children, pos, { node: item, pos: pos });
      }
      if (item) {
        callback(item, index, pos, item.key || pos, getSiblingPosition(index, len, {}), _parent);
      }
    });
  };
  loop(childs, 0, parent);
}

// export function loopAllChildren(childs, callback) {
//   const loop = (children, level) => {
//     React.Children.forEach(children, (item, index) => {
//       const pos = `${level}-${index}`;
//       if (item && item.props.children) {
//         loop(item.props.children, pos);
//       }
//       if (item) {
//         callback(item, index, pos, getValuePropValue(item));
//       }
//     });
//   };
//   loop(childs, 0);
// }

function flatToHierarchy(arr) {
  if (!arr.length) {
    return arr;
  }
  var hierarchyNodes = [];
  var levelObj = {};
  arr.forEach(function (item) {
    if (!item.pos) {
      return;
    }
    var posLen = item.pos.split('-').length;
    if (!levelObj[posLen]) {
      levelObj[posLen] = [];
    }
    levelObj[posLen].push(item);
  });
  var levelArr = Object.keys(levelObj).sort(function (a, b) {
    return b - a;
  });
  // const s = Date.now();
  // todo: 数据量大时，下边函数性能差，能否是o1时间复杂度？
  levelArr.reduce(function (pre, cur) {
    if (cur && cur !== pre) {
      levelObj[pre].forEach(function (item) {
        var haveParent = false;
        levelObj[cur].forEach(function (ii) {
          if (isInclude(ii.pos.split('-'), item.pos.split('-'))) {
            haveParent = true;
            if (!ii.children) {
              ii.children = [];
            }
            ii.children.push(item);
          }
        });
        if (!haveParent) {
          hierarchyNodes.push(item);
        }
      });
    }
    return cur;
  });
  // console.log(Date.now() - s);
  return levelObj[levelArr[levelArr.length - 1]].concat(hierarchyNodes);
}

// arr.length === 628, use time: ~20ms

function filterParentPosition(arr) {
  var levelObj = {};
  arr.forEach(function (item) {
    var posLen = item.split('-').length;
    if (!levelObj[posLen]) {
      levelObj[posLen] = [];
    }
    levelObj[posLen].push(item);
  });
  var levelArr = Object.keys(levelObj).sort();

  var _loop = function (i) {
    if (levelArr[i + 1]) {
      levelObj[levelArr[i]].forEach(function (ii) {
        var _loop2 = function (j) {
          levelObj[levelArr[j]].forEach(function (_i, index) {
            if (isInclude(ii.split('-'), _i.split('-'))) {
              levelObj[levelArr[j]][index] = null;
            }
          });
          levelObj[levelArr[j]] = levelObj[levelArr[j]].filter(function (p) {
            return p;
          });
        };

        for (var j = i + 1; j < levelArr.length; j++) {
          _loop2(j);
        }
      });
    }
  };

  for (var i = 0; i < levelArr.length; i++) {
    _loop(i);
  }
  var nArr = [];
  levelArr.forEach(function (i) {
    nArr = nArr.concat(levelObj[i]);
  });
  return nArr;
}

// console.log(filterParentPosition(['0-2', '0-3-3', '0-10', '0-10-0', '0-0-1', '0-0', '0-1-1', '0-1']));

function stripTail(str) {
  var arr = str.match(/(.+)(-[^-]+)$/);
  var st = '';
  if (arr && arr.length === 3) {
    st = arr[1];
  }
  return st;
}
function splitPosition(pos) {
  return pos.split('-');
}

// TODO 再优化

function handleCheckState(obj, checkedPositionArr, checkIt) {
  // console.log(stripTail('0-101-000'));
  // let s = Date.now();
  var objKeys = Object.keys(obj);

  objKeys.forEach(function (i, index) {
    var iArr = splitPosition(i);
    var saved = false;
    checkedPositionArr.forEach(function (_pos) {
      // 设置子节点，全选或全不选
      var _posArr = splitPosition(_pos);
      if (iArr.length > _posArr.length && isInclude(_posArr, iArr)) {
        obj[i].halfChecked = false;
        obj[i].checked = checkIt;
        objKeys[index] = null;
      }
      if (iArr[0] === _posArr[0] && iArr[1] === _posArr[1]) {
        // 如果
        saved = true;
      }
    });
    if (!saved) {
      objKeys[index] = null;
    }
  });
  objKeys = objKeys.filter(function (i) {
    return i;
  }); // filter non null;

  var _loop3 = function (_pIndex) {
    // 循环设置父节点的 选中 或 半选状态
    var loop = function loop(__pos) {
      var _posLen = splitPosition(__pos).length;
      if (_posLen <= 2) {
        // e.g. '0-0', '0-1'
        return;
      }
      var sibling = 0;
      var siblingChecked = 0;
      var parentPosition = stripTail(__pos);
      objKeys.forEach(function (i /* , index*/) {
        var iArr = splitPosition(i);
        if (iArr.length === _posLen && isInclude(splitPosition(parentPosition), iArr)) {
          sibling++;
          if (obj[i].checked) {
            siblingChecked++;
            var _i = checkedPositionArr.indexOf(i);
            if (_i > -1) {
              checkedPositionArr.splice(_i, 1);
              if (_i <= _pIndex) {
                _pIndex--;
              }
            }
          } else if (obj[i].halfChecked) {
            siblingChecked += 0.5;
          }
          // objKeys[index] = null;
        }
      });
      // objKeys = objKeys.filter(i => i); // filter non null;
      var parent = obj[parentPosition];
      // sibling 不会等于0
      // 全不选 - 全选 - 半选
      if (siblingChecked === 0) {
        parent.checked = false;
        parent.halfChecked = false;
      } else if (siblingChecked === sibling) {
        parent.checked = true;
        parent.halfChecked = false;
      } else {
        parent.halfChecked = true;
        parent.checked = false;
      }
      loop(parentPosition);
    };
    loop(checkedPositionArr[_pIndex], _pIndex);
    pIndex = _pIndex;
  };

  for (var pIndex = 0; pIndex < checkedPositionArr.length; pIndex++) {
    _loop3(pIndex);
  }
  // console.log(Date.now()-s, objKeys.length, checkIt);
}

function getCheck(treeNodesStates, checkedPositions) {
  var halfCheckedKeys = [];
  var checkedKeys = [];
  var checkedNodes = [];
  Object.keys(treeNodesStates).forEach(function (item) {
    var itemObj = treeNodesStates[item];
    if (itemObj.checked) {
      checkedKeys.push(itemObj.key);
      // checkedNodes.push(getValuePropValue(itemObj.node));
      checkedNodes.push(_extends({}, itemObj, { pos: item }));
    } else if (itemObj.halfChecked) {
      halfCheckedKeys.push(itemObj.key);
    }
  });
  return {
    halfCheckedKeys: halfCheckedKeys, checkedKeys: checkedKeys, checkedNodes: checkedNodes, treeNodesStates: treeNodesStates, checkedPositions: checkedPositions
  };
}

function getTreeNodesStates(children, values) {
  var checkedPositions = [];
  var treeNodesStates = {};
  loopAllChildren(children, function (item, index, pos, keyOrPos, siblingPosition) {
    treeNodesStates[pos] = {
      node: item,
      key: keyOrPos,
      checked: false,
      halfChecked: false,
      siblingPosition: siblingPosition
    };
    if (values.indexOf(getValuePropValue(item)) !== -1) {
      treeNodesStates[pos].checked = true;
      checkedPositions.push(pos);
    }
  });

  handleCheckState(treeNodesStates, filterParentPosition(checkedPositions.sort()), true);

  return getCheck(treeNodesStates, checkedPositions);
}

// 给每一个 children 节点，增加 prop

function recursiveCloneChildren(children) {
  var cb = arguments.length <= 1 || arguments[1] === undefined ? function (ch) {
    return ch;
  } : arguments[1];

  // return React.Children.map(children, child => {
  return Array.from(children).map(function (child) {
    var newChild = cb(child);
    if (newChild && newChild.props && newChild.props.children) {
      return _react2['default'].cloneElement(newChild, {}, recursiveCloneChildren(newChild.props.children, cb));
    }
    return newChild;
  });
}

// const newChildren = recursiveCloneChildren(children, child => {
//   const extraProps = {};
//   if (child && child.type && child.type.xxx) {
//     extraProps._prop = true;
//     return React.cloneElement(child, extraProps);
//   }
//   return child;
// });

function recursiveGen(children) {
  var level = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  return _react2['default'].Children.map(children, function (child, index) {
    var pos = level + '-' + index;
    var o = {
      title: child.props.title,
      label: child.props.label || child.props.title,
      value: child.props.value,
      key: child.key,
      _pos: pos
    };
    if (child.props.children) {
      o.children = recursiveGen(child.props.children, pos);
    }
    return o;
  });
}

function recursive(children, cb) {
  children.forEach(function (item) {
    cb(item);
    if (item.children) {
      recursive(item.children, cb);
    }
  });
}

// 用于根据选择框里的 value 筛选初始的 tree 数据里全部选中项。
// 规则是：某一项选中，则子项全选中；相邻节点全选中，则父节点选中。
// 与 handleCheckState 部分功能重合，TODO：优化合并起来。

function filterAllCheckedData(vs, treeNodes) {
  var vals = [].concat(_toConsumableArray(vs));
  if (!vals.length) {
    return vals;
  }

  var data = recursiveGen(treeNodes);
  var checkedNodesPositions = [];

  function checkChildren(children) {
    children.forEach(function (item) {
      if (item.__checked) {
        return;
      }
      var ci = vals.indexOf(item.value);
      var childs = item.children;
      if (ci > -1) {
        item.__checked = true;
        checkedNodesPositions.push({ node: item, pos: item._pos });
        vals.splice(ci, 1);
        if (childs) {
          recursive(childs, function (child) {
            child.__checked = true;
            checkedNodesPositions.push({ node: child, pos: child._pos });
          });
        }
      } else {
        if (childs) {
          checkChildren(childs);
        }
      }
    });
  }

  function checkParent(children) {
    var parent = arguments.length <= 1 || arguments[1] === undefined ? { root: true } : arguments[1];

    var siblingChecked = 0;
    children.forEach(function (item) {
      var childs = item.children;
      if (childs && !item.__checked && !item.__halfChecked) {
        var p = checkParent(childs, item);
        if (p.__checked) {
          siblingChecked++;
        } else if (p.__halfChecked) {
          siblingChecked += 0.5;
        }
      } else if (item.__checked) {
        siblingChecked++;
      } else if (item.__halfChecked) {
        siblingChecked += 0.5;
      }
    });
    var len = children.length;
    if (siblingChecked === len) {
      parent.__checked = true;
      checkedNodesPositions.push({ node: parent, pos: parent._pos });
    } else if (siblingChecked < len && siblingChecked > 0) {
      parent.__halfChecked = true;
    }
    if (parent.root) {
      return children;
    }
    return parent;
  }
  checkChildren(data);
  checkParent(data);

  checkedNodesPositions.forEach(function (i, index) {
    // 清理掉私有数据
    delete checkedNodesPositions[index].node.__checked;
    delete checkedNodesPositions[index].node._pos;
    // 封装出 props 和 onCheck 返回值一致
    checkedNodesPositions[index].node.props = {
      title: checkedNodesPositions[index].node.title,
      label: checkedNodesPositions[index].node.label || checkedNodesPositions[index].node.title,
      value: checkedNodesPositions[index].node.value
    };
    if (checkedNodesPositions[index].node.children) {
      checkedNodesPositions[index].node.props.children = checkedNodesPositions[index].node.children;
    }
    delete checkedNodesPositions[index].node.title;
    delete checkedNodesPositions[index].node.label;
    delete checkedNodesPositions[index].node.value;
    delete checkedNodesPositions[index].node.children;
  });
  return checkedNodesPositions;
}

function processSimpleTreeData(treeData, format) {
  function unflatten2(array) {
    var parent = arguments.length <= 1 || arguments[1] === undefined ? _defineProperty({}, format.id, format.rootPId) : arguments[1];

    var children = [];
    for (var i = 0; i < array.length; i++) {
      if (array[i][format.pId] === parent[format.id]) {
        array[i].key = array[i][format.id];
        children.push(array[i]);
        array.splice(i--, 1);
      }
    }
    if (children.length) {
      parent.children = children;
      children.forEach(function (child) {
        return unflatten2(array, child);
      });
    }
    if (parent[format.id] === format.rootPId) {
      return children;
    }
  }
  return unflatten2(treeData);
}