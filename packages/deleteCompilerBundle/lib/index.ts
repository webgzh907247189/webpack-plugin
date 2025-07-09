import * as path from 'path';
import * as fs from 'fs';
import { Compiler, Stats } from 'webpack';

type Options = {
    deleteFolderList: string[];
};

export = class DeleteCompilerBundle {
    public defaultOptions = {
        deleteFolderList: [],
    };

    public options = {} as Options;

    constructor(public defaultPluginOptions: Options) {
        this.options = {
            ...this.defaultOptions,
            ...defaultPluginOptions,
        };
    }
    apply(compile: Compiler) {
        compile.hooks.done.tapAsync('DeleteCompilerBundlePlugin', (stats: Stats, cb: () => void) => {
            const isDevServer = process.argv.find((v) => v.includes('webpack-dev-server'));
            // dev 直接 return
            if (isDevServer) {
                console.info('dev 环境不做删除文件处理');
                return;
            }

            this.options.deleteFolderList.forEach((itemFolder) => {
                const folderPath = path.join(stats.compilation.compiler.outputPath, itemFolder);

                const isExits = fs.existsSync(folderPath);
                if (isExits) {
                    // 判断是不是文件夹
                    try {
                        const fileStats = fs.statSync(folderPath);

                        // 文件夹删除
                        if (fileStats.isDirectory()) {
                            if (fs.existsSync(folderPath)) {
                                try {
                                    fs.rmSync(folderPath, { recursive: true, force: true });

                                    console.log(`\x1b[42;30m  删除文件夹成功: ${folderPath} \x1b[0m`);
                                } catch (error) {
                                    console.log(`\x1b[41;30m 删除文件夹失败 ----> ${folderPath}  \x1b[0m`);
                                }
                            }
                        } else {
                            // 文件删除
                            const sourcePath = path.join(stats.compilation.compiler.outputPath, itemFolder);
                            try {
                                fs.unlinkSync(sourcePath);
                                console.log(`\x1b[42;30m  删除文件夹成功: ${sourcePath} \x1b[0m`);
                            } catch {
                                console.log(`\x1b[41;30m 删除文件失败 ----> ${sourcePath}  \x1b[0m`);
                            }
                        }
                    } catch {
                        console.log(`\x1b[41;30m  执行异常  \x1b[0m`);
                    }
                }
            });

            cb();
        });
    }
};
