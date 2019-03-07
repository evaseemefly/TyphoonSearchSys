// vue.config.js
// const HtmlWebpackPlugin = require('html-webpack-plugin') //通过 npm 安装
const webpack = require('webpack') //访问内置的插件
const path = require('path')

module.exports = {
  // 选项...
  // baseUrl:
  //   process.env.NODE_ENV === 'production' ? '/production-sub-path/' : '/',
  // module: {
  //   loaders: [{}]
  // }
  chainWebpack: config => {
    config.module
    //   .rule("images")
    //   .use("image-webpack-loader")
    //   .loader("image-webpack-loader")
    //   .options({
    //     bypassOnDebug: true
    //   })
    //   .end();
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'windows.jQuery': 'jquery'
      })
    ],
    devtool: 'cheap-module-eval-source-map'
  },
  devServer: {
    overlay: {
      warnings: false,
      errors: true
    }
  },
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  }
  // devServer: {
  //   overlay: {
  //     warnings: false,
  //     errors: true
  //   },
  //   lintOnSave: false
  // }
}
