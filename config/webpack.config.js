const path = require('path')
const webpack = require('webpack')

// webpack插件
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

// 环境
const { NODE_ENV } = process.env

// 返回当时脚本工作目录的路径
const projectPath = process.cwd()
const appPath = path.join(__dirname, `../src`)

// 样式加载器
const styleLoader = [{ loader: 'css-loader' }]
if (NODE_ENV === 'development') {
  styleLoader.unshift({ loader: 'css-hot-loader' }, { loader: 'style-loader' })
} else {
  styleLoader.unshift({ loader: MiniCssExtractPlugin.loader })
}

console.log(`运行环境：${NODE_ENV}`, `编译文件目录地址：${appPath}`)

// webpack 配置信息
const webpackConfig = {
  mode: NODE_ENV,
  target: 'electron-renderer',
  entry: {
    // 入口文件
    app: `${appPath}/index.js`,
  },
  resolve: {
    modules: [projectPath, 'node_modules']
  },
  output: {
    publicPath: './',
    path: path.join(__dirname, `../dist`),
    filename: 'js/[name].js',
    chunkFilename: "js/[name].js",
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        include: appPath,
        loader: ['babel-loader'],
      },
      {
        test: /\.(less)$/,
        use: [
          ...styleLoader,
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              modifyVars: {
                // 更改主题色
                'primary-color': '#74839b',
              },
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: styleLoader,
      },
      {
        test: /\.(png|jpe?g|gif|svg|swf|woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        query: {
          // limit: 10000,
          name: 'assets/[name].[ext]',
        }
      }
    ]
  },

  optimization: {
    splitChunks: {
      name: "common",
    }
  },

  plugins: [
    new ProgressBarPlugin(),
    new htmlWebpackPlugin({
      template: `${appPath}/index.html`,
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: "css/[name].css"
    }),
    new webpack.ProvidePlugin({
      $api: 'src/api',
      $app: 'src/utils/app.js',
      $config: 'config/app.config.js',
    }),
  ],
}


//区分不同环境
if (NODE_ENV === 'development') {

  // 开发环境配置
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  )

} else if (NODE_ENV === 'production') {

  // 生产环境配置
  webpackConfig.plugins.push(
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          pure_funcs: ['console.log'], // 删除console.log, 保留 info ，warn，error 等
        },
      }
    }),
    new OptimizeCSSAssetsPlugin({
      // cssProcessorOptions: { discardComments: { removeAll: true } },
      // canPrint: true
    })
  )

}

module.exports = webpackConfig