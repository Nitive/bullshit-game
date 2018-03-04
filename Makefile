ifndef BUILD_FOLDER
	export BUILD_FOLDER = public
endif

ifndef ASSETS_PATH
	export ASSETS_PATH = /dist/
endif

ifndef ASSETS_FOLDER
	export ASSETS_FOLDER = dist
endif

ifndef STATS_PATH
	export STATS_PATH = dist/stats.json
endif


ifndef PUBLIC_PATH
	export PUBLIC_PATH = /
endif

export ROOT = $(shell pwd)

clean:
	rm -rf $$ASSETS_FOLDER
	rm -rf $$STATS_PATH
	rm -rf $$BUILD_FOLDER

build-scripts:
	npx webpack --config ./modules/build/webpack.config.ts --mode=development

watch:
	npx webpack --config ./modules/build/webpack.config.ts --mode=development --watch

prerender: build-scripts
	npx ts-node ./modules/prerender

lint:
	npx tslint --project .
