BABEL = ./node_modules/.bin/babel
BROWSERIFY = ./node_modules/.bin/browserify -t babelify
ESLINT = ./node_modules/eslint/bin/eslint.js

SERVER_SRC = $(shell find src/server/ -name *.js)
CLIENT_SRC = $(shell find src/client/ -name *.js)
SHARED_SRC = $(shell find src/shared/ -name *.js)

SERVER_DST = $(SERVER_SRC:src/server/%=build/%)
SHARED_DST = $(SHARED_SRC:src/shared/%=build/shared/%)

all: server client

server: $(SERVER_DST) $(SHARED_DST)

$(SERVER_DST): $(SERVER_SRC) | build-dir
	$(BABEL) $(@:build/%=src/server/%) -o $@

$(SHARED_DST): $(SHARED_SRC) | shared-dir
	$(BABEL) $(@:build/shared/%=src/shared/%) -o $@

client: client-html client-js

client-html: build/public/index.html

client-js: build/public/application.js build/public/vendor/

build/public/index.html: src/client/index.html | public-dir
	cp $< $@

build/public/application.js: $(CLIENT_SRC) $(SHARED_SRC) | public-dir
	$(BROWSERIFY) -t babelify src/client/js/index.js -o $@

build/public/vendor/: src/client/js/vendor/ | public-dir
	cp -r $< $@

clean:
	rm -rf build/*

build-dir:
	@ mkdir -p build/

shared-dir: | build-dir
	@ mkdir -p build/shared/

public-dir: | build-dir
	@ mkdir -p build/public/

list:
	@ echo "# Shared files:"
	@ echo $(SHARED)
	@ echo "# Server files:"
	@ echo $(SERVER)

check:
	$(ESLINT) $(SERVER_SRC) $(SHARED_SRC)
