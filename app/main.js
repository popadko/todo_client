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
    App.syncDeleted = function() {
        var data = App.TodoCollection.toJSON();
        _.each(data, function(item) {
            if(item.sync === false)
            {
                App.TodoCollection.get(item.id).destroy();
            }
        });
    }
    App.goOnline = function() {
        App.online = true;
        var data = App.TodoCollection.toJSON();
        _.each(data, function(item) {
            var action = item.changed;
            if(action) {
                switch(action) {
                    case 'created':
                        App.TodoCollection.get(item.id).destroy();
                        delete item.changed;
                        delete item.id;
                        App.createTodo(item);
                        break;
                    case 'deleted':
                        App.deleteTodo(App.TodoCollection.get(item.id));
                        break;
                    case 'updated':
                        var model = App.TodoCollection.get(item.id);
                        App.updateTodo(model);
                        break;
                }
            }
        });
    }
    App.goOffline = function(callback) {
        App.online = false;
        App.TodoCollection.each(function(model) {
            model.save({"sync":false},{silent: true});
        })
        if(callback !== undefined) {
            callback();
        }
    }

    App.createTodo = function (data) {
        data.update = (new Date()).getTime();
        if (App.online) {
            var tmp = new App.TodoCollection.model(data)
            App.conn.send(JSON.stringify({"type": 'create', "data": tmp.toJSON()}));
        } else {
            data.changed = 'created';
            App.TodoCollection.create(data);
        }
    }

    App.deleteTodo = function (model) {
        if (App.online) {
            App.conn.send(JSON.stringify({"type": 'delete', "data": {id: model.id}}));
            model.destroy();
        } else {
            var action = model.get('changed');
            if(action !== undefined) {
                model.destroy();
            } else {
                data = {};
                data.changed = 'deleted';
                model.save(data);
                model.trigger('destroy');
            }

        }
    }

    App.updateTodo = function (model) {
        var action = model.get('changed');
        if(action === undefined) {
            model.set({"update": (new Date()).getTime()});
        } else {
            model.unset('changed', {"silent": true});
        }
        if (App.online) {
            App.conn.send(JSON.stringify({"type": 'update', "data": model.toJSON()}));
        } else {
            model.set({"update": (new Date()).getTime()});
            model.set({"changed": 'updated'});
        }
        model.save();
    }

    var start = function () {
        App.conn = new WebSocket(App.params.webSocketUrl);

        App.conn.onopen = function () {
            App.goOnline();

        };

        App.conn.onmessage = function (e) {
            var message = $.parseJSON(e.data);
            switch (message.type) {
                case 'delete':
                    var model = App.TodoCollection.get(message.data.id);
                    if (model !== undefined) {
                        model.destroy();
                    }
                    break;
                case 'create':
                case 'update':
                    var model = App.TodoCollection.get(message.data.id);
                    message.data.sync = true;
                    if (model === undefined) {
                        App.TodoCollection.create(message.data);
                    } else {
                        model.save(message.data);
                    }
                    break;
                case 'open':
                    App.syncDeleted();
                    return;
                default:
                    return;
            }
        };

        App.conn.onerror = function (error) {
            console.error(error);
            App.conn.close();
        };
        App.conn.onclose = function () {
            App.goOffline();
            setTimeout(function () {
                start()
            }, 10000);
        };
    }
    App.TodoCollection.fetch({success: function () {
        App.goOffline(start);
    }})
});
