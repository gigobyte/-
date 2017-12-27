const { app, Tray, Menu } = require('electron')

const initTray = () => {
	const tray = new Tray('./icon.ico')
	const contextMenu = Menu.buildFromTemplate([
		{label: 'Изход', click() { app.exit() }}
	])

	tray.setToolTip('Otgovori.info')
	tray.setContextMenu(contextMenu)
}

module.exports = {
	initTray
}