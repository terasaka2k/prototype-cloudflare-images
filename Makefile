.PHONY: run
run: node_modules/.package-lock.json
	npm run dev


node_modules/.package-lock.json:
	npm ci
