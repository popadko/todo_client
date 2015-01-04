// Define jQuery as AMD module
define.amd.jQuery = true;

define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'router',
    'views/app',
    'collections/todo'
], function ($, _, Backbone, App, Router, AppViewClass, TodoCollectionClass) {

    App.TodoCollection = new TodoCollectionClass();

    App.Router = new Router();
    Backbone.history.start();

    new AppViewClass({
        collection: App.TodoCollection
    });

    App.online = false;

    App.TodoCollection.on('sync', function (model) {
        if (App.online) {
            if (!model.models) {
                item = {};
                item.models = [model];
                model = item;
            }
            _.each(model.models, function (model) {
                App.conn.send(JSON.stringify(model.toJSON()));
            })
        }
    });

    var start = function () {
        App.conn = new WebSocket("ws://" + App.params.todoWebSocketHost + ":" + App.params.todoWebSocketPort);

        App.conn.onopen = function () {
            //App.online = true;
        };

        App.conn.onmessage = function (e) {
            //var message = $.parseJSON(e.data);
        };

        App.conn.onerror = function (error) {
            console.error(error);
            App.conn.close();
        };
        App.conn.onclose = function () {
            App.online = false;
            setTimeout(function () {
                start();
            }, App.params.todoWebSocketReconnectTimeout);
        };
    };
    App.TodoCollection.fetch({
        success: function () {
            start();
        }
    })
});
