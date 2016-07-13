'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (defaultLibraryName) {
  return function (_ref) {
    var types = _ref.types;

    var specified = void 0;
    var libraryObjs = void 0;
    var selectedMethods = void 0;

    function camel2Dash(_str) {
      var str = _str[0].toLowerCase() + _str.substr(1);
      return str.replace(/([A-Z])/g, function camel2DashReplace($1) {
        return '-' + $1.toLowerCase();
      });
    }

    function importMethod(methodName, file, opts) {
      if (!selectedMethods[methodName]) {
        var _opts$libDir = opts.libDir;
        var libDir = _opts$libDir === undefined ? 'lib' : _opts$libDir;
        var _opts$libraryName = opts.libraryName;
        var libraryName = _opts$libraryName === undefined ? defaultLibraryName : _opts$libraryName;
        var style = opts.style;

        var path = libraryName + '/' + libDir + '/' + camel2Dash(methodName);
        selectedMethods[methodName] = file.addImport(path, 'default');
        if (style === true) {
          file.addImport(path + '/style');
        } else if (style === 'css') {
          file.addImport(path + '/style/css');
        }
      }
      return selectedMethods[methodName];
    }

    function buildExpressionHandler(node, props, path, opts) {
      var file = path.hub.file;

      props.forEach(function (prop) {
        if (!types.isIdentifier(node[prop])) return;
        if (specified[node[prop].name]) {
          node[prop] = importMethod(node[prop].name, file, opts);
        }
      });
    }

    function buildDeclaratorHandler(node, prop, path, opts) {
      var file = path.hub.file;

      if (!types.isIdentifier(node[prop])) return;
      if (specified[node[prop].name]) {
        node[prop] = importMethod(node[prop].name, file, opts);
      }
    }

    return {
      visitor: {
        Program: function Program() {
          specified = Object.create(null);
          libraryObjs = Object.create(null);
          selectedMethods = Object.create(null);
        },
        ImportDeclaration: function ImportDeclaration(path, _ref2) {
          var opts = _ref2.opts;
          var node = path.node;
          var value = node.source.value;
          var _opts$libraryName2 = opts.libraryName;
          var libraryName = _opts$libraryName2 === undefined ? defaultLibraryName : _opts$libraryName2;

          if (value === libraryName) {
            node.specifiers.forEach(function (spec) {
              if (types.isImportSpecifier(spec)) {
                specified[spec.local.name] = spec.imported.name;
              } else {
                libraryObjs[spec.local.name] = true;
              }
            });
            path.remove();
          }
        },
        CallExpression: function CallExpression(path, _ref3) {
          var opts = _ref3.opts;
          var node = path.node;
          var file = path.hub.file;
          var _node$callee = node.callee;
          var name = _node$callee.name;
          var object = _node$callee.object;
          var property = _node$callee.property;


          if (types.isIdentifier(node.callee)) {
            if (specified[name]) {
              node.callee = importMethod(specified[name], file, opts);
            }
          } else {
            // React.createElement(Button) -> React.createElement(_Button)
            // if (object && object.name === 'React' && property && property.name === 'createElement' && node.arguments) {
            node.arguments = node.arguments.map(function (arg) {
              var argName = arg.name;

              if (specified[argName]) {
                return importMethod(specified[argName], file, opts);
              }
              return arg;
            });
            // }
          }
        },
        MemberExpression: function MemberExpression(path, _ref4) {
          var opts = _ref4.opts;
          var node = path.node;
          var file = path.hub.file;


          if (libraryObjs[node.object.name]) {
            // antd.Button -> _Button
            path.replaceWith(importMethod(node.property.name, file, opts));
          } else if (specified[node.object.name]) {
            node.object = importMethod(node.object.name, file, opts);
          }
        },
        Property: function Property(path, _ref5) {
          var opts = _ref5.opts;
          var node = path.node;

          buildDeclaratorHandler(node, 'value', path, opts);
        },
        VariableDeclarator: function VariableDeclarator(path, _ref6) {
          var opts = _ref6.opts;
          var node = path.node;

          buildDeclaratorHandler(node, 'init', path, opts);
        },
        LogicalExpression: function LogicalExpression(path, _ref7) {
          var opts = _ref7.opts;
          var node = path.node;

          buildExpressionHandler(node, ['left', 'right'], path, opts);
        },
        ConditionalExpression: function ConditionalExpression(path, _ref8) {
          var opts = _ref8.opts;
          var node = path.node;

          buildExpressionHandler(node, ['test', 'consequent', 'alternate'], path, opts);
        },
        IfStatement: function IfStatement(path, _ref9) {
          var opts = _ref9.opts;
          var node = path.node;

          buildExpressionHandler(node, ['test'], path, opts);
          buildExpressionHandler(node.test, ['left', 'right'], path, opts);
        }
      }
    };
  };
};

module.exports = exports['default'];