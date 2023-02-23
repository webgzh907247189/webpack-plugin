"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var path = __importStar(require("path"));
module.exports = /** @class */ (function () {
    function ErrorWithImportPackage(options) {
        if (options === void 0) { options = []; }
        this.errorWithImportPackageList = [];
        this.errorWithImportPackageList = Array.isArray(options) ? options : [options];
    }
    ErrorWithImportPackage.prototype.apply = function (compiler) {
        var compilerContext = compiler.context;
        var errorWithImportPackageList = this.errorWithImportPackageList;
        if (errorWithImportPackageList.length === 0)
            return;
        compiler.hooks.emit.tapAsync('ErrorWithPackage', function (compilation, cb) {
            compilation.chunks.forEach(function (chunk) {
                chunk.getModules().forEach(function (module) {
                    var _a, _b;
                    // 浅度的 检测引入 npm 包
                    ((_b = (_a = module === null || module === void 0 ? void 0 : module.buildInfo) === null || _a === void 0 ? void 0 : _a.fileDependencies) !== null && _b !== void 0 ? _b : []).forEach(function (filePath) {
                        var relativePath = path.posix.relative(compilerContext, filePath);
                        // console.log(relativePath,  errorWithImportPackageList)
                        errorWithImportPackageList.forEach(function (itemName) {
                            var importPackageName = path.posix.join('node_modules', itemName);
                            if (relativePath.includes(importPackageName)) {
                                console.log("\u001B[41;30m \u5F15\u5165\u975E\u6CD5npm\u5305\u4E86: errow with import ".concat(itemName, "  \u001B[0m"));
                                process.exit(1);
                            }
                        });
                    });
                });
            });
            cb();
        });
    };
    return ErrorWithImportPackage;
}());
//# sourceMappingURL=index.js.map