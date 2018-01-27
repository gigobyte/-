const electron = require('electron')
const parser = require('rss-parser')
const Store = require('electron-store')
const { openPopup } = require('./popupContainer')
const { initTray } = require('./tray')
const { app, Tray, Menu, BrowserWindow, dialog } = electron

const store = new Store()

let currentlyOpenedWindow

const loadData = () => {
	parser.parseURL('https://shriekocg.blogspot.com/feeds/posts/default', (err, data) => {
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

app.on('ready', () => {
	loadData()
	initTray()
	new BrowserWindow({ show: false })
	setInterval(loadData, 5000)
})

module.exports = { currentlyOpenedWindow }