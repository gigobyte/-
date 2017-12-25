const electron = require('electron');
const { app, Tray, Menu, BrowserWindow, dialog } = electron;

const init = () => {
	const tray = new Tray('./icon.ico')
	const contextMenu = Menu.buildFromTemplate([
		{label: 'Exit', click() { app.exit() }}
	])

	tray.setToolTip('Otgovori.info')
	tray.setContextMenu(contextMenu)

	const display = electron.screen.getPrimaryDisplay()

	const window = new BrowserWindow({
		movable: false,
		resizable: false,
		frame: false,
		width: 300,
		height: 300,
		x: display.workAreaSize.width - 300,
		y: display.workAreaSize.height - 300
	})
}

app.on('ready', init)
