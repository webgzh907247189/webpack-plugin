import * as path from 'path';
import { Compiler } from 'webpack';

export = class ErrorWithImportPackage {
    public errorWithImportPackageList: string[] = [];

    constructor(options = []) {
        this.errorWithImportPackageList = Array.isArray(options) ? options : [options];
    }
    apply(compiler: Compiler) {
        const compilerContext = compiler.context;
        compiler.hooks.emit.tapAsync('ErrorWithPackage', (compilation, cb) => {
            compilation.chunks.forEach((chunk) => {

                chunk.getModules().forEach((module) => {
                    // 浅度的 检测引入 npm 包
                    (module?.buildInfo?.fileDependencies ?? []).forEach((filePath: string) => {
                        const relativePath = path.posix.relative(compilerContext, filePath);
                        // console.log(relativePath,  this.errorWithImportPackageList)

                        this.errorWithImportPackageList.forEach((itemName) => {
                            const importPackageName = path.posix.join('node_modules', itemName);

                            if (relativePath.includes(importPackageName)) {
                                console.log(`\x1B[41;30m 引入非法npm包了: errow with import ${itemName}  \x1B[0m`);
                                process.exit(1);
                            }
                        });
                    });
                });
            });

            cb();
        });
    }
};
