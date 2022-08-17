/// <reference types="node" />
import fs from 'fs';
import * as webpack from 'webpack';
export declare type AbstractModule<X> = {
    name: string;
    path: string;
    source: X;
};
export declare const moduleToAbstract: (m: webpack.Module) => {
    name: any;
    source: any;
    path: any;
};
declare type ModuleToSourceOptions = {
    withValue: boolean;
};
export declare function ModuleToSource(m: AbstractModule<string>, options: ModuleToSourceOptions): AbstractModule<[string, string] | [string]>;
export declare function SourceToFile(sourceObject: AbstractModule<[string, string] | [string]>): {
    name: string;
    source: string;
    path: string;
};
export declare function writeToFile(fileObject: AbstractModule<string>, writeFile: (typeof fs.writeFile)): void;
export declare const inspect: <X>(input: X) => X;
export {};
