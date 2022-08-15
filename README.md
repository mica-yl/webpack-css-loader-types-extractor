# CssLoaderTypesExtractor 

## what is this ?

This is a webpack plugin to extract types defintion for css files from [css-loader](https://github.com/webpack-contrib/css-loader).

it writes `[css-filename].css.d.ts` for each css file processed by [css-loader](https://github.com/webpack-contrib/css-loader). 

## how to install ?

it isn't on npm. so you will need to use github.

`npm i -D https://github.com/mica-yl/webpack-css-loader-types-extractor.git#main`

`pnpm add -D https://github.com/mica-yl/webpack-css-loader-types-extractor.git#main`

## how to use?

Add a new instance of the plugin to plugins array.


example : `webpack.config.js`

```javascript
const CssLoaderTypesExtractor = require('webpack-css-loader-types-extractor');
// server side webpack config
module.exports = {
 mode: 'development',
  module:{
    rules:[
      {
        test: /\.css$/g,
        use: [
          {
            loader: 'css-loader',
            options: {
              modules:true
            },
          },
        ],
      },
    ]
  }
  // ...
  plugins: [
 // ...
    new CssLoaderTypesExtractor(),
  ],
  // ...
};
```