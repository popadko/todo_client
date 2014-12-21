// Use ECMAScript 5 Strict Mode
"use strict";

var require = {
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        underscore: '../bower_components/underscore/underscore',
        underscoreString: '../bower_components/underscore.string/lib/underscore.string',
        backbone: '../bower_components/backbone/backbone',
        text: '../bower_components/text/text',
        moment: '../bower_components/momentjs/moment',
        localStorage: '../bower_components/backbone.localStorage/backbone.localStorage'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        }
    }
};
