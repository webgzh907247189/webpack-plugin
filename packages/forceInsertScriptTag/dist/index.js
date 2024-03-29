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
        if (!this.options.url) {
            throw new Error('使用ForceInsertScriptTagPlugin 需要配置 静态资源的 url');
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
    ForceInsertScriptTagPlugin.prototype.processTag = function (data) {
        var _a = this.options, url = _a.url, isInsertBody = _a.isInsertBody, isShift = _a.isShift, jsDeferLoad = _a.jsDeferLoad, jsAsyncLoad = _a.jsAsyncLoad;
        var assetsList = isInsertBody ? data.bodyTags : data.headTags;
        var insertTag = {
            tagName: 'script',
            voidTag: false,
            attributes: {
                defer: jsDeferLoad,
                async: jsAsyncLoad,
                src: url,
            },
        };
        if (isShift) {
            assetsList.push(insertTag);
        }
        else {
            assetsList.unshift(insertTag);
        }
        return data;
    };
    ForceInsertScriptTagPlugin.prototype.forceInsert = function (data) {
        var _a = this.options, url = _a.url, isInsertBody = _a.isInsertBody, isShift = _a.isShift, jsDeferLoad = _a.jsDeferLoad, jsAsyncLoad = _a.jsAsyncLoad;
        var strScript = "<script src=\"".concat(url, "\" ").concat(jsDeferLoad ? 'defer' : '', " ").concat(jsAsyncLoad ? 'async' : '', " type=\"text/javascript\"></script>");
        var html = data.html;
        var insertBegExp = isShift ? /(<\/body\s*>)/i : /(<body[^>]*>)/i;
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