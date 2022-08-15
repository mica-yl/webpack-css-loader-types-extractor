"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("./utils");
/* eslint-disable class-methods-use-this */
class CssLoaderTypesExtractor {
    #pluginName = 'CssLoaderTypesExtractor';
    #writeFuction = fs_1.default.writeFile;
    #modules = [];
    constructor(options) {
        this.#writeFuction = options?.writeFunction || fs_1.default.writeFile;
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
                .map(utils_1.moduleToAbstract)
                .map(utils_1.ModuleToSource)
                .map(utils_1.SourceToFile)
                .map(file => (0, utils_1.writeToFile)(file, this.#writeFuction));
            // clear modules.
            this.#modules = [];
        });
    }
}
exports.default = CssLoaderTypesExtractor;
//# sourceMappingURL=CssLoaderTypesExtractor.js.map