const { app, Tray, Menu, shell } = require('electron')
const { openPopup } = require('./popupContainer')
const parser = require('rss-parser')

const initTray = () => {
	const tray = new Tray('./icon.ico')
	const contextMenu = Menu.buildFromTemplate([
		{label: 'Отвори сайта', click() { shell.openExternal('https://zbut.eu/') }},
		{label: 'Изход', click() { app.exit() }}
	])

	tray.setToolTip('ЗБУТ НОРМИ и ПРАКТИКА')
	tray.setContextMenu(contextMenu)

	let { currentlyOpenedWindow } = require('./main')

	const onTrayClick = () => {
		if (currentlyOpenedWindow) {
			return
		}

		parser.parseURL('https://shriekocg.blogspot.com/feeds/posts/default', (err, data) => {
			if (err || data.feed.entries.length === 0) {
				onTrayClick()
				return
			}

			const { feed: { entries } } = data
			const newWindow = openPopup({ articlesToDisplay: entries })
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