BABEL = ./node_modules/.bin/babel
BROWSERIFY = ./node_modules/.bin/browserify -t babelify

CLIENT_JS = $(shell find src/client/js/ -name "*.js")
CLIENT_CSS = $(shell find src/client/css/ -name "*.css")
SHARED = $(shell find src/shared/)

all: server client

server: build/index.js

client: build/index.html build/application.js

build/index.js: src/index.js $(SHARED)
	$(BABEL) $< > $@

build/shared/: $(SHARED)
	rsync -ah src/shared/ $@

build/application.js: $(CLIENT_JS) build/vendor/playground.js build/shared/
	$(BROWSERIFY) src/client/js/index.js -o $@

build/index.html: src/client/index.html
	cp $< $@

build/vendor/playground.js: src/client/js/vendor/playground.js
	mkdir -p build/vendor
	cp $< $@

clean:
	rm -rf build/*
