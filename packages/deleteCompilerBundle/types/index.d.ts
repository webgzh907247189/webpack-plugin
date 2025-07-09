import { Compiler } from 'webpack';
type Options = {
    deleteFolderList: string[];
};
declare const _default: {
    new (defaultPluginOptions: Options): {
        defaultOptions: {
            deleteFolderList: never[];
        };
        options: Options;
        defaultPluginOptions: Options;
        apply(compile: Compiler): void;
    };
};
export = _default;
