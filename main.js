const electron = require('electron')
const parser = require('rss-parser')
const { app, Tray, Menu, BrowserWindow, dialog } = electron

const feedPrefix = '<p><a rel="nofollow" href="https://otgovori.info">OTGOVORI.INFO</a></p>'

const notification = {
	size: {
		width: 400,
		height: 200
	}
}

const generateNotificationContent = state => 'data:text/html;charset=utf-8,' + `
	<html>
		<head>
			<meta charset="utf-8">
			<meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
			<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro" rel="stylesheet"> 
		</head>

		<style>
			p {
				margin: 0;
			}

			a {
				color: #ff5a00;
			}

			body {
				font-family: 'Source Sans Pro', sans-serif;
				margin: 0;
			    border: 1px solid #c4c4c4;
			}

			.container {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
			}

			.title {
				font-weight: bold;
				padding: 8px 25px 8px 8px;
				background-color: #228ddd;
				box-shadow: 0 0px 0px 2px #228ddd, 0 2px 8px #228ddd;
				color: white;
			}

			.content {
				padding: 8px;
			}
		</style>
		
		<body>
			<div class="container">
				<div class="title">
					${state.feed.entries[0].title}
				</div>

				<div class="content">
					${state.feed.entries[0].content.replace(feedPrefix, '')}
				</div>
			</div>
		</body>
	</html>
`

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

		const html = generateNotificationContent(data)

		window.loadURL(html)

		window.webContents.openDevTools()
	})


	setInterval(() => console.log('test'), 1000)
}

app.on('ready', init)
