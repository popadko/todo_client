// Define jQuery as AMD module
define.amd.jQuery = true;

define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'router',
    'views/app',
    'collection/todo'
], function ($, _, Backbone, App, Router, AppViewClass, TodoCollectionClass) {

    App.TodoCollection = new TodoCollectionClass({"id": 2, "title": 'test'});
    new AppViewClass({
        collection: App.TodoCollection
    });

    App.Router = new Router();
    Backbone.history.start();
});
