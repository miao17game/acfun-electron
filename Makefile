install:
	cd client && yarn
	cd server && ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/" yarn --registry https://registry.npm.taobao.org
	npx electron-builder install-app-deps

dev-server:
	rm -rf build
	cd server && yarn start

dev-client:
	cd client && yarn start

build-client:
	rm -rf dist
	cd client && ng build --prod

build-client-dev:
	rm -rf dist
	cd client && ng build -c dev

build-server:
	rm -rf build
	cd server && yarn postinstall:electron && yarn electron:build

build-only: build-client build-server

build-dev-only: build-client-dev build-server

run-local:
	yarn start:local

start-local: build-only run-local

build-mac: build-only
	npx electron-builder build --mac

build-win: build-only
	npx electron-builder build --windows