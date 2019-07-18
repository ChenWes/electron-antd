import webpack from 'webpack'

const { NODE_ENV } = process.env
console.log(NODE_ENV)


// webpack打包的公共方法
function buildCommon(webpackConfig) {
  return new Promise((resolve, reject) => {

    // 使用webpack打包
    webpack(webpackConfig, (err, stats) => {
      if (err) reject(err.stack || err)
      else if (stats.hasErrors()) {
        let err = ''

        stats.toString({
          chunks: false,
          colors: true
        })
          .split(/\r?\n/)
          .forEach(line => {
            err += `    ${line}\n`
          })

        reject(err)
      } else {
        resolve(stats.toString({
          chunks: false,
          colors: true
        }))
      }
    })
  })
}

export default buildCommon