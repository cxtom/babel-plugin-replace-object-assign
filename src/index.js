/**
 * @file object assign replace plugin
 * @author cxtom <cxtom2008@gmail.com>
 */

import template from 'babel-template';

const OBJECT_ASSIGN = 'ObjectAssignReplacer';

const buildExtend = template(`
var EXTENDNAME = function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};
`);

export default function ({
    types: t
}) {
    return {
        visitor: {
            Program: {
                enter(path, {
                    file
                }) {
                    file.set(OBJECT_ASSIGN, false);
                },

                exit(path, {
                    file,
                    opts
                }) {
                    if (!file.get(OBJECT_ASSIGN)) {
                        return;
                    }

                    const node = buildExtend({
                        EXTENDNAME: file.get(OBJECT_ASSIGN)
                    });

                    path.node.body.unshift(node);
                }
            },

            CallExpression(path, {
                file
            }) {
                if (path.get('callee').matchesPattern('Object.assign')) {

                    if (!file.get(OBJECT_ASSIGN)) {
                        file.set(OBJECT_ASSIGN, path.scope.generateUidIdentifier('objectAssign'));
                    }

                    path.node.callee = file.get(OBJECT_ASSIGN);
                }
            }
        }
    };
}
