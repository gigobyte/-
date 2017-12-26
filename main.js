const electron = require('electron')
const parser = require('rss-parser')
const { generateNotificationContent } = require('./popup')
const { app, Tray, Menu, BrowserWindow, dialog } = electron

const notification = {
	size: {
		width: 400,
		height: 200
	}
}


const init = () => {
	const tray = new Tray('./icon.ico')
	const contextMenu = Menu.buildFromTemplate([
		{label: 'Изход', click() { app.exit() }}
	])

	tray.setToolTip('Otgovori.info')
	tray.setContextMenu(contextMenu)

	const display = electron.screen.getPrimaryDisplay()

	parser.parseURL('https://otgovori.info/feed/', (err, data) => {
		const window = new BrowserWindow({
			movable: false,
			resizable: false,
			frame: false,
			width: notification.size.width,
			height: notification.size.height,
			x: display.workAreaSize.width - notification.size.width,
			y: display.workAreaSize.height - notification.size.height
		})

		const html = generateNotificationContent({ entries: data.feed.entries })

		window.loadURL(html)

		window.webContents.openDevTools()
	})


	setInterval(() => console.log('test'), 1000)
}

app.on('ready', init)
