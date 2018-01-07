const moment = require('moment')

const trimContent = content => content.substring(0, 180).trim() + '...'
const formatDate = date => moment(date).format('DD.MM.YYYY')

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

			.orange {
				color: #ff5a00;
			}

			body {
				font-family: 'Source Sans Pro', sans-serif;
				margin: 0;
			}

			.container {
				border: 1px solid #9ec4e0;
			    height: calc(100% - 2px);
    			width: calc(100% - 2px);
			}

			.header {
				-webkit-user-select: none;
				background-color: #228ddd;
				box-shadow: 0 0px 0px 2px #228ddd, 0 2px 8px #228ddd;
				display: flex;
				justify-content: space-between;
				padding: 4px;
			}

			.header-text {
				color: white;
				padding-left: 3px;
				align-self: center;
				font-family: Impact;
			}

			.title {
				display: block;
				font-weight: bold;
			    text-decoration: none;
			    color: black;
			    padding-top: 5px;
			}

			.close-button {
				padding-right: 12px;
				color: white;
				align-self: center;
				cursor: pointer;
			}

			.content {
				padding: 8px;
			}

			.content-text {
				font-size: 13px;
				line-height: 15px;
			}

			.date {
				font-size: 14px;
				padding-bottom: 8px;
			}
		</style>
		
		<body>
			<div class="container">
				<div class="header">
					<div class="header-text">
						ЗБУТ НОРМИ и ПРАКТИКА
					</div>

					<div class="close-button" title="Затвори">
						✖
					</div>
				</div>

				<div class="content">
					<a href="${state.articles[0].link}" class="title" title="Кликни, за да отвориш новината">
						${state.articles[0].title}
					</a>
					<div class="date">
						Публикувано на ${formatDate(state.articles[0].pubDate)}
					</div>

					<div class="content-text">
						${trimContent(state.articles[0].contentSnippet)}
					</div>
				</div>
			</div>
		</body>

		<script>
			window.onload = () => {
				const { remote, shell } = require('electron');

				document.querySelector('.close-button').addEventListener('click', () => {
					remote.getCurrentWindow().close();
				});

				for (const link of document.querySelectorAll('a')) {
					link.addEventListener('click', (e) => {
						e.preventDefault();
						shell.openExternal(e.target.getAttribute('href'));
					})
				}
			}
		</script>
	</html>
`

module.exports = {
	generateNotificationContent
}