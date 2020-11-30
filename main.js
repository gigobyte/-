const electron = require('electron')
const AutoLaunch = require('auto-launch')
const Parser = require('rss-parser')
const Store = require('electron-store')
const { openPopup } = require('./popupContainer')
const { initTray } = require('./tray')
const { app, Tray, Menu, BrowserWindow, dialog } = electron

const store = new Store()
const parser = new Parser()

let currentlyOpenedWindow

const loadData = () => {
  parser.parseURL('https://zbut.eu/feed/', (err, data) => {
    if (err || data.items.length === 0) {
      console.log(err)
      return
    }

    const lastReadArticle = store.get('lastReadArticle')
    const { items } = data

    if (lastReadArticle && lastReadArticle !== items[0].guid) {
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

const lock = app.requestSingleInstanceLock()

if (!lock) {
  dialog.showMessageBox({
    type: 'info',
    title: 'ЗБУТ НОРМИ и ПРАКТИКА',
    message: 'Приложението вече работи.'
  })
  app.exit()
}

app.on('ready', () => {
  loadData()
  initTray()
  new BrowserWindow({ show: false })
  setInterval(loadData, 5000)
})

const autoLauncher = new AutoLaunch({
  name: 'ЗБУТ НОРМИ и ПРАКТИКА',
  path: '/Applications/ЗБУТ НОРМИ и ПРАКТИКА.app'
})

autoLauncher.enable()

module.exports = { currentlyOpenedWindow }
