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
                if (model.get("from_server") === undefined) {
                    App.conn.send(JSON.stringify(model.toJSON()));
                } else {
                    model.unset("from_server", {silent: true});
                }
            })
        }
    });

    var start = function () {
        App.conn = new WebSocket("ws://" + App.params.todoWebSocketHost + ":" + App.params.todoWebSocketPort);

        App.conn.onopen = function () {
            App.online = true;
            /**
             * On reconnect we must sync all models changed offline
             * That why on app load we have duplicate syncs
             */
            App.TodoCollection.fetch();
        };

        App.conn.onmessage = function (e) {
            var message = $.parseJSON(e.data),
                model = App.TodoCollection.get(message.id);

            message.from_server = true;
            if (model === undefined) {
                if (message.deleted_at === undefined) {
                    App.TodoCollection.create(message);
                }
            } else if (message.deleted_at !== undefined) {
                model.set(message);
                model.destroy();
            } else if (model.get("updated_at") < message.updated_at) {
                model.set(message);
                model.save();
            } else {
                /**
                 * If model.get("updated_at") bigger then message.updated_at
                 * we need send this model to others clients
                 */
                model.save();
            }
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
