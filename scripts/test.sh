#!/usr/bin/env bash

# cd into id3-rw's root directory
cd "$(dirname "$0")"
cd ..

./build.sh
cd www
npm run test:ci