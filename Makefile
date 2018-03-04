ifndef BUILD_FOLDER
	export BUILD_FOLDER = public
endif

clean:
	rm -rf dist/
	rm -rf $$BUILD_FOLDER

build-scripts:
	npx webpack --config ./modules/build/webpack.config.ts --mode=development

watch:
	npx webpack --config ./modules/build/webpack.config.ts --mode=development --watch

prerender:
	npx ts-node ./modules/prerender/index.ts

open:
	open dist/index.html

lint:
	npx tslint --project .
