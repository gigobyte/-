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
		movable: false,
		resizable: false,
		frame: false,
		width: notification.size.width,
		height: notification.size.height,
		x: display.workAreaSize.width - notification.size.width,
		y: display.workAreaSize.height - notification.size.height
	})

	const html = generateNotificationContent({ articles: articlesToDisplay })

	window.loadURL(html)

	window.webContents.openDevTools()
}

module.exports = {
	openPopup
}