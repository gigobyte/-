const electron = require('electron')
const { BrowserWindow } = electron
const { generateNotificationContent } = require('./popup')

const notification = {
	size: {
		width: 400,
		height: 200
	}
}

const openPopup = ({ articlesToDisplay }) => {
	const display = electron.screen.getPrimaryDisplay()

	const window = new BrowserWindow({
		icon: './icon.ico',
		title: 'ЗБУТ НОРМИ и ПРАКТИКА',
		alwaysOnTop: true,
		movable: false,
		resizable: false,
		frame: false,
		width: notification.size.width,
		height: notification.size.height,
		x: display.workAreaSize.width - notification.size.width - 10,
		y: display.workAreaSize.height - notification.size.height - 10
	})

	const html = generateNotificationContent({ articles: articlesToDisplay })

	window.loadURL(html)

	window.webContents.openDevTools()

	return window;
}

module.exports = {
	openPopup
}