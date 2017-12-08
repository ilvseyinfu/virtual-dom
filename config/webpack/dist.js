const path    = require('path');
const webpack = require('webpack');
const merge   = require('webpack-merge');
const baseCfg = require('./base');

const minifyConfig = {
  html5                          : true,
  collapseWhitespace             : true,
  minifyCSS                      : true,
  minifyJS                       : true,
  minifyURLs                     : false,
  removeAttributeQuotes          : true,
  removeComments                 : true,
  removeEmptyAttributes          : true,
  removeOptionalTags             : true,
  removeRedundantAttributes      : true,
  removeScriptTypeAttributes     : true,
  removeStyleLinkTypeAttributese : true,
  useShortDoctype                : true
}

// plugins:
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let config = merge(baseCfg, {

  output: Object.assign({}, baseCfg.output, {
    filename: '[name]-[chunkhash].js',
    // 部署路径
    publicPath: 'https://hlj-img.b0.upaiyun.com/zmw/h5-upload/'
  }),


  plugins: [
    /**
     * 插件配置
     */
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: function () {
          return [
            require('precss'),
            require('autoprefixer')({ browsers: 'Android >= 2.3' })
          ];
        }
      }
    }),

    /** 去掉不需要的 moment locale **/
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),

    /** 定义一些环境变量 **/
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      PRODUCTION: true
    }),

    /** JS 压缩配置 **/
    new webpack.optimize.UglifyJsPlugin({
      compress : {
        sequences     : true,
        properties    : true,
        dead_code     : true,
        conditionals  : true,
        comparisons   : true,
        loops         : true,
        unused        : true,
        if_return     : true,
        drop_debugger : false,
        global_defs: {
          DEBUG: false
        }
      }
    }),

    /** 统计打包后的模块构成 **/
    new BundleAnalyzerPlugin({ analyzerMode: 'static' }),

    /** 按模块的出现顺序排序 **/
    new webpack.optimize.OccurrenceOrderPlugin(),

    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),

    new HtmlWebpackPlugin({
      template : path.join(__dirname, '../../src/template.html.ejs'),
      filename : 'index.html',
      chunks   : ['app'],
      inject   : 'body',
      minify   : minifyConfig
    })
  ]

});

module.exports = config;
