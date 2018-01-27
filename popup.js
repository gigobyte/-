const moment = require('moment')

const trimContent = content => content.substring(0, 180).trim() + '...'
const formatDate = date => moment(date).format('DD.MM.YYYY')
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
				cursor: pointer;
				padding: 0 5px;
				color: #ff5a00;
			}

			.pagination-arrow-disabled {
				cursor: not-allowed;
				padding: 0 5px;
				color: lightgrey;
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
								? `<div class="pagination-arrow-disabled">🠈</div>`
								: `<div class="pagination-arrow" onclick="displayArticle(${i - 1})">🠈</div>`
							}
							${i+1} от ${state.articles.length}
							${i === array.length - 1
								? `<div class="pagination-arrow-disabled">🠊</div>`
								: `<div class="pagination-arrow" onclick="displayArticle(${i + 1})">🠊</div>`
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