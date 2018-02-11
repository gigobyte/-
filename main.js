const electron = require('electron')
const AutoLaunch = require('auto-launch')
const parser = require('rss-parser')
const Store = require('electron-store')
const { openPopup } = require('./popupContainer')
const { initTray } = require('./tray')
const { app, Tray, Menu, BrowserWindow, dialog } = electron

const store = new Store()

let currentlyOpenedWindow

const loadData = () => {
	parser.parseURL('https://zbut.eu/feed/', (err, data) => {
		if (err || data.feed.entries.length === 0) {
			console.log(err)
			return
		}

		const lastReadArticle = store.get('lastReadArticle')
		const { feed: { entries }} = data

		if (lastReadArticle && lastReadArticle !== entries[0].id) {
			const newWindow = openPopup({ articlesToDisplay: entries})

			if (currentlyOpenedWindow) {
				currentlyOpenedWindow.close()
			}

			currentlyOpenedWindow = newWindow

			currentlyOpenedWindow.on('close', () => {
				currentlyOpenedWindow = null
			})
		}

		store.set('lastReadArticle', entries[0].id)
	})
}

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
	dialog.showMessageBox({type: 'info', title: 'ЗБУТ НОРМИ и ПРАКТИКА', message: 'Приложението вече работи.'})
	return true
})

if (isSecondInstance) {
	app.exit()
}

app.on('ready', () => {
	loadData()
	initTray()
	new BrowserWindow({ show: false })
	setInterval(loadData, 5000)
})

const autoLauncher = new AutoLaunch({
	name: 'ЗБУТ НОРМИ и ПРАКТИКА'
})

autoLauncher.enable()

module.exports = { currentlyOpenedWindow }