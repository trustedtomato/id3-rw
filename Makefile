build:
	wasm-pack build --out-dir 'package/wasm' --release

test: build
	cd package; npm run test:ci
	cd www; npm run test:ci