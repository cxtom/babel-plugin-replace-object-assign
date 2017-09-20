## babel-plugin-replace-object-assign

Replaces `Object.assign` with a polyfill.

Also, this plugin will import an external package in files where `Object.assign` is used rather than redeclaring the function in each file (which should help reduce bundle size). This is ultimately what [babel-plugin-transform-runtime](https://www.npmjs.com/package/babel-plugin-transform-runtime) does for you when using the `_extends` helper.

The implementation you configure is specified as a npm package dependency.

---

#### ⚠️ Important note on the use of this project:
Most likely you do not and should not use this plugin! I initially wrote this plugin due to a [bug](https://bugs.chromium.org/p/v8/issues/detail?id=4118) in Chrome where key order was not gaurenteed to be correct for objects mutated with `Object.assign` (the issue is also described at [sindresorhus/object-assign#22](https://github.com/sindresorhus/object-assign/issues/22)).

While the bug did not cause problems for most projects, it did causes problems for a project I was helping maintain ([Material-UI](https://github.com/callemall/material-ui)). We heavily used `Object.assign` to merge style definitions that were defined in javascript objects. Since key order is important when defining CSS style rules, the `Object.assign` implementation built into Chrome caused many style related bugs. This plugin allowed us to completely replace all uses of `Object.assign` within our source code with an implementation that did not break in Chrome (with the expectation that we would stop using this plugin when the bug was fixed and rolled out to a majority of Chrome users).

The bug in Chrome has been fixed for quite some time now (it was fixed in Chrome 49), so this plugin is no longer necessary for the purpose it was originally created for. We have also stopped using this plugin for Material-UI. Please **carefully** consider the necessity and implications of replacing all of your `Object.assign` calls before using this plugin. If you are not sure if you need this, feel free to open an issue to discuss it.

---

### Usage

#### Installation

```sh
# Install the plugin
$ npm install babel-plugin-replace-object-assign
```

#### Configure


**.babelrc**

```json
{
  "plugins": [
    ["replace-object-assign"]
  ]
}
```

#### Result

**In**

```js
Object.assign(a, b);
```

**Out**

```js
var _objectAssign2 = function(target) {
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

_objectAssign(a, b)

```
