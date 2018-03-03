clean:
	rm -rf dist/

build-scripts:
	cd modules/build && npx webpack --mode=development
