const electron = require('electron')
const { BrowserWindow, shell, ipcMain } = electron

const notification = {
  size: {
    width: 400,
    height: 200
  }
}

const openPopup = ({ articlesToDisplay }) => {
  const display = electron.screen.getPrimaryDisplay()

  const window = new BrowserWindow({
    icon: './icon.ico',
    title: 'ЗБУТ НОРМИ и ПРАКТИКА',
    alwaysOnTop: true,
    movable: false,
    resizable: false,
    frame: false,
    width: notification.size.width,
    height: notification.size.height,
    x: display.workAreaSize.width - notification.size.width - 10,
    y: display.workAreaSize.height - notification.size.height - 10,
    webPreferences: {
      nodeIntegration: true
    }
  })

  window.loadFile(`${__dirname}/popup.html`)

  ipcMain.on('getArticles', (event) => {
    event.returnValue = articlesToDisplay
  })

  ipcMain.on('openLink', (event, link) => {
    shell.openExternal(link)
  })

  ipcMain.on('closeWindow', () => {
    window.close()
    ipcMain.removeAllListeners('closeWindow')
    ipcMain.removeAllListeners('getArticles')
    ipcMain.removeAllListeners('openLink')
  })

  return window
}

module.exports = {
  openPopup
}
