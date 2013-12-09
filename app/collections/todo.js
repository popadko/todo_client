define([
    'jquery',
    'underscore',
    'backbone',
    'localStorage',
    'models/todo'
], function($, _, Backbone, localStorage, TodoModelClass) {

    return Backbone.Collection.extend({
        model: TodoModelClass,

        localStorage: new Backbone.LocalStorage('todos-backbone'),

        completed: function () {
            return this.filter(function (model) {
                var changed = model.get('changed');
                if(changed !== undefined) {
                    return model.get('completed') && changed !== 'deleted';
                } else {
                    return model.get('completed');
                }
            });
        },

        remaining: function () {
            return this.filter(function (model) {
                var changed = model.get('changed');
                if(changed !== undefined) {
                    return !model.get('completed') && changed !== 'deleted';
                } else {
                    return !model.get('completed');
                }
            });
        }
    });
});
