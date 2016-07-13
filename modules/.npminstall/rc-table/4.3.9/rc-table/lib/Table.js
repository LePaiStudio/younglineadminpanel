'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TableRow = require('./TableRow');

var _TableRow2 = _interopRequireDefault(_TableRow);

var _utils = require('./utils');

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _rcUtilLibDomAddEventListener = require('rc-util/lib/Dom/addEventListener');

var _rcUtilLibDomAddEventListener2 = _interopRequireDefault(_rcUtilLibDomAddEventListener);

var Table = _react2['default'].createClass({
  displayName: 'Table',

  propTypes: {
    data: _react.PropTypes.array,
    expandIconAsCell: _react.PropTypes.bool,
    defaultExpandAllRows: _react.PropTypes.bool,
    expandedRowKeys: _react.PropTypes.array,
    defaultExpandedRowKeys: _react.PropTypes.array,
    useFixedHeader: _react.PropTypes.bool,
    columns: _react.PropTypes.array,
    prefixCls: _react.PropTypes.string,
    bodyStyle: _react.PropTypes.object,
    style: _react.PropTypes.object,
    rowKey: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
    rowClassName: _react.PropTypes.func,
    expandedRowClassName: _react.PropTypes.func,
    childrenColumnName: _react.PropTypes.string,
    onExpand: _react.PropTypes.func,
    onExpandedRowsChange: _react.PropTypes.func,
    indentSize: _react.PropTypes.number,
    onRowClick: _react.PropTypes.func,
    columnsPageRange: _react.PropTypes.array,
    columnsPageSize: _react.PropTypes.number,
    expandIconColumnIndex: _react.PropTypes.number,
    showHeader: _react.PropTypes.bool,
    footer: _react.PropTypes.func,
    scroll: _react.PropTypes.object,
    rowRef: _react.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      data: [],
      useFixedHeader: false,
      expandIconAsCell: false,
      columns: [],
      defaultExpandAllRows: false,
      defaultExpandedRowKeys: [],
      rowKey: 'key',
      rowClassName: function rowClassName() {
        return '';
      },
      expandedRowClassName: function expandedRowClassName() {
        return '';
      },
      onExpand: function onExpand() {},
      onExpandedRowsChange: function onExpandedRowsChange() {},
      prefixCls: 'rc-table',
      bodyStyle: {},
      style: {},
      childrenColumnName: 'children',
      indentSize: 15,
      columnsPageSize: 5,
      expandIconColumnIndex: 0,
      showHeader: true,
      scroll: {},
      rowRef: function rowRef() {
        return null;
      }
    };
  },

  getInitialState: function getInitialState() {
    var props = this.props;
    var expandedRowKeys = [];
    var rows = [].concat(_toConsumableArray(props.data));
    if (props.defaultExpandAllRows) {
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        expandedRowKeys.push(this.getRowKey(row));
        rows = rows.concat(row[props.childrenColumnName] || []);
      }
    } else {
      expandedRowKeys = props.expandedRowKeys || props.defaultExpandedRowKeys;
    }
    return {
      expandedRowKeys: expandedRowKeys,
      data: props.data,
      currentColumnsPage: 0,
      currentHoverKey: null,
      scrollPosition: 'left',
      fixedColumnsHeadRowsHeight: [],
      fixedColumnsBodyRowsHeight: []
    };
  },

  componentDidMount: function componentDidMount() {
    if (this.refs.headTable) {
      this.refs.headTable.scrollLeft = 0;
    }
    if (this.refs.bodyTable) {
      this.refs.bodyTable.scrollLeft = 0;
    }
    this.syncFixedTableRowHeight();
    var isAnyColumnsFixed = this.isAnyColumnsFixed();
    if (isAnyColumnsFixed) {
      this.resizeEvent = (0, _rcUtilLibDomAddEventListener2['default'])(window, 'resize', (0, _utils.debounce)(this.syncFixedTableRowHeight, 150));
    }
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if ('data' in nextProps) {
      this.setState({
        data: nextProps.data
      });
    }
    if ('expandedRowKeys' in nextProps) {
      this.setState({
        expandedRowKeys: nextProps.expandedRowKeys
      });
    }
    if (nextProps.columns !== this.props.columns) {
      delete this.isAnyColumnsFixedCache;
      delete this.isAnyColumnsLeftFixedCache;
      delete this.isAnyColumnsRightFixedCache;
    }
  },

  componentDidUpdate: function componentDidUpdate() {
    this.syncFixedTableRowHeight();
  },

  componentWillUnmount: function componentWillUnmount() {
    clearTimeout(this.timer);
    if (this.resizeEvent) {
      this.resizeEvent.remove();
    }
  },

  onExpandedRowsChange: function onExpandedRowsChange(expandedRowKeys) {
    if (!this.props.expandedRowKeys) {
      this.setState({
        expandedRowKeys: expandedRowKeys
      });
    }
    this.props.onExpandedRowsChange(expandedRowKeys);
  },

  onExpanded: function onExpanded(expanded, record) {
    var info = this.findExpandedRow(record);
    if (typeof info !== 'undefined' && !expanded) {
      this.onRowDestroy(record);
    } else if (!info && expanded) {
      var expandedRows = this.getExpandedRows().concat();
      expandedRows.push(this.getRowKey(record));
      this.onExpandedRowsChange(expandedRows);
    }
    this.props.onExpand(expanded, record);
  },

  onRowDestroy: function onRowDestroy(record) {
    var expandedRows = this.getExpandedRows().concat();
    var rowKey = this.getRowKey(record);
    var index = -1;
    expandedRows.forEach(function (r, i) {
      if (r === rowKey) {
        index = i;
      }
    });
    if (index !== -1) {
      expandedRows.splice(index, 1);
    }
    this.onExpandedRowsChange(expandedRows);
  },

  getRowKey: function getRowKey(record, index) {
    var rowKey = this.props.rowKey;
    if (typeof rowKey === 'function') {
      return rowKey(record, index);
    }
    return record[rowKey] || index;
  },

  getExpandedRows: function getExpandedRows() {
    return this.props.expandedRowKeys || this.state.expandedRowKeys;
  },

  getHeader: function getHeader(columns, fixed) {
    var _props = this.props;
    var showHeader = _props.showHeader;
    var expandIconAsCell = _props.expandIconAsCell;
    var prefixCls = _props.prefixCls;

    var ths = [];
    if (expandIconAsCell && fixed !== 'right') {
      ths.push({
        key: 'rc-table-expandIconAsCell',
        className: prefixCls + '-expand-icon-th',
        title: ''
      });
    }
    ths = ths.concat(columns || this.getCurrentColumns()).map(function (c) {
      if (c.colSpan !== 0) {
        return _react2['default'].createElement(
          'th',
          { key: c.key, colSpan: c.colSpan, className: c.className || '' },
          c.title
        );
      }
    });
    var fixedColumnsHeadRowsHeight = this.state.fixedColumnsHeadRowsHeight;

    var trStyle = fixedColumnsHeadRowsHeight[0] && columns ? {
      height: fixedColumnsHeadRowsHeight[0]
    } : null;
    return showHeader ? _react2['default'].createElement(
      'thead',
      { className: prefixCls + '-thead' },
      _react2['default'].createElement(
        'tr',
        { style: trStyle },
        ths
      )
    ) : null;
  },

  getExpandedRow: function getExpandedRow(key, content, visible, className, fixed) {
    var prefixCls = this.props.prefixCls;
    return _react2['default'].createElement(
      'tr',
      {
        key: key + '-extra-row',
        style: { display: visible ? '' : 'none' },
        className: prefixCls + '-expanded-row ' + className },
      this.props.expandIconAsCell && fixed !== 'right' ? _react2['default'].createElement('td', { key: 'rc-table-expand-icon-placeholder' }) : null,
      _react2['default'].createElement(
        'td',
        { colSpan: this.props.columns.length },
        fixed !== 'right' ? content : '&nbsp;'
      )
    );
  },

  getRowsByData: function getRowsByData(data, visible, indent, columns, fixed) {
    var props = this.props;
    var childrenColumnName = props.childrenColumnName;
    var expandedRowRender = props.expandedRowRender;
    var fixedColumnsBodyRowsHeight = this.state.fixedColumnsBodyRowsHeight;

    var rst = [];
    var rowClassName = props.rowClassName;
    var rowRef = props.rowRef;
    var expandedRowClassName = props.expandedRowClassName;
    var needIndentSpaced = props.data.some(function (record) {
      return record[childrenColumnName];
    });
    var onRowClick = props.onRowClick;
    var isAnyColumnsFixed = this.isAnyColumnsFixed();

    var expandIconAsCell = fixed !== 'right' ? props.expandIconAsCell : false;
    var expandIconColumnIndex = fixed !== 'right' ? props.expandIconColumnIndex : -1;

    for (var i = 0; i < data.length; i++) {
      var record = data[i];
      var key = this.getRowKey(record, i);
      var childrenColumn = record[childrenColumnName];
      var isRowExpanded = this.isRowExpanded(record);
      var expandedRowContent = undefined;
      if (expandedRowRender && isRowExpanded) {
        expandedRowContent = expandedRowRender(record, i);
      }
      var className = rowClassName(record, i);
      if (this.state.currentHoverKey === key) {
        className += ' ' + props.prefixCls + '-row-hover';
      }

      var onHoverProps = {};
      if (isAnyColumnsFixed) {
        onHoverProps.onHover = this.handleRowHover;
      }

      var style = fixed && fixedColumnsBodyRowsHeight[i] ? {
        height: fixedColumnsBodyRowsHeight[i]
      } : {};

      rst.push(_react2['default'].createElement(_TableRow2['default'], _extends({
        indent: indent,
        indentSize: props.indentSize,
        needIndentSpaced: needIndentSpaced,
        className: className,
        record: record,
        expandIconAsCell: expandIconAsCell,
        onDestroy: this.onRowDestroy,
        index: i,
        visible: visible,
        onExpand: this.onExpanded,
        expandable: childrenColumn || expandedRowRender,
        expanded: isRowExpanded,
        prefixCls: props.prefixCls + '-row',
        childrenColumnName: childrenColumnName,
        columns: columns || this.getCurrentColumns(),
        expandIconColumnIndex: expandIconColumnIndex,
        onRowClick: onRowClick,
        style: style
      }, onHoverProps, {
        key: key,
        hoverKey: key,
        ref: rowRef(record, i)
      })));

      var subVisible = visible && isRowExpanded;

      if (expandedRowContent && isRowExpanded) {
        rst.push(this.getExpandedRow(key, expandedRowContent, subVisible, expandedRowClassName(record, i), fixed));
      }
      if (childrenColumn) {
        rst = rst.concat(this.getRowsByData(childrenColumn, subVisible, indent + 1, columns, fixed));
      }
    }
    return rst;
  },

  getRows: function getRows(columns, fixed) {
    return this.getRowsByData(this.state.data, true, 0, columns, fixed);
  },

  getColGroup: function getColGroup(columns, fixed) {
    var cols = [];
    if (this.props.expandIconAsCell && fixed !== 'right') {
      cols.push(_react2['default'].createElement('col', { className: this.props.prefixCls + '-expand-icon-col', key: 'rc-table-expand-icon-col' }));
    }
    cols = cols.concat((columns || this.props.columns).map(function (c) {
      return _react2['default'].createElement('col', { key: c.key, style: { width: c.width, minWidth: c.width } });
    }));
    return _react2['default'].createElement(
      'colgroup',
      null,
      cols
    );
  },

  getCurrentColumns: function getCurrentColumns() {
    var _this = this;

    var _props2 = this.props;
    var columns = _props2.columns;
    var columnsPageRange = _props2.columnsPageRange;
    var columnsPageSize = _props2.columnsPageSize;
    var prefixCls = _props2.prefixCls;
    var currentColumnsPage = this.state.currentColumnsPage;

    if (!columnsPageRange || columnsPageRange[0] > columnsPageRange[1]) {
      return columns;
    }
    return columns.map(function (column, i) {
      var newColumn = _extends({}, column);
      if (i >= columnsPageRange[0] && i <= columnsPageRange[1]) {
        var pageIndexStart = columnsPageRange[0] + currentColumnsPage * columnsPageSize;
        var pageIndexEnd = columnsPageRange[0] + (currentColumnsPage + 1) * columnsPageSize - 1;
        if (pageIndexEnd > columnsPageRange[1]) {
          pageIndexEnd = columnsPageRange[1];
        }
        if (i < pageIndexStart || i > pageIndexEnd) {
          newColumn.className = newColumn.className || '';
          newColumn.className += ' ' + prefixCls + '-column-hidden';
        }
        newColumn = _this.wrapPageColumn(newColumn, i === pageIndexStart, i === pageIndexEnd);
      }
      return newColumn;
    });
  },

  getLeftFixedTable: function getLeftFixedTable() {
    var columns = this.props.columns;

    var fixedColumns = columns.filter(function (column) {
      return column.fixed === 'left' || column.fixed === true;
    });
    return this.getTable({
      columns: fixedColumns,
      fixed: 'left'
    });
  },

  getRightFixedTable: function getRightFixedTable() {
    var columns = this.props.columns;

    var fixedColumns = columns.filter(function (column) {
      return column.fixed === 'right';
    });
    return this.getTable({
      columns: fixedColumns,
      fixed: 'right'
    });
  },

  getTable: function getTable() {
    var _this2 = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var columns = options.columns;
    var fixed = options.fixed;
    var _props3 = this.props;
    var prefixCls = _props3.prefixCls;
    var _props3$scroll = _props3.scroll;
    var scroll = _props3$scroll === undefined ? {} : _props3$scroll;
    var useFixedHeader = this.props.useFixedHeader;

    var bodyStyle = _extends({}, this.props.bodyStyle);
    var headStyle = {};

    var tableClassName = '';
    if (scroll.x || columns) {
      tableClassName = prefixCls + '-fixed';
      bodyStyle.overflowX = bodyStyle.overflowX || 'auto';
    }

    if (scroll.y) {
      bodyStyle.height = bodyStyle.height || scroll.y;
      bodyStyle.overflowY = bodyStyle.overflowY || 'scroll';
      useFixedHeader = true;

      // Add negative margin bottom for scroll bar overflow bug
      var scrollbarWidth = (0, _utils.measureScrollbar)();
      if (scrollbarWidth > 0) {
        (fixed ? bodyStyle : headStyle).marginBottom = '-' + scrollbarWidth + 'px';
        (fixed ? bodyStyle : headStyle).paddingBottom = '0px';
      }
    }

    var renderTable = function renderTable() {
      var hasHead = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
      var hasBody = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      var tableStyle = {};
      if (!columns && scroll.x) {
        // not set width, then use content fixed width
        if (scroll.x === true) {
          tableStyle.tableLayout = 'fixed';
        } else {
          tableStyle.width = scroll.x;
        }
      }
      return _react2['default'].createElement(
        'table',
        { className: tableClassName, style: tableStyle },
        _this2.getColGroup(columns, fixed),
        hasHead ? _this2.getHeader(columns, fixed) : null,
        hasBody ? _react2['default'].createElement(
          'tbody',
          { className: prefixCls + '-tbody' },
          _this2.getRows(columns, fixed)
        ) : null
      );
    };

    var headTable = undefined;
    if (useFixedHeader) {
      headTable = _react2['default'].createElement(
        'div',
        {
          className: prefixCls + '-header',
          ref: columns ? null : 'headTable',
          style: headStyle,
          onMouseOver: this.detectScrollTarget,
          onTouchStart: this.detectScrollTarget,
          onScroll: this.handleBodyScroll },
        renderTable(true, false)
      );
    }

    var BodyTable = _react2['default'].createElement(
      'div',
      {
        className: prefixCls + '-body',
        style: bodyStyle,
        ref: 'bodyTable',
        onMouseOver: this.detectScrollTarget,
        onTouchStart: this.detectScrollTarget,
        onScroll: this.handleBodyScroll },
      renderTable(!useFixedHeader)
    );

    if (columns && columns.length) {
      var refName = undefined;
      if (columns[0].fixed === 'left' || columns[0].fixed === true) {
        refName = 'fixedColumnsBodyLeft';
      } else if (columns[0].fixed === 'right') {
        refName = 'fixedColumnsBodyRight';
      }
      delete bodyStyle.overflowX;
      delete bodyStyle.overflowY;
      BodyTable = _react2['default'].createElement(
        'div',
        {
          className: prefixCls + '-body-outer',
          style: _extends({}, bodyStyle) },
        _react2['default'].createElement(
          'div',
          {
            className: prefixCls + '-body-inner',
            ref: refName,
            onMouseOver: this.detectScrollTarget,
            onTouchStart: this.detectScrollTarget,
            onScroll: this.handleBodyScroll },
          renderTable(!useFixedHeader)
        )
      );
    }

    return _react2['default'].createElement(
      'span',
      null,
      headTable,
      BodyTable
    );
  },

  getFooter: function getFooter() {
    var _props4 = this.props;
    var footer = _props4.footer;
    var prefixCls = _props4.prefixCls;

    return footer ? _react2['default'].createElement(
      'div',
      { className: prefixCls + '-footer' },
      footer(this.state.data)
    ) : null;
  },

  getMaxColumnsPage: function getMaxColumnsPage() {
    var _props5 = this.props;
    var columnsPageRange = _props5.columnsPageRange;
    var columnsPageSize = _props5.columnsPageSize;

    return Math.ceil((columnsPageRange[1] - columnsPageRange[0] + 1) / columnsPageSize) - 1;
  },

  goToColumnsPage: function goToColumnsPage(currentColumnsPage) {
    var maxColumnsPage = this.getMaxColumnsPage();
    var page = currentColumnsPage;
    if (page < 0) {
      page = 0;
    }
    if (page > maxColumnsPage) {
      page = maxColumnsPage;
    }
    this.setState({
      currentColumnsPage: page
    });
  },

  syncFixedTableRowHeight: function syncFixedTableRowHeight() {
    var _this3 = this;

    var prefixCls = this.props.prefixCls;

    var headRows = this.refs.headTable ? this.refs.headTable.querySelectorAll('tr') : [];
    var bodyRows = this.refs.bodyTable.querySelectorAll('.' + prefixCls + '-row') || [];
    var fixedColumnsHeadRowsHeight = [].map.call(headRows, function (row) {
      return row.getBoundingClientRect().height || 'auto';
    });
    var fixedColumnsBodyRowsHeight = [].map.call(bodyRows, function (row) {
      return row.getBoundingClientRect().height || 'auto';
    });
    if ((0, _shallowequal2['default'])(this.state.fixedColumnsHeadRowsHeight, fixedColumnsHeadRowsHeight) && (0, _shallowequal2['default'])(this.state.fixedColumnsBodyRowsHeight, fixedColumnsBodyRowsHeight)) {
      return;
    }
    this.timer = setTimeout(function () {
      _this3.setState({
        fixedColumnsHeadRowsHeight: fixedColumnsHeadRowsHeight,
        fixedColumnsBodyRowsHeight: fixedColumnsBodyRowsHeight
      });
    });
  },

  prevColumnsPage: function prevColumnsPage() {
    this.goToColumnsPage(this.state.currentColumnsPage - 1);
  },

  nextColumnsPage: function nextColumnsPage() {
    this.goToColumnsPage(this.state.currentColumnsPage + 1);
  },

  wrapPageColumn: function wrapPageColumn(column, hasPrev, hasNext) {
    var prefixCls = this.props.prefixCls;
    var currentColumnsPage = this.state.currentColumnsPage;

    var maxColumnsPage = this.getMaxColumnsPage();
    var prevHandlerCls = prefixCls + '-prev-columns-page';
    if (currentColumnsPage === 0) {
      prevHandlerCls += ' ' + prefixCls + '-prev-columns-page-disabled';
    }
    var prevHandler = _react2['default'].createElement('span', { className: prevHandlerCls, onClick: this.prevColumnsPage });
    var nextHandlerCls = prefixCls + '-next-columns-page';
    if (currentColumnsPage === maxColumnsPage) {
      nextHandlerCls += ' ' + prefixCls + '-next-columns-page-disabled';
    }
    var nextHandler = _react2['default'].createElement('span', { className: nextHandlerCls, onClick: this.nextColumnsPage });
    if (hasPrev) {
      column.title = _react2['default'].createElement(
        'span',
        null,
        prevHandler,
        column.title
      );
      column.className = (column.className || '') + (' ' + prefixCls + '-column-has-prev');
    }
    if (hasNext) {
      column.title = _react2['default'].createElement(
        'span',
        null,
        column.title,
        nextHandler
      );
      column.className = (column.className || '') + (' ' + prefixCls + '-column-has-next');
    }
    return column;
  },

  findExpandedRow: function findExpandedRow(record) {
    var _this4 = this;

    var rows = this.getExpandedRows().filter(function (i) {
      return i === _this4.getRowKey(record);
    });
    return rows[0];
  },

  isRowExpanded: function isRowExpanded(record) {
    return typeof this.findExpandedRow(record) !== 'undefined';
  },

  detectScrollTarget: function detectScrollTarget(e) {
    if (this.scrollTarget !== e.currentTarget) {
      this.scrollTarget = e.currentTarget;
    }
  },

  isAnyColumnsFixed: function isAnyColumnsFixed() {
    if ('isAnyColumnsFixedCache' in this) {
      return this.isAnyColumnsFixedCache;
    }
    this.isAnyColumnsFixedCache = this.getCurrentColumns().some(function (column) {
      return !!column.fixed;
    });
    return this.isAnyColumnsFixedCache;
  },

  isAnyColumnsLeftFixed: function isAnyColumnsLeftFixed() {
    if ('isAnyColumnsLeftFixedCache' in this) {
      return this.isAnyColumnsLeftFixedCache;
    }
    this.isAnyColumnsLeftFixedCache = this.getCurrentColumns().some(function (column) {
      return column.fixed === 'left' || column.fixed === true;
    });
    return this.isAnyColumnsLeftFixedCache;
  },

  isAnyColumnsRightFixed: function isAnyColumnsRightFixed() {
    if ('isAnyColumnsRightFixedCache' in this) {
      return this.isAnyColumnsRightFixedCache;
    }
    this.isAnyColumnsRightFixedCache = this.getCurrentColumns().some(function (column) {
      return column.fixed === 'right';
    });
    return this.isAnyColumnsRightFixedCache;
  },

  handleBodyScroll: function handleBodyScroll(e) {
    // Prevent scrollTop setter trigger onScroll event
    // http://stackoverflow.com/q/1386696
    if (e.target !== this.scrollTarget) {
      return;
    }
    var _props$scroll = this.props.scroll;
    var scroll = _props$scroll === undefined ? {} : _props$scroll;
    var _refs = this.refs;
    var headTable = _refs.headTable;
    var bodyTable = _refs.bodyTable;
    var fixedColumnsBodyLeft = _refs.fixedColumnsBodyLeft;
    var fixedColumnsBodyRight = _refs.fixedColumnsBodyRight;

    if (scroll.x) {
      if (e.target === bodyTable && headTable) {
        headTable.scrollLeft = e.target.scrollLeft;
      } else if (e.target === headTable && bodyTable) {
        bodyTable.scrollLeft = e.target.scrollLeft;
      }
      if (e.target.scrollLeft === 0) {
        this.setState({ scrollPosition: 'left' });
      } else if (e.target.scrollLeft + 1 >= e.target.children[0].getBoundingClientRect().width - e.target.getBoundingClientRect().width) {
        this.setState({ scrollPosition: 'right' });
      } else if (this.state.scrollPosition !== 'middle') {
        this.setState({ scrollPosition: 'middle' });
      }
    }
    if (scroll.y) {
      if (fixedColumnsBodyLeft && e.target !== fixedColumnsBodyLeft) {
        fixedColumnsBodyLeft.scrollTop = e.target.scrollTop;
      }
      if (fixedColumnsBodyRight && e.target !== fixedColumnsBodyRight) {
        fixedColumnsBodyRight.scrollTop = e.target.scrollTop;
      }
      if (bodyTable && e.target !== bodyTable) {
        bodyTable.scrollTop = e.target.scrollTop;
      }
    }
  },

  handleRowHover: function handleRowHover(isHover, key) {
    if (isHover) {
      this.setState({
        currentHoverKey: key
      });
    } else {
      this.setState({
        currentHoverKey: null
      });
    }
  },

  render: function render() {
    var props = this.props;
    var prefixCls = props.prefixCls;

    var className = props.prefixCls;
    if (props.className) {
      className += ' ' + props.className;
    }
    if (props.columnsPageRange) {
      className += ' ' + prefixCls + '-columns-paging';
    }
    if (props.useFixedHeader || props.scroll && props.scroll.y) {
      className += ' ' + prefixCls + '-fixed-header';
    }
    className += ' ' + prefixCls + '-scroll-position-' + this.state.scrollPosition;

    var isTableScroll = this.isAnyColumnsFixed() || props.scroll.x || props.scroll.y;

    return _react2['default'].createElement(
      'div',
      { className: className, style: props.style },
      this.isAnyColumnsLeftFixed() && _react2['default'].createElement(
        'div',
        { className: prefixCls + '-fixed-left' },
        this.getLeftFixedTable()
      ),
      _react2['default'].createElement(
        'div',
        { className: isTableScroll ? prefixCls + '-scroll' : '' },
        this.getTable(),
        this.getFooter()
      ),
      this.isAnyColumnsRightFixed() && _react2['default'].createElement(
        'div',
        { className: prefixCls + '-fixed-right' },
        this.getRightFixedTable()
      )
    );
  }
});

exports['default'] = Table;
module.exports = exports['default'];