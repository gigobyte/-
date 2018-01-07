const electron = require('electron')
const parser = require('rss-parser')
const Store = require('electron-store')
const { openPopup } = require('./popupContainer')
const { initTray } = require('./tray')
const { app, Tray, Menu, BrowserWindow, dialog } = electron

const store = new Store()

let currentlyOpenedWindow

const init = () => {
	initTray();

	parser.parseURL('https://shriekocg.blogspot.com/feeds/posts/default', (err, data) => {
		if (err || data.feed.entries.length === 0) {
			console.log(err)
			return
		}

		const lastReadArticle = store.get('lastReadArticle')
		const { feed: { entries }} = data

		console.log(entries)

		currentlyOpenedWindow = openPopup({ articlesToDisplay: entries })

		// if (lastReadArticle && lastReadArticle !== entries[0].id) {
		// 	newWindow = openPopup({ articlesToDisplay: entries})

		// 	if (currentlyOpenedWindow) {
		// 		currentlyOpenedWindow.close()
		// 	}

		// 	currentlyOpenedWindow = newWindow
		// }

		// store.set('lastReadArticle', entries[0].id)
	})
}

app.on('ready', () => {
	init()
	new BrowserWindow({ show: false })
	// setInterval(init, 5000)
})
