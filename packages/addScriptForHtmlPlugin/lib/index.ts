import type { Compiler, sources } from 'webpack';
import { RawSource } from 'webpack-sources';
import { launchIDEConfig } from 'cus-utils';

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
type TypeForceInsertScript = TypePartAddScript & { url?: string; innerHTML?: string; isLaunchIdeJs?: boolean; ideName?: string };

export = class ForceInsertScriptTagPlugin {
    public defaultPluginOptions: TypePartAddScript = {
        isInsertBody: true,
        isShift: true,
        jsDeferLoad: false,
        jsAsyncLoad: false,
    };
    public options = {} as TypeForceInsertScript;

    constructor(public defaultOptions: TypeDefaultAddScript) {
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
        if (this.options.isLaunchIdeJs) {
            if (this.options.url && this.options.innerHTML) {
                throw new Error('\x1B[41;30m 使用 isLaunchIdeJs 功能, 不可以配置 innerHTML 和 url \x1B[0m');
            }

            if (this.options.url) {
                throw new Error('\x1B[41;30m 使用 isLaunchIdeJs 功能, 不可以配置 url \x1B[0m');
            }

            if (this.options.innerHTML) {
                throw new Error('\x1B[41;30m 使用 isLaunchIdeJs 功能, 不可以配置 innerHTML \x1B[0m');
            }
        } else {
            if (!this.options.url && !this.options.innerHTML) {
                throw new Error('\x1B[41;30m 使用 addScripForHtmlPlugin 需要配置 静态资源的 url 或者 标签内容  \x1B[0m');
            }

            if (this.options.url && this.options.innerHTML) {
                throw new Error('\x1B[41;30m 使用 addScripForHtmlPlugin 不可以同时配置 innerHTML 和 url \x1B[0m');
            }
        }

        compiler.hooks.emit.tap('addScripForHtmlPlugin', (compilation) => {
            const keys = Object.keys(compilation.assets);

            const containerHtml = keys.filter((key) => key.endsWith('.html'));

            for (const iteratorHtml of containerHtml) {
                const matchHtml = compilation.assets[iteratorHtml].source();

                const newHtml = this.processTag(matchHtml as string);

                compilation.assets[iteratorHtml] = new RawSource(newHtml) as any as sources.RawSource;
            }
        });
    }
    processTag(html: string) {
        const insertScriptVal = this.getInsertScriptVal();
        const { url, isShift, isInsertBody, jsDeferLoad, jsAsyncLoad } = this.options;

        const strScript = `<script ${url ? `src="${url}"` : ''} ${jsDeferLoad ? 'defer' : ''} ${jsAsyncLoad ? 'async' : ''} type="text/javascript">
        ${insertScriptVal ? insertScriptVal : ''}
    </script>`;

        let insertBegExp = isShift ? /<body>/ : /<\/body>/;
        if (!isInsertBody) {
            insertBegExp = isShift ? /<head>/i : /<\/head>/i;
        }
        const cb = isShift
            ? (match: string) => {
                  const r = match + strScript;
                  return r;
              }
            : (match: string) => {
                  const r = strScript + match;
                  return r;
              };

        if (insertBegExp.test(html)) {
            html = html.replace(insertBegExp, cb);
        }
        return html;
    }
    getInsertScriptVal() {
        const { innerHTML, isLaunchIdeJs, ideName = 'vscode' } = this.options;
        return isLaunchIdeJs ? launchIDEConfig(ideName) : innerHTML;
    }
};
