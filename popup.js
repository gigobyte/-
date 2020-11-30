const trimContent = content => content.substring(0, 180).trim() + '...'
const formatDate = date => {
	// format(date, 'DD.MM.YYYY')
	date = new Date(date)

	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const year = date.getFullYear()

	return `${day}.${month}.${year}`
}
const formatTitle = title => title.substring(0,250).trim() + (title.length > 250 ? '...' : '')

const generateNotificationContent = state => 'data:text/html;charset=utf-8,' + `
	<html>
		<head>
			<meta charset="utf-8">
			<meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
			<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro" rel="stylesheet"> 
		</head>

		<style>
			* {
				cursor: default;
			}

			p {
				margin: 0;
			}

			.orange {
				color: #ff5a00;
			}

			body {
				font-family: 'Source Sans Pro', sans-serif;
				margin: 0;
				-webkit-user-select: none;
			}

			.container {
				border: 1px solid #9ec4e0;
			    height: calc(100% - 2px);
    			width: calc(100% - 2px);
			}

			.header {
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
				cursor: pointer;
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
				padding-top: 6px;
			}

			.pagination {
				display: flex;
				justify-content: center;
				position: absolute;
				bottom: 5px;
				left: 50%;
				transform: translateX(-50%);
			}

			.pagination-arrow {
				padding: 0 5px;
				display: flex;
				align-items: center;
			}

			.pagination-arrow > img {
				cursor: pointer;
			}

			.pagination-arrow.disabled > img {
				cursor: not-allowed;
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

				${state.articles.map((article, i, array) => `
					<div class="content" data-article-id=${i} >
						<a href="${article.link}" class="title" title="Кликни, за да отвориш в браузъра">
							${formatTitle(article.title)}
						</a>
						<div class="date">
							Публикувано на ${formatDate(article.pubDate)}
						</div>

						<div class="pagination">
							${i === 0
								? `<div class="pagination-arrow disabled">
										<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAMCAIAAAA21aCOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABvSURBVChThdAxCsAgEERR7389wUYQLYKt2G5hJjiYNRj93cpjUU2bE5FSCgfV5IBCCCklzqrXdWStjTHySEU30M5phNbug5blnE2t1TnHg58eh534CE2999ccdvEdmu7eiwY9ONTp2SFQXIjDqLUb9pC2ajOtjrIAAAAASUVORK5CYII=" />
									</div>`
								: `<div class="pagination-arrow" onclick="displayArticle(${i - 1})">
										<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAMCAIAAAA21aCOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACHSURBVChTY/iPBl7d///tI5SNBFDV3T39v97q/9snUC4SQFIHVJQj+z9XDq86iKIoBrzq4IrwqUNWhBU1WAN9xvB/Q+v/aCZ0OWQEVff3z/819QilacL/d07+f2QpAl3a9f/PL7D7kJUS8C9cKQF1QABRmidPSB0QAJXum/3//TMoFw7+/wcANKWEpVV2aEkAAAAASUVORK5CYII=" />
									</div>`
							}
							${i+1} от ${state.articles.length}
							${i === array.length - 1
								? `<div class="pagination-arrow disabled">
										<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAMCAIAAAA21aCOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACOSURBVChTfZDBDgQRDEAVF9c5ufn/z3JzIEIiIpHYDjKxxu67tOWlWtBaI9+UUhhjnPNZd+iMC957rXWtddadg4fknDf17CGb+tNDVhWstcaY9zYPQgil1L9+A1w/xggppRDC2g8v8HDklFIp5XVdh//DMXAYTB7pzvvVgVW6yxE2Ngk5vOucA4BVIoR8AMXEVZoaIdXZAAAAAElFTkSuQmCC" />
									</div>`
								: `<div class="pagination-arrow" onclick="displayArticle(${i + 1})">
										<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAMCAIAAAA21aCOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAC4SURBVChTY/z//z8DMvj7m+HnNwYufigXBpigNBz8+s4wLYbh1jEoFwYw1AHB1/cMvX5oSrGpA4Ivb9GU4lAHBKhKGf9PCmc4sRLCwQJ4hBmKNzHI6uA2DwKAbj2xCkgz/r95hOH1Q4ggCPz+zrCpk+HlbRCbkYnBNYshupeBkZEBGH4o4NvH/w3W/6MY/kcz/V+Q8//3T4gwDnvhJrGwQQSwqmNEUwQCEGMR4Pvn/0eWwq2Dgv//ATjUdoRYlAiBAAAAAElFTkSuQmCC" />
									</div>`
							}
						</div>
					</div>
				`).join('')}
			</div>
		</body>

		<script>
			window.displayArticle = (index) => {
				const articles = document.querySelectorAll('[data-article-id]');

				[...articles].forEach(x => x.style.display = 'none');
				articles[index].removeAttribute('style');
			};

			window.onload = () => {
				const { remote, shell } = require('electron');

				const articles = document.querySelectorAll('[data-article-id]');

				[...articles].slice(1).forEach(x => x.style.display = 'none');

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