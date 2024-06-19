import type { Compiler } from 'webpack';
import HtmlWebpackPlugin, { HtmlTagObject } from 'html-webpack-plugin';
import { launchIDEConfig } from 'cus-utils';

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
    ideName?: string;
};
type TypeForceInsertScript = TypePartForceInsertScript & { url?: string; innerHTML?: string; isLaunchIdeJs?: boolean; ideName?: string };

type TypeAfterTemplateExecutionData = {
    html: string
    headTags: HtmlTagObject[]
    bodyTags: HtmlTagObject[]
    outputName: string;
    plugin: HtmlWebpackPlugin
};

export = class ForceInsertScriptTagPlugin {
    public defaultPluginOptions: TypePartForceInsertScript = {
        isInsertBody: true,
        isShift: true,
        jsDeferLoad: false,
        jsAsyncLoad: false,
    };
    public options = {} as TypeForceInsertScript;

    constructor(public defaultOptions: TypeDefaultForceInsertScript) {
        // 如果 html-webpack-plugin inject 为 false, 只能插入在 body里，不能插入在 head里
        // 默认插入在 bodyTags 上

        // 默认后置插入
        // 默认 defer 为 false
        this.options = {
            ...this.defaultPluginOptions,
            ...defaultOptions,
        };
    }

    apply(compiler: Compiler) {
        if (!this.options.isLaunchIdeJs) {
            if (!this.options.url && !this.options.innerHTML) {
                throw new Error('\x1B[41;30m 使用ForceInsertScriptTagPlugin 需要配置 静态资源的 url 或者 标签内容  \x1B[0m');
            }

            if (this.options.url && this.options.innerHTML) {
                throw new Error('\x1B[41;30m 使用ForceInsertScriptTagPlugin 不可以同时配置 innerHTML 和 url \x1B[0m');
            }
        }

        compiler.hooks.compilation.tap('ForceInsertScriptTagPlugin', (compilation) => {
            HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync('cusPlugin', (data, cb) => {
                const htmlWebpackPluginOptions = (data.plugin as any).options;
                const { inject } = htmlWebpackPluginOptions;

                const newData = inject ? this.processTag(data) : this.forceInsert(data);

                cb(null, newData);
            });
        });
    }
    getInnerHTMLVal() {
        const { innerHTML, isLaunchIdeJs, ideName = 'vscode' } = this.options;
        return isLaunchIdeJs ? launchIDEConfig(ideName) : innerHTML;
    }

    processTag(data: TypeAfterTemplateExecutionData) {
        const { url, isInsertBody, isShift, jsDeferLoad, jsAsyncLoad } = this.options;

        const assetsList = isInsertBody ? data.bodyTags : data.headTags;

        const innerHTMLVal = this.getInnerHTMLVal();
        const insertTag = {
            tagName: 'script',
            voidTag: false, // script 标签需要闭合， link 无需结束标签
            attributes: {
                defer: jsDeferLoad,
                async: jsAsyncLoad,
                src: url,
            },
            innerHTML: innerHTMLVal,
        };
        if (isShift) {
            assetsList.unshift(insertTag as unknown as HtmlTagObject);
        } else {
            assetsList.push(insertTag as unknown as HtmlTagObject);
        }
        return data;
    }

    forceInsert(data: TypeAfterTemplateExecutionData) {
        const innerHTMLVal = this.getInnerHTMLVal();
        const { url, isShift, jsDeferLoad, jsAsyncLoad } = this.options;

        const strScript = `<script ${url ? `src="${url}"` : ''} ${jsDeferLoad ? 'defer' : ''} ${jsAsyncLoad ? 'async' : ''} type="text/javascript">
            ${innerHTMLVal ? innerHTMLVal : ''}
        </script>`;

        let html = data.html;
        const insertBegExp = isShift ? /(<body[^>]*>)/i : /(<\/body\s*>)/i;
        const cb = isShift ? (match: string) => strScript + match : (match: string) => match + strScript;

        if (insertBegExp.test(html)) {
            html = html.replace(insertBegExp, cb);
        }

        data.html = html;
        return data;
    }
};
