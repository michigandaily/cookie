gh-pages: SITE = $(shell python3 -c "import json; print(json.load(open('config.json'))['deployment']['url']);")
gh-pages: REPO = $(shell basename -s .git `git remote get-url origin`)
gh-pages: PAGES = "https://github.com/MichiganDaily/$(REPO)/settings/pages"
gh-pages:
	rm -rf dist .parcel-cache
	git worktree add --detach dist
	(cd dist; git checkout --orphan gh-pages)
	(cd dist; git reset --hard)
	(cd dist; git pull -s ours --no-edit origin gh-pages --allow-unrelated-histories || echo "Could not pull from origin.")
	yarn run parcel build --no-scope-hoist src/index.html src/graphic/*.html --public-url /$(REPO)
	(cd dist; git add --all)
	(cd dist; git commit -m "Build output as of $(shell git log '--format=format:%H' main -1)" || echo "No changes to commit.")
	(cd dist; git push -u origin gh-pages)
	git worktree remove dist
	git branch -D gh-pages
	@echo "🔐 \033[93mRemember to enforce HTTPS in the repository settings at $(PAGES)\033[0m"
	@echo "🍪 \033[1mAfter enforcement, your graphic will be deployed at\033[0m \033[1;96m$(SITE)/$(REPO)\033[0m"

aws: KEY = $(shell python3 -c "import json; print(json.load(open('config.json'))['deployment']['key']);")
aws:
	yarn run parcel build --no-scope-hoist src/index.html src/graphic/*.html --public-url /$(KEY)
	yarn run sink deploy aws