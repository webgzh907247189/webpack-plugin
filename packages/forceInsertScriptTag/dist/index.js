"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
var cus_utils_1 = require("cus-utils");
module.exports = /** @class */ (function () {
    function ForceInsertScriptTagPlugin(defaultOptions) {
        // 如果 html-webpack-plugin inject 为 false, 只能插入在 body里，不能插入在 head里
        // 默认插入在 bodyTags 上
        this.defaultOptions = defaultOptions;
        this.defaultPluginOptions = {
            isInsertBody: true,
            isShift: true,
            jsDeferLoad: false,
            jsAsyncLoad: false,
        };
        this.options = {};
        // 默认后置插入
        // 默认 defer 为 false
        this.options = __assign(__assign({}, this.defaultPluginOptions), defaultOptions);
    }
    ForceInsertScriptTagPlugin.prototype.apply = function (compiler) {
        var _this = this;
        if (this.options.isLaunchIdeJs) {
            if (this.options.url && this.options.innerHTML) {
                throw new Error('\x1B[41;30m 使用 isLaunchIdeJs 功能, 不可以配置 innerHTML 和 url \x1B[0m');
            }
            if (this.options.url) {
                throw new Error('\x1B[41;30m 使用 isLaunchIdeJs 功能, 不可以配置 url \x1B[0m');
            }
            if (this.options.innerHTML) {
                throw new Error('\x1B[41;30m 使用 isLaunchIdeJs 功能, 不可以配置 innerHTML \x1B[0m');
            }
        }
        else {
            if (!this.options.url && !this.options.innerHTML) {
                throw new Error('\x1B[41;30m 使用 ForceInsertScriptTagPlugin 需要配置 静态资源的 url 或者 标签内容  \x1B[0m');
            }
            if (this.options.url && this.options.innerHTML) {
                throw new Error('\x1B[41;30m 使用 ForceInsertScriptTagPlugin 不可以同时配置 innerHTML 和 url \x1B[0m');
            }
        }
        compiler.hooks.compilation.tap('ForceInsertScriptTagPlugin', function (compilation) {
            html_webpack_plugin_1.default.getHooks(compilation).afterTemplateExecution.tapAsync('cusPlugin', function (data, cb) {
                var htmlWebpackPluginOptions = data.plugin.options;
                var inject = htmlWebpackPluginOptions.inject;
                var newData = inject ? _this.processTag(data) : _this.forceInsert(data);
                cb(null, newData);
            });
        });
    };
    ForceInsertScriptTagPlugin.prototype.getInnerHTMLVal = function () {
        var _a = this.options, innerHTML = _a.innerHTML, isLaunchIdeJs = _a.isLaunchIdeJs, _b = _a.ideName, ideName = _b === void 0 ? 'vscode' : _b;
        return isLaunchIdeJs ? (0, cus_utils_1.launchIDEConfig)(ideName) : innerHTML;
    };
    ForceInsertScriptTagPlugin.prototype.processTag = function (data) {
        var _a = this.options, url = _a.url, isInsertBody = _a.isInsertBody, isShift = _a.isShift, jsDeferLoad = _a.jsDeferLoad, jsAsyncLoad = _a.jsAsyncLoad;
        var assetsList = isInsertBody ? data.bodyTags : data.headTags;
        var innerHTMLVal = this.getInnerHTMLVal();
        var insertTag = {
            tagName: 'script',
            voidTag: false,
            attributes: {
                defer: jsDeferLoad,
                async: jsAsyncLoad,
                src: url,
            },
            innerHTML: innerHTMLVal,
        };
        if (isShift) {
            assetsList.unshift(insertTag);
        }
        else {
            assetsList.push(insertTag);
        }
        return data;
    };
    ForceInsertScriptTagPlugin.prototype.forceInsert = function (data) {
        var innerHTMLVal = this.getInnerHTMLVal();
        var _a = this.options, url = _a.url, isShift = _a.isShift, jsDeferLoad = _a.jsDeferLoad, jsAsyncLoad = _a.jsAsyncLoad;
        var strScript = "<script ".concat(url ? "src=\"".concat(url, "\"") : '', " ").concat(jsDeferLoad ? 'defer' : '', " ").concat(jsAsyncLoad ? 'async' : '', " type=\"text/javascript\">\n            ").concat(innerHTMLVal ? innerHTMLVal : '', "\n        </script>");
        var html = data.html;
        var insertBegExp = isShift ? /(<body[^>]*>)/i : /(<\/body\s*>)/i;
        var cb = isShift ? function (match) { return strScript + match; } : function (match) { return match + strScript; };
        if (insertBegExp.test(html)) {
            html = html.replace(insertBegExp, cb);
        }
        data.html = html;
        return data;
    };
    return ForceInsertScriptTagPlugin;
}());
//# sourceMappingURL=index.js.map