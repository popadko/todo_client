// Define jQuery as AMD module
define.amd.jQuery = true;

define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'router',
    'views/app',
    'collections/todo',
    'models/todo'
], function ($, _, Backbone, App, Router, AppViewClass, TodoCollectionClass, TodoModelClass) {

    App.TodoCollection = new TodoCollectionClass();

    App.Router = new Router();
    Backbone.history.start();
    new AppViewClass({
        collection: App.TodoCollection
    });

    App.todoCreate = function ($data) {
        var newModel = new TodoModelClass($data);
        newModel.save();
    };

    App.conn = new WebSocket(App.params.webSocketUrl);

    App.conn.onopen = function () {
        console.log('WebSocket connection open');
    };

    App.conn.onmessage = function (e) {
        var message = $.parseJSON(e.data);
        switch (message.type) {
            case 'delete':
                var model = App.TodoCollection.get(message.data.id);
                if (model !== undefined) {
                    model.trigger('destroy', model, App.TodoCollection);
                }
                break;
            case 'create':
            case 'update':
                var model = App.TodoCollection.get(message.data.id);
                if (model === undefined) {
                    App.TodoCollection.add(message.data);
                } else {
                    model.set(message.data);
                }
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
            App.conn.send(JSON.stringify({"type": method, "data": model.toJSON()}));
        };

        var update = function () {
            App.conn.send(JSON.stringify({"type": method, "data": model.toJSON()}));
        };

        var destroy = function () {
            App.conn.send(JSON.stringify({"type": method, "data": model.toJSON()}));
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
