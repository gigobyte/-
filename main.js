const electron = require('electron')
const Parser = require('rss-parser')
const Store = require('electron-store')
const { openPopup } = require('./popupContainer')
const { initTray } = require('./tray')
const { app, BrowserWindow, dialog } = electron
const { autoUpdater } = require('electron-updater')

const store = new Store()
const parser = new Parser()
let updateWin

let currentlyOpenedWindow

const loadData = () => {
  parser.parseURL('https://zbut.eu/feed/', (err, data) => {
    if (err || data.items.length === 0) {
      console.log(err)
      return
    }

    const lastReadArticle = store.get('lastReadArticle')
    const { items } = data

    if (lastReadArticle !== items[0].guid) {
      const newWindow = openPopup({ articlesToDisplay: items })

      if (currentlyOpenedWindow) {
        currentlyOpenedWindow.close()
      }

      currentlyOpenedWindow = newWindow

      currentlyOpenedWindow.on('close', () => {
        currentlyOpenedWindow = null
      })
    }

    store.set('lastReadArticle', items[0].guid)
  })
}

// autoUpdater.on('update-available', () => {

// })

autoUpdater.on('download-progress', (progressObj) => {
  const text = `Налична е нова версия на приложението.\nМоля изчакайте да бъде изтеглена и автоматично инсталирана. (${Math.floor(
    progressObj.percent
  )}%)`
  updateWin.webContents.send('message', text)
})

autoUpdater.on('update-downloaded', () => {
  updateWin.webContents.send('message', 'Новата версия е изтеглена успешно!')
  setTimeout(() => {
    autoUpdater.quitAndInstall()
  }, 1000)
})

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify()
  const lock = app.requestSingleInstanceLock()

  updateWin = new BrowserWindow({
    width: 550,
    height: 180,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  updateWin.on('closed', () => {
    updateWin = null
  })
  updateWin.loadURL(`file://${__dirname}/version.html`)

  setTimeout(() => {
    const text = `Налична е нова версия на приложението.<br/>Моля изчакайте да бъде изтеглена и автоматично инсталирана. (90%)`
    updateWin.webContents.send('message', text)
  }, 500)

  if (!lock) {
    app.quit()
  }

  app.on('second-instance', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'ЗБУТ НОРМИ и ПРАКТИКА',
      message: 'Приложението вече работи.'
    })
  })

  app.setLoginItemSettings({
    openAtLogin: true
  })

  loadData()
  initTray()
  new BrowserWindow({ show: false })
  setInterval(loadData, 3 * 60 * 60 * 1000)
})

module.exports = { currentlyOpenedWindow }
