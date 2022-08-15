import webpack from 'webpack';
import fs from 'fs';
import { moduleToAbstract, ModuleToSource, SourceToFile, writeToFile } from './utils';


type CssLoaderTypesExtractorOptions = {
  writeFunction: (typeof fs.writeFile)
};

/* eslint-disable class-methods-use-this */

export default class CssLoaderTypesExtractor {
  #pluginName = 'CssLoaderTypesExtractor';

  #writeFuction = fs.writeFile;

  #modules = [];

  constructor(options?: CssLoaderTypesExtractorOptions) {
    this.#writeFuction = options?.writeFunction || fs.writeFile;
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.thisCompilation.tap(this.#pluginName, (compilation) => {
      compilation.hooks.succeedModule.tap(this.#pluginName, (m) => {
        const { resource, loaders } = m;
        if (/\.css/.test(resource) && !(/node_module/.test(resource)) && (loaders.length > 0)) {
          this.#modules.push(m);
        }
      });
    });

    compiler.hooks.afterDone.tap(
      this.#pluginName,
      () => {
        this.#modules
          .map(moduleToAbstract)
          .map(ModuleToSource)
          .map(SourceToFile)
          .map(file => writeToFile(file, this.#writeFuction));
        // clear modules.
        this.#modules = [];
      },
    );
  }
}
