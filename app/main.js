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

    App.TodoCollection = new TodoCollectionClass();
    new AppViewClass({
        collection: App.TodoCollection
    });

    App.Router = new Router();
    Backbone.history.start();

    App.TodoCollection.add({"id": 1, "title": 'test1', "completed": false});
    App.TodoCollection.add({"id": 2, "title": 'test2', "completed": true});
    App.TodoCollection.add({"id": 3, "title": 'test3', "completed": false});
    App.TodoCollection.add({"id": 4, "title": 'test4', "completed": false});
    App.TodoCollection.add({"id": 5, "title": 'test5', "completed": true});
});
