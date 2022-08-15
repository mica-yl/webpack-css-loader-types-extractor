/// <reference types="node" />
import fs from 'fs';
import * as webpack from 'webpack';
export declare type AbstractModule = {
    name: string;
    path: string;
    source: string;
};
export declare const moduleToAbstract: (m: webpack.Module) => {
    name: any;
    source: any;
    path: any;
};
export declare function ModuleToSource(m: AbstractModule): {
    name: string;
    source: any;
    path: string;
};
export declare function SourceToFile(sourceObject: AbstractModule): {
    name: string;
    source: string;
    path: string;
};
export declare function writeToFile(fileObject: AbstractModule, writeFile: (typeof fs.writeFile)): void;
