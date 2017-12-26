const feedPrefix = '<p><a rel="nofollow" href="https://otgovori.info">OTGOVORI.INFO</a></p>'

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

			.header {
				background-color: #228ddd;
				box-shadow: 0 0px 0px 2px #228ddd, 0 2px 8px #228ddd;
				display: flex;
			}

			.title {
				padding: 8px;
				font-weight: bold;
				color: white;
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
		</style>
		
		<body>
			<div class="container">
				<div class="header">
					<div class="title">
						${state.entries[0].title}
					</div>
					<div class="close-button">
						✖
					</div>
				</div>

				<div class="content">
					${state.entries[0].content.replace(feedPrefix, '')}
				</div>
			</div>
		</body>

		<script>
			window.onload = () => {
				const remote = require('electron').remote;

				document.querySelector('.close-button').addEventListener('click', () => {
					remote.getCurrentWindow().close();
				})
			}
		</script>
	</html>
`

module.exports = {
	generateNotificationContent
}