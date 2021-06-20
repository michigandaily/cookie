init:
	rm -rf .git/
	@echo "Installing dependencies..."
	yarn install -D
	@echo "Installing Makefile..."
	mv Makefile.project Makefile
	@echo "Setting up GH Pages deployment"
	git init
	git add .
	git commit -m "Initial Commit"
	git worktree add -b gh-pages dist
