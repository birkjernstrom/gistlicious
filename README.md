==.git/config==

[remote "heroku"]
	url = git@heroku.com:stark-leaf-7940.git
	fetch = +refs/heads/*:refs/remotes/heroku/*

==Deploy==

git push heroku master
