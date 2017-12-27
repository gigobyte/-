const electron = require('electron')
const parser = require('rss-parser')
const { openPopup } = require('./popupContainer')
const { initTray } = require('./tray')
const { app, Tray, Menu, BrowserWindow, dialog } = electron

const init = () => {
	initTray();

	parser.parseURL('https://otgovori.info/feed/', (err, data) => {
		openPopup({articlesToDisplay: data.feed.entries});
	})
}

app.on('ready', init)
