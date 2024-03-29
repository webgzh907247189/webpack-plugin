import * as path from 'path';
import { Compiler } from 'webpack';

export = class ErrorWithImportPackage {
    public errorWithImportPackageList: string[] = [];

    constructor(options: string[] | string = []) {
        this.errorWithImportPackageList = Array.isArray(options) ? options : [options];
    }
    apply(compiler: Compiler) {
        const compilerContext = compiler.context;
        const errorWithImportPackageList = this.errorWithImportPackageList;

        if (errorWithImportPackageList.length === 0) return;

        compiler.hooks.emit.tapAsync('ErrorWithImportPackage', (compilation, cb) => {
            compilation.chunks.forEach((chunk) => {
                chunk.getModules().forEach((module) => {
                    // 浅度的 检测引入 npm 包
                    (module?.buildInfo?.fileDependencies ?? []).forEach((filePath: string) => {
                        const relativePath = path.posix.relative(compilerContext, filePath);
                        // console.log(relativePath,  errorWithImportPackageList)

                        errorWithImportPackageList.forEach((itemName) => {
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
