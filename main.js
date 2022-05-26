const electron = require('electron')
const Parser = require('rss-parser')
const Store = require('electron-store')
const { openPopup } = require('./popupContainer')
const { initTray } = require('./tray')
const { app, BrowserWindow, dialog } = electron

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

app.on('ready', () => {
  const lock = app.requestSingleInstanceLock()

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
