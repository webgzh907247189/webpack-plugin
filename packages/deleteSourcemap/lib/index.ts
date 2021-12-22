import * as path from 'path';
import * as fs from 'fs';
import { Compiler, Stats } from 'webpack';

export default class DeleteSourcemap {
    apply(compile: Compiler) {
        compile.hooks.done.tapAsync('SentryPlugin', (stats: Stats, cb: () => void) => {
            const regexp = /.+\.js.map$/;
            const assets = stats.compilation.assets;

            Object.keys(assets)
                .filter((_) => regexp.test(_))
                .forEach((item) => {
                    const sourcePath = path.join(stats.compilation.compiler.outputPath, item);
                    if (sourcePath) {
                        fs.unlinkSync(sourcePath);
                    }
                });
            cb();
        });
    }
}
