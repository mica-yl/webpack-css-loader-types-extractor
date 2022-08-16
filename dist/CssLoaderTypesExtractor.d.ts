/// <reference types="node" />
import webpack from 'webpack';
import fs from 'fs';
declare type CssLoaderTypesExtractorOptions = {
    /**
     * using custom `writeFile` instead of `fs.writeFile`
     */
    writeFunction: (typeof fs.writeFile);
    /**
     * log into inspector when using `node --inspect`
     */
    debug: boolean;
};
export default class CssLoaderTypesExtractor {
    #private;
    constructor(options?: CssLoaderTypesExtractorOptions);
    apply(compiler: webpack.Compiler): void;
}
export {};
