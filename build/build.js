process.env.NODE_ENV = 'production'
const path = require('path')
const packager = require('electron-packager')

const { default: buildCommon } = require('./build-common')

// 正式环境打包，导入webpack配置
const webpackConfig = require('../config/webpack.config')

// 加载electron-packager打包配置参数
const packageConfig = require('../config/package.config')

const { clearDir } = require('./utils')


// 编译前，先清空目录
clearDir(path.join(__dirname, '../dist'), false, true)

// 传入配置使用webpack打包方法进行打包
buildCommon(webpackConfig).then(() => {
  console.log('编译完成!')

  // 编译完成再进行打包
  bundleApp()

}).catch(err => {
  console.error(err)
})


function bundleApp() {
  // 指定打包的环境为production
  packageConfig.mode = 'production'

  // 传入打包参数并开始打包
  packager(packageConfig, (err, appPaths) => {
    if (err) {
      console.error(err)
    } else {
      console.log('打包完成!')
    }
  })
}