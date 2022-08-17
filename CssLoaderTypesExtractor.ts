import webpack from 'webpack';
import fs from 'fs';
import { inspect, moduleToAbstract, ModuleToSource, SourceToFile, writeToFile } from './utils';



type CssLoaderTypesExtractorOptions = {
  /**
   * using custom `writeFile` instead of `fs.writeFile` 
   */
  writeFunction?: (typeof fs.writeFile),
  /**
   * log into inspector when using `node --inspect`
   */
  debug?: boolean,
  /**
   * adds array value of object 
   * @default true
   */
  withValue?: boolean,
};


// TODO named exports

/* eslint-disable class-methods-use-this */

export default class CssLoaderTypesExtractor {
  #pluginName = 'CssLoaderTypesExtractor';

  #writeFuction = fs.writeFile;

  #debug = false;

  #withValue = true;

  #modules = [];

  constructor(options?: CssLoaderTypesExtractorOptions) {
    if (options?.writeFunction !== undefined) { this.#writeFuction = options.writeFunction; }
    if (options?.debug !== undefined) { this.#debug = options.debug; }
    if (options?.withValue !== undefined) { this.#withValue = options.withValue; }
  
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
          .map(this.#debug ? inspect : x => x)
          .map(moduleToAbstract)
          //  make it more efficient
          .map(m => ModuleToSource(m, { withValue: this.#withValue }))
          // .map(this.#withValue ? x => x : m => ({ ...m, source: [m.source[0]] }))

          .map(SourceToFile)
          .map(this.#debug ? inspect : x => x)
          .map(file => writeToFile(file, this.#writeFuction));
        // clear modules.
        this.#modules = [];
      },
    );
  }
}
