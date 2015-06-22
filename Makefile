BABEL = ./node_modules/.bin/babel
BROWSERIFY = ./node_modules/.bin/browserify -t babelify

CLIENT_JS = $(shell find src/client/js/ -name "*.js")
CLIENT_CSS = $(shell find src/client/css/ -name "*.css")

all: server client

server: build/index.js

client: build/index.html build/application.js

build/index.js: src/index.js build/shared/
	$(BABEL) $< > $@

build/shared/: src/shared/
	cp -r $< $@


build/application.js: $(CLIENT_JS) build/vendor/playground.js
	$(BROWSERIFY) src/client/js/index.js -o $@

build/index.html: src/client/index.html
	cp $< $@

build/vendor/playground.js: src/client/js/vendor/playground.js
	mkdir -p build/vendor
	cp $< $@
