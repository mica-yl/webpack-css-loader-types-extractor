/// <reference types="node" />
import webpack from 'webpack';
import fs from 'fs';
declare type CssLoaderTypesExtractorOptions = {
    writeFunction: (typeof fs.writeFile);
};
export default class CssLoaderTypesExtractor {
    #private;
    constructor(options?: CssLoaderTypesExtractorOptions);
    apply(compiler: webpack.Compiler): void;
}
export {};
