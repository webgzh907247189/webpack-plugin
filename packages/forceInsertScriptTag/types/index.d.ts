import type { Compiler } from 'webpack';
import HtmlWebpackPlugin, { HtmlTagObject } from 'html-webpack-plugin';
/**
 * 该插件为 插入 script 标签到 .html 文件
 * 如果 html-webpack-plugin 的 inject: true， 直接 根据参数 isInsertBody 决定插入到 head 还是 body 里面，
 *      在 head | body 里面根据参数 isShift 决定是 前置插入还是后置插入
 *  nuxt2 csr 模式  html-webpack-plugin 的 inject 是 true 会触发上述情况
 *
 *
 * 如果 html-webpack-plugin 的 inject: false，只会插入在body 里面，但是可以根据参数 isShift 决定是 在body进行 前置插入还是后置插入
 * nuxt2 ssr 模式  html-webpack-plugin 的 inject 是 false， 会触发上述情况
 */
type TypePartForceInsertScript = Record<'isInsertBody' | 'isShift' | 'jsDeferLoad' | 'jsAsyncLoad', boolean>;
type TypeDefaultForceInsertScript = Partial<TypePartForceInsertScript> & {
    url?: string;
    innerHTML?: string;
    isLaunchIdeJs?: boolean;
};
type TypeForceInsertScript = TypePartForceInsertScript & {
    url?: string;
    innerHTML?: string;
    isLaunchIdeJs?: boolean;
};
type TypeAfterTemplateExecutionData = {
    html: string;
    headTags: HtmlTagObject[];
    bodyTags: HtmlTagObject[];
    outputName: string;
    plugin: HtmlWebpackPlugin;
};
declare const _default: {
    new (defaultOptions: TypeDefaultForceInsertScript): {
        defaultPluginOptions: TypePartForceInsertScript;
        options: TypeForceInsertScript;
        defaultOptions: TypeDefaultForceInsertScript;
        apply(compiler: Compiler): void;
        getInnerHTMLVal(): string | undefined;
        processTag(data: TypeAfterTemplateExecutionData): TypeAfterTemplateExecutionData;
        forceInsert(data: TypeAfterTemplateExecutionData): TypeAfterTemplateExecutionData;
    };
};
export = _default;
