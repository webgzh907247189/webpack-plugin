import type { Compiler } from 'webpack';
/**
 * 该插件为 插入 script 标签到 .html 文件
 * 根据参数 isInsertBody 决定插入到 head 还是 body 里面，
 *      在 head | body 里面根据参数 isShift 决定是 前置插入还是后置插入
 *
 * 在body 里面，但是可以根据参数 isShift 决定是 在body进行 前置插入还是后置插入
 */
type TypePartAddScript = Record<'isInsertBody' | 'isShift' | 'jsDeferLoad' | 'jsAsyncLoad', boolean>;
type TypeDefaultAddScript = Partial<TypePartAddScript> & {
    url?: string;
    innerHTML?: string;
    isLaunchIdeJs?: boolean;
    ideName?: string;
};
type TypeForceInsertScript = TypePartAddScript & {
    url?: string;
    innerHTML?: string;
    isLaunchIdeJs?: boolean;
    ideName?: string;
};
declare const _default: {
    new (defaultOptions: TypeDefaultAddScript): {
        defaultPluginOptions: TypePartAddScript;
        options: TypeForceInsertScript;
        defaultOptions: TypeDefaultAddScript;
        apply(compiler: Compiler): void;
        processTag(html: string): string;
        getInsertScriptVal(): string | undefined;
    };
};
export = _default;
