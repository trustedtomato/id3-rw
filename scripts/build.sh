#!/usr/bin/env bash

# cd into id3-rw's root directory
cd "$(dirname "$0")"
cd ..

wasm-pack build --out-dir 'package/wasm' --release