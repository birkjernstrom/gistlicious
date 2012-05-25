==.git/config==

[remote "heroku"]
	url = git@heroku.com:high-summer-3434.git
	fetch = +refs/heads/*:refs/remotes/heroku/*

==Deploy==

git push heroku master
