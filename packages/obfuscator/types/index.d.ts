/// <reference types="node" />
import { Compiler, sources } from 'webpack';
import { ObfuscatorOptions } from 'javascript-obfuscator';
type TypeSourceAndSourceMap = {
    inputSource: string | Buffer;
    inputSourceMap: Object;
};
declare class WebpackObfuscator {
    options: ObfuscatorOptions;
    private static readonly baseIdentifiersPrefix;
    obfuscatorFiles: string[];
    includes: string[];
    constructor(options: ObfuscatorOptions, includes: string[]);
    apply(compiler: Compiler): void;
    shouldInclude(filePath: string): boolean;
    extractSourceAndSourceMap(asset: sources.Source): TypeSourceAndSourceMap;
    obfuscate(javascript: string, fileName: string, identifiersPrefixCounter: number): {
        obfuscatedSource: string;
        obfuscationSourceMap: string;
    };
}
export = WebpackObfuscator;
