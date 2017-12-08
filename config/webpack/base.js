const path    = require('path');
const webpack = require('webpack');

const distPath    = path.join(__dirname, '../../dist/assets');
const srcPath     = path.join(__dirname, '../../src');

let config = {

  entry: {
    app: `${srcPath}/index.js`
  },

  output : {
    path       : distPath,
    filename   : '[name].js',
    publicPath : '/assets/'
  },

  module: {

    rules: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.sass/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader?outputStyle=expanded&indentedSyntax'
      },
      {
        test: /\.scss/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader?outputStyle=expanded'
      },
      {
        test: /\.less/,
        loader: 'style-loader!css-loader!postcss-loader!less-loader'
      },
      {
        test: /\.styl/,
        loader: 'style-loader!css-loader!postcss-loader!stylus-loader'
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader?{bypassOnDebug:true,options:{optimizationLevel:7},gifsicle:{interlaced:false}}'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.svg$/,
        loaders: ['raw-loader', 'svgo-loader?' + JSON.stringify({
          plugins: [
            { removeTitle: true },
            { convertColors: { shorthex: true }},
            { convertPathData: true },
            { removeStyleElement: true },
            { removeUselessDefs: true }
          ]
        })]
      },
      {
        test: /\.(jsx?)$/,
        exclude: function(path) {
          const rNpm = path.match(/node_modules/);
          const rIgnore = path.match(/node_modules\/(@hlj)/);
          return rNpm && !rIgnore;
        },
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          babelrc: false
        }
      }
    ]
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: function () {
          return [
            require('precss'),
            require('autoprefixer')({ browsers: 'Android >= 2.3' })
          ];
        }
      }
    })
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.es6'],
    alias: {
      models     : `${srcPath}/models/`,
      actions    : `${srcPath}/actions/`,
      components : `${srcPath}/components/`,
      utils      : `${srcPath}/utils/`,
      sources    : `${srcPath}/sources/`,
      stores     : `${srcPath}/stores/`,
      styles     : `${srcPath}/styles/`,
      pages      : `${srcPath}/pages/`,
      images     : `${srcPath}/images/`,
      config     : `${srcPath}/config/` + process.env.REACT_WEBPACK_ENV
    }
  }

};

module.exports = config;
