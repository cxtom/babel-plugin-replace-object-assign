'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (_ref) {
    var t = _ref.types;

    return {
        visitor: {
            Program: {
                enter: function enter(path, _ref2) {
                    var file = _ref2.file;

                    file.set(OBJECT_ASSIGN, false);
                },
                exit: function exit(path, _ref3) {
                    var file = _ref3.file,
                        opts = _ref3.opts;

                    if (!file.get(OBJECT_ASSIGN)) {
                        return;
                    }

                    var node = buildExtend({
                        EXTENDNAME: file.get(OBJECT_ASSIGN)
                    });

                    path.node.body.unshift(node);
                }
            },

            CallExpression: function CallExpression(path, _ref4) {
                var file = _ref4.file;

                if (path.get('callee').matchesPattern('Object.assign')) {

                    if (!file.get(OBJECT_ASSIGN)) {
                        file.set(OBJECT_ASSIGN, path.scope.generateUidIdentifier('objectAssign'));
                    }

                    path.node.callee = file.get(OBJECT_ASSIGN);
                }
            }
        }
    };
};

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OBJECT_ASSIGN = 'ObjectAssignReplacer'; /**
                                             * @file object assign replace plugin
                                             * @author cxtom <cxtom2008@gmail.com>
                                             */

var buildExtend = (0, _babelTemplate2.default)('\nvar EXTENDNAME = function (target) {\n  for (var i = 1; i < arguments.length; i++) {\n    var source = arguments[i];\n    for (var key in source) {\n      if (Object.prototype.hasOwnProperty.call(source, key)) {\n        target[key] = source[key];\n      }\n    }\n  }\n  return target;\n};\n');