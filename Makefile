install:
	cd client && yarn
	cd server && ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/" yarn --registry https://registry.npm.taobao.org
	npx electron-builder install-app-deps

dev-app:
	rm -rf build
	cd server && yarn start

dev-ng:
	cd client && yarn start

build-only:
	rm -rf dist
	rm -rf build
	cd client && ng build -c production
	cd server && yarn postinstall:electron && yarn electron:build

build-local: build-only
	yarn start:local

build-mac: build-only
	npx electron-builder ../build --mac

build-win: build-only
	npx electron-builder ../build --windows