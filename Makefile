ifndef BUILD_FOLDER
	export BUILD_FOLDER = public
endif

ifndef ASSETS_FOLDER
	export ASSETS_FOLDER = $(BUILD_FOLDER)/dist
endif

ifndef STATS_PATH
	export STATS_PATH = $(ASSETS_FOLDER)/stats.json
endif


ifndef PUBLIC_PATH
	export PUBLIC_PATH = /
endif

ifndef ASSETS_PATH
	export ASSETS_PATH = $(PUBLIC_PATH)dist/
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
	npx webpack --config ./modules/build/webpack.client.ts

watch:
	npx webpack --config ./modules/build/webpack.client.ts --watch

build-server:
	npx webpack --config ./modules/build/webpack.server.ts

dev-server:
	node -r ts-node/register ./modules/build/dev-server

prerender: build-client build-server
	node -r ts-node/register ./modules/prerender

lint:
	npx tslint --project . --format stylish

production: prerender
