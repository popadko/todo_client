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

    App.Router = new Router();
    Backbone.history.start();
    new AppViewClass({
        collection: App.TodoCollection
    });

    App.conn = new WebSocket(App.params.webSocketUrl);

    App.conn.onopen = function() {
        console.log('WebSocket connection open');
    };

    App.conn.onmessage = function (e) {
        var message = $.parseJSON(e.data);
        switch(message.type) {
            case 'create':
                App.TodoCollection.add(message.data);
                break;
            case 'delete':
                var model = App.TodoCollection.get(message.data.id);
                model.trigger('destroy', model, App.TodoCollection);
                break;
            case 'update':
                var model = App.TodoCollection.get(message.data.id);
                model.set(message.data);
                break;
            default:
                return;
        }
    };

    App.conn.onerror = function (error) {
        console.error(error);
    };
    App.conn.onclose = function () {
        console.log('WebSocket connection close');
    };

    Backbone.sync = function (method, model, options) {
        var read = function () {
            //read operation will be ignored
        };

        var create = function () {
            App.conn.send(JSON.stringify({"type":method, "data":model.toJSON()}));
        };

        var update = function () {
            App.conn.send(JSON.stringify({"type":method, "data":model.toJSON()}));
        };

        var destroy = function () {
            App.conn.send(JSON.stringify({"type":method, "data":model.toJSON()}));
        };

        switch (method) {
            case 'create':
                create();
                break;
            case 'read':
                read();
                break;
            case 'update':
                update();
                break;
            case 'delete':
                destroy();
                break;
        }
    };
});
