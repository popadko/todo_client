#!/bin/sh
./node_modules/bower/bin/bower install
node ./node_modules/requirejs/bin/r.js -o ./optimize/config.js
rm -r app/
mv app_build/ app/