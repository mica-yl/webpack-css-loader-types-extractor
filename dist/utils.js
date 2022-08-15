"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeToFile = exports.SourceToFile = exports.ModuleToSource = exports.moduleToAbstract = void 0;
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
    const fn0 = source.replace(/export (default)?/, 'return');
    const fn = `(function (){
                const ___CSS_LOADER_EXPORT___ ={};
                ${fn0}
              })()`;
    // eslint-disable-next-line no-eval
    return { name, source: eval(fn), path: p };
}
exports.ModuleToSource = ModuleToSource;
function SourceToFile(sourceObject) {
    const { name, source, path } = sourceObject;
    const file = `/* eslint-disable quote-props */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
const css = ${JSON.stringify(source, null, 2)} as const;

export default css;
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
//# sourceMappingURL=utils.js.map