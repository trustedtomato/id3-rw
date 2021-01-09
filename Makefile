build:
	wasm-pack build --out-dir 'package/wasm' --release

test:
	cd www; npm run test:ci