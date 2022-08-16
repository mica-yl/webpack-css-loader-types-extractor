"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inspect = exports.writeToFile = exports.SourceToFile = exports.ModuleToSource = exports.moduleToAbstract = void 0;
const node_inspector_1 = __importDefault(require("node:inspector"));
const moduleToAbstract = (m) => ({
    name: m._source._name,
    source: m._source._value,
    path: m.resource,
});
exports.moduleToAbstract = moduleToAbstract;
function ModuleToSource(m) {
    const { name: n, path: p, source: v } = m;
    // const { _source: { _name: n, _value: v } } = m;
    const name = n.split('!')[1];
    const source = v.split('// Exports\n')[1];
    const fn0 = source
        // named exports
        .replaceAll(/export var /g, '___CSS_LOADER_EXPORT___.')
        .replace(/export (default)?/g, 'return');
    const fn = `(function (){
                const ___CSS_LOADER_EXPORT___ ={};
                ${fn0}
              })()`;
    const obj = (() => {
        try {
            return eval(fn);
        }
        catch (err) {
            throw Error(`${path} :Parsing error with parsing string.\n ${fn}`);
        }
    })();
    // eslint-disable-next-line no-eval
    return { name, source: obj, path: p };
}
exports.ModuleToSource = ModuleToSource;
function SourceToFile(sourceObject) {
    const { name, source, path } = sourceObject;
    // TODO add the array.
    const file = `/* eslint-disable quote-props */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
const css = ${JSON.stringify(source, null, 2)} as const;

type Rest = {toString:()=>string};

const Export : typeof css & Rest = css;

export default Export;
`;
    return { name: name.concat('.d.ts'), source: file, path: path?.concat('.d.ts') };
}
exports.SourceToFile = SourceToFile;
function writeToFile(fileObject, writeFile) {
    const { name, source, path } = fileObject;
    writeFile(path, source, (err) => {
        if (err)
            console.log(fileObject, 'failed with', err);
    });
}
exports.writeToFile = writeToFile;
// log in inspector only
const log = node_inspector_1.default.console.log;
const inspect = (input) => (log(input), input);
exports.inspect = inspect;
//# sourceMappingURL=utils.js.map