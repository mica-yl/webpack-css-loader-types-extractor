import fs from 'fs';
import * as webpack from 'webpack';
import Inspector from 'node:inspector';


export type AbstractModule = {
  name: string,
  path: string,
  source: string,
};

export const moduleToAbstract = (m: webpack.Module) => ({
  name: m._source._name,
  source: m._source._value,
  path: m.resource,
});
export function ModuleToSource(m: AbstractModule) {
  const { name: n, path: p, source: v } = m;
  // const { _source: { _name: n, _value: v } } = m;
  const name: string = n.split('!')[1];
  const source: string = v.split('// Exports\n')[1];
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
    } catch (err) {
      throw Error(`${path} :Parsing error with parsing string.\n ${fn}`);
    }
  })()
  // eslint-disable-next-line no-eval
  return { name, source: obj, path: p };
}
export function SourceToFile(sourceObject: AbstractModule) {
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

export function writeToFile(fileObject: AbstractModule, writeFile: (typeof fs.writeFile)) {
  const { name, source, path } = fileObject;
  writeFile(path, source, (err) => {
    if (err) console.log(fileObject, 'failed with', err);
  });
}

// log in inspector only
const log = Inspector.console.log;
export const inspect = <X>(input: X) => (log(input), input);