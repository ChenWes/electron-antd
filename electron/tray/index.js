const path = require('path')
const { Menu, Tray, systemPreferences, nativeImage } = require('electron')
const { appName, trayIconDark, trayIconLight } = require('../../config/app.config')

const { createWindow } = require('../window')
const defaultMenus = require('../menus/tray-menus')


// 创建系统托盘菜单
function creatTray({ menus = defaultMenus, title = appName, icon } = {}) {
  const iconPath = process.platform === 'darwin' ? systemPreferences.isDarkMode() ? trayIconLight : trayIconDark : trayIconLight

  console.log('获取图标地址', iconPath);

  let image = nativeImage.createFromPath(iconPath)
  image.setTemplateImage(true)
  let tray = new Tray(image)
  tray.setToolTip(title)
  tray.setContextMenu(Menu.buildFromTemplate(menus))
  tray.on('double-click', () => {
    createWindow('home')
  })

  return tray
}

module.exports = {
  creatTray
}