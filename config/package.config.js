const path = require('path')

/**
 * `electron-packager` options
 * https://github.com/electron-userland/electron-packager/blob/master/docs/api.md
 * 
 * options参数
 * 
 * Required必选参数 
 * dir String ：The source directory.
 * 
 * Optional可选参数
 * afterCopy Array of Functions：An array of functions to be called after your app directory has been copied to a temporary directory. Each function is called with five parameters:
 * 
 */
module.exports = {
  arch: 'x64',
  asar: true,
  dir: path.join(__dirname, '../'),
  icon: path.join(__dirname, '../assets/app-icon/icon/icon'),
  ignore: /(^\/(src|test|build|\.[a-z]+|README|yarn|static))|\.gitkeep|app.config.json/,
  out: path.join(__dirname, '../prod'),
  overwrite: true,
  platform: process.env.BUILD_TARGET || 'all'
}