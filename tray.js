const { app, Tray, Menu, shell } = require('electron')

const initTray = () => {
	const tray = new Tray('./icon.ico')
	const contextMenu = Menu.buildFromTemplate([
		{label: 'Отвори сайта', click() { shell.openExternal('https://zbut.eu/') }},
		{label: 'Изход', click() { app.exit() }}
	])

	tray.setToolTip('ЗБУТ НОРМИ и ПРАКТИКА')
	tray.setContextMenu(contextMenu)
}

module.exports = {
	initTray
}