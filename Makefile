clean:
	rm -rf dist/

build-scripts:
	npx webpack --config ./modules/build/webpack.config.ts --mode=development

watch:
	npx webpack --config ./modules/build/webpack.config.ts --mode=development --watch

open:
	open dist/index.html
