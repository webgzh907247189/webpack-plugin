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

            this.options.deleteFolderList.forEach((folder) => {
                const folderPath = path.join(stats.compilation.compiler.outputPath, folder);

                // 判断是不是文件夹
                const fileStats = fs.statSync(folderPath);

                // 文件夹删除
                if (fileStats.isDirectory()) {
                    if (fs.existsSync(folderPath)) {
                        try {
                            fs.rmSync(folderPath, { recursive: true, force: true });
                        } catch (error) {
                            console.warn('删除文件夹失败 ----->', folderPath);
                        }
                    }
                } else {
                    // 文件删除
                    const sourcePath = path.join(stats.compilation.compiler.outputPath, folder);
                    try {
                        fs.unlinkSync(sourcePath);
                    } catch {
                        console.warn('删除文件失败 ----->', sourcePath);
                    }
                }
            });

            cb();
        });
    }
};
