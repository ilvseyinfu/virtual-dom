const webpack = require('webpack');

const merge   = require('webpack-merge');
const baseCfg = require('./base');

const DEV_SERVER_PORT = 8000;

let config = merge(baseCfg, {

  devtool : 'eval-source-map',

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],

  devServer: {
    contentBase        : './src/',
    historyApiFallback : true,
    hot                : true,
    inline             : true,
    port               : DEV_SERVER_PORT,
    publicPath         : '/assets/',
    disableHostCheck   : true,
    noInfo             : false
  }

});

/**
 * HMR (hot module reload)
 * 加上开发服务器 hot reload 功能
 */
config.entry = (function(rawEntry){
  rawEntry = Object.assign({}, rawEntry);
  for (var each in rawEntry) {
    var entry = rawEntry[each];
    if (!Array.isArray(entry)) entry = [entry];
    entry.unshift('webpack-dev-server/client?http://127.0.0.1:' + DEV_SERVER_PORT);
    entry.unshift('webpack/hot/only-dev-server');
    rawEntry[each] = entry;
  }
  return rawEntry;

})(config.entry);

module.exports = config;
