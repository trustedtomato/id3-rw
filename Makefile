build:
	wasm-pack build --out-dir 'package/wasm' --release
	cp README.md package/README.md
	cp LICENSE package/LICENSE

test: build
	cd package; npm run test:ci
	cd www; npm run test:ci

build-website:
	cd www; npm run build
	cd package; npm run generateDocs

setup:
	cd package; npm install
	cd www; npm install
	make build