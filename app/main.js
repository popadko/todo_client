// Define jQuery as AMD module
define.amd.jQuery = true;

define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'router'
], function($, _, Backbone, App, Router) {

    App.Router = new Router();
    Backbone.history.start();

});
