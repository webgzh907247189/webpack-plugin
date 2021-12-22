import { Compiler, sources } from 'webpack';
import JavaScriptObfuscator, { ObfuscatorOptions } from 'javascript-obfuscator';
import multimatch from 'multimatch';
import { RawSource } from 'webpack-sources';

export default class WebpackObfuscator {
    // 混淆多个文件，请使用此选项。此选项有助于避免这些文件的全局标识符之间的冲突。每个文件的前缀应该不同。
    private static readonly baseIdentifiersPrefix = 'a';
    public obfuscatorFiles: string[] = [];
    public includes: string[] = [];

    constructor(public options: ObfuscatorOptions = {}, includes: string[]) {
        this.options = options;
        this.includes = this.includes.concat(includes || []);
        this.obfuscatorFiles = [];
    }

    apply(compiler: Compiler) {
        const isDevServer = process.argv.find((v) => v.includes('webpack-dev-server'));

        // dev 直接 return
        if (isDevServer) {
            console.info('JavascriptObfuscator is disabled on webpack-dev-server as the reloading scripts ', 'and the obfuscator can interfere with each other and break the build');
            return;
        }

        const pluginName = this.constructor.name;
        compiler.hooks.emit.tap(pluginName, (compilation) => {
            let identifiersPrefixCounter = 0;

            compilation.chunks.forEach((chunk) => {
                chunk.files.forEach((fileName: string) => {
                    // 非js文件直接 return  或者 满足外面传进来的 inlcude 条件
                    if (!fileName.toLowerCase().endsWith('.js') || !this.shouldInclude(fileName)) {
                        return;
                    }

                    const asset = compilation.assets[fileName];
                    this.obfuscatorFiles.push(fileName);
                    // 拿到 source 和 map
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { inputSource, inputSourceMap } = this.extractSourceAndSourceMap(asset);

                    // 拿到加密后的代码和对应的 sourcemap
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { obfuscatedSource, obfuscationSourceMap } = this.obfuscate(inputSource as string, fileName, identifiersPrefixCounter);

                    const assets = compilation.assets;
                    (assets as any)[fileName] = new RawSource(obfuscatedSource);
                    identifiersPrefixCounter++;
                });
            });
        });

        compiler.hooks.done.tap(pluginName, () => {
            console.log('加固的文件是: ', this.obfuscatorFiles);
        });
    }

    shouldInclude(filePath: string) {
        return multimatch(filePath, this.includes).length > 0;
    }

    extractSourceAndSourceMap(asset: sources.Source) {
        if (asset.sourceAndMap) {
            const { source, map } = asset.sourceAndMap();
            return {
                inputSource: source,
                inputSourceMap: map,
            };
        } else {
            return {
                inputSource: asset.source(),
                inputSourceMap: asset.map(),
            };
        }
    }

    obfuscate(javascript: string, fileName: string, identifiersPrefixCounter: number) {
        // 混淆多个文件，请使用此选项。此选项有助于避免这些文件的全局标识符之间的冲突。每个文件的前缀应该不同。
        const obfuscationResult = JavaScriptObfuscator.obfuscate(javascript, {
            identifiersPrefix: `${WebpackObfuscator.baseIdentifiersPrefix}${identifiersPrefixCounter}`,
            sourceMapFileName: fileName + '.map',
            ...this.options,
        });

        return {
            obfuscatedSource: obfuscationResult.getObfuscatedCode(),
            obfuscationSourceMap: obfuscationResult.getSourceMap(),
        };
    }
}
