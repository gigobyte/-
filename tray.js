const { app, Tray, Menu, shell } = require('electron')
const { openPopup } = require('./popupContainer')
const Parser = require('rss-parser')
const path = require('path')

const parser = new Parser()
let tray = null

const initTray = () => {
  tray = new Tray(path.join(__dirname, './icon.ico'))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Отвори сайта',
      click() {
        shell.openExternal('https://zbut.eu/')
      }
    },
    {
      label: 'Изход',
      click() {
        app.exit()
      }
    }
  ])

  tray.setToolTip('ЗБУТ НОРМИ и ПРАКТИКА')
  tray.setContextMenu(contextMenu)

  let { currentlyOpenedWindow } = require('./main')

  const onTrayClick = () => {
    if (currentlyOpenedWindow) {
      return
    }

    parser.parseURL('https://zbut.eu/feed/', (err, data) => {
      if (err || data.items.length === 0) {
        onTrayClick()
        return
      }

      const { items } = data
      const newWindow = openPopup({ articlesToDisplay: items })
      currentlyOpenedWindow = newWindow

      currentlyOpenedWindow.on('close', () => {
        currentlyOpenedWindow = null
      })
    })
  }

  tray.on('click', onTrayClick)
}

module.exports = {
  initTray
}
