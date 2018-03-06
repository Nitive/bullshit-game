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
	export PUBLIC_PATH = /public/
endif

ifndef NODE_ENV
	export NODE_ENV = development
endif

export ROOT = $(shell pwd)

clean:
	rm -rf $$ASSETS_FOLDER
	rm -rf $$STATS_PATH
	rm -rf $$BUILD_FOLDER

build-client:
	npx webpack --config ./modules/build/webpack.client.ts --mode=$$NODE_ENV

watch:
	npx webpack --config ./modules/build/webpack.client.ts --mode=$$NODE_ENV --watch

build-server:
	npx webpack --config ./modules/build/webpack.server.ts --mode=$$NODE_ENV

prerender: build-client build-server
	npx ts-node ./modules/prerender

lint:
	npx tslint --project . --format stylish

production: prerender
