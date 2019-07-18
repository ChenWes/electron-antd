import path from 'path'
import chalk from 'chalk'
import { spawn } from 'child_process'
import chokidar from 'chokidar'
import electron from 'electron'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import webpackHotMiddleware from 'webpack-hot-middleware'

// 本地运行参数
import { port, source } from '../config/dev.config'

/**
 * 开发环境本机调试
 */


// 使用webpack打包
process.env.NODE_ENV = 'development'

// 开发环境本地运行，导入webpack配置
const webpackConfig = require('../config/webpack.config')

let electronProcess = null
let manualRestart = false
let hotMiddleware

// 运行网页系统
function startRenderer() {
  return new Promise((resolve, reject) => {

    webpackConfig.devtool = 'source-map'
    const hotclient = ['webpack-hot-middleware/client?noInfo=true&reload=true']

    if (typeof webpackConfig.entry == 'object') {
      Object.keys(webpackConfig.entry).forEach((name) => {
        const value = webpackConfig.entry[name]
        if (Array.isArray(value)) {
          value.unshift(...hotclient)
        } else {
          webpackConfig.entry[name] = [...hotclient, value]
        }
      })
    } else {
      webpackConfig.entry = [...hotclient, webpackConfig.entry]
    }

    const webpackCompiler = webpack(webpackConfig)
    hotMiddleware = webpackHotMiddleware(webpackCompiler, {
      log: false,
      heartbeat: 2500
    })

    // 启用 dev-server
    const server = new WebpackDevServer(
      webpackCompiler,
      {
        contentBase: source,
        historyApiFallback: {
          index: 'index.html',
        },
        quiet: true, // 隐藏日志
        before(app, ctx) {
          app.use(hotMiddleware)
          ctx.middleware.waitUntilValid((err) => {
            console.log(`dev-server 本机调试环境运行在： ${chalk.magenta.underline(`http://localhost:${port}`)}`)
            resolve()
          })
        },
      }
    )
    server.listen(port)
  })
}

// 运行Electron应用
function startElectron() {
  electronProcess = spawn(electron, ['.'])

  //标准输出
  electronProcess.stdout.on('data', data => {
    electronLog(data, 'Electron', 'blue')
  })

  //标准错误
  electronProcess.stderr.on('data', data => {
    electronLog(data, 'Electron', 'yellow')
  })

  electronProcess.on('close', () => {
    if (!manualRestart) process.exit()
  })
}

//自定义输出日志等
function electronLog(data, type, color = 'gray') {
  console.log(chalk[color](`\n┏ ---------------------------- [${type}] `))
  console.log(chalk[color](data))
  console.log(chalk[color](`┗ ----------------------------`))
}

// 运行了网页系统后再运行Electron应用
startRenderer().then(() => {
  startElectron()
}).catch(err => {
  console.error(err)
})

// 文件变动监控
const watcher = chokidar.watch(path.join(__dirname, '../electron'), {
  ignored: /(^|[\/\\])\../,
  persistent: true
})

// 当文件发生变化时，会重新启动Electron
watcher.on('all', (path) => {
  if (electronProcess && electronProcess.kill) {
    manualRestart = true
    process.kill(electronProcess.pid)
    electronProcess = null
    startElectron()

    setTimeout(() => {
      manualRestart = false
    }, 5000)
  }
})