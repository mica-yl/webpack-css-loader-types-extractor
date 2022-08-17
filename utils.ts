import fs from 'fs';
import * as webpack from 'webpack';
import Inspector from 'node:inspector';


export type AbstractModule<X> = {
  name: string,
  path: string,
  source: X,
};

export const moduleToAbstract = (m: webpack.Module) => ({
  name: m._source._name,
  source: m._source._value,
  path: m.resource,
});
type ModuleToSourceOptions = { withValue: boolean };
export function ModuleToSource(m: AbstractModule<string>,
  options: ModuleToSourceOptions): AbstractModule<[string, string] | [string]> {

  const { name: n, path: p, source: v } = m;
  // const { _source: { _name: n, _value: v } } = m;
  const name: string = n.split('!')[1];
  const objExports: string = v.split('// Exports\n')[1];
  const fn0 = objExports
    // named exports
    .replaceAll(/export var /g, '___CSS_LOADER_EXPORT___.')
    .replace(/export (default)?/g, 'return');
  const source = [] as [string, string] | [string];
  const $eval = ((body: string) => {
    try {
      return eval(body);
    } catch (err) {
      throw Error(`${p} :Parsing error with parsing string.\n ${body} \nwith error: ${err}`);
    }
  });
  const ObjString = `(function (){
                const ___CSS_LOADER_EXPORT___ ={};
                ${fn0}
              })()`;
  source.push($eval(ObjString));

  if (options.withValue) {
    const objArray: string = v.match(/(?<Arr>\/\/ Module.*?)\s\//s)?.groups?.Arr || '';
    const ArrayString = `(function (){
    const module= {id:'${name || p}'};
    const ___CSS_LOADER_EXPORT___ =[];
    ${objArray}
    return ___CSS_LOADER_EXPORT___;
  })()`;
    source.push($eval(ArrayString));
  }

  // eslint-disable-next-line no-eval
  return { name, source, path: p };
}

export function SourceToFile(sourceObject: AbstractModule<[string, string] | [string]>) {
  const { name, source: [source, value], path } = sourceObject;
  // TODO add the array.
  const file = `/* eslint-disable quote-props */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
const css = ${JSON.stringify(source, null, 2)} as const;

const value = ${value ? JSON.stringify(value, null, 2) : '{}'} as const;

type Rest = {toString:()=>string};

const Export : typeof css & Rest & typeof value = css;

export default Export;
`;
  return { name: name.concat('.d.ts'), source: file, path: path?.concat('.d.ts') };
}

export function writeToFile(fileObject: AbstractModule<string>, writeFile: (typeof fs.writeFile)) {
  const { name, source, path } = fileObject;
  writeFile(path, source, (err) => {
    if (err) console.log(fileObject, 'failed with', err);
  });
}

// log in inspector only
const log = Inspector.console.log;
export const inspect = <X>(input: X) => (log(input), input);