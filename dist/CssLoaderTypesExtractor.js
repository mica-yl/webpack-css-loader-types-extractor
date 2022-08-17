"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("./utils");
// TODO named exports
/* eslint-disable class-methods-use-this */
class CssLoaderTypesExtractor {
    #pluginName = 'CssLoaderTypesExtractor';
    #writeFuction = fs_1.default.writeFile;
    #debug = false;
    #withValue = true;
    #modules = [];
    constructor(options) {
        if (options?.writeFunction !== undefined) {
            this.#writeFuction = options.writeFunction;
        }
        if (options?.debug !== undefined) {
            this.#debug = options.debug;
        }
        if (options?.withValue !== undefined) {
            this.#withValue = options.withValue;
        }
    }
    apply(compiler) {
        compiler.hooks.thisCompilation.tap(this.#pluginName, (compilation) => {
            compilation.hooks.succeedModule.tap(this.#pluginName, (m) => {
                const { resource, loaders } = m;
                if (/\.css/.test(resource) && !(/node_module/.test(resource)) && (loaders.length > 0)) {
                    this.#modules.push(m);
                }
            });
        });
        compiler.hooks.afterDone.tap(this.#pluginName, () => {
            this.#modules
                .map(this.#debug ? utils_1.inspect : x => x)
                .map(utils_1.moduleToAbstract)
                //  make it more efficient
                .map(m => (0, utils_1.ModuleToSource)(m, { withValue: this.#withValue }))
                // .map(this.#withValue ? x => x : m => ({ ...m, source: [m.source[0]] }))
                .map(utils_1.SourceToFile)
                .map(this.#debug ? utils_1.inspect : x => x)
                .map(file => (0, utils_1.writeToFile)(file, this.#writeFuction));
            // clear modules.
            this.#modules = [];
        });
    }
}
exports.default = CssLoaderTypesExtractor;
//# sourceMappingURL=CssLoaderTypesExtractor.js.map