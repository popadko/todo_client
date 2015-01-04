define([
    'jquery',
    'underscore',
    'backbone',
    'localStorage',
    'models/todo'
], function ($, _, Backbone, localStorage, TodoModelClass) {

    return Backbone.Collection.extend({
        model: TodoModelClass,

        localStorage: new Backbone.LocalStorage('todos-backbone'),

        completed: function () {
            return this.filter(function (model) {
                return model.get('completed');
            });
        },

        showed: function () {
            return this.filter(function (model) {
                return model.get('showed');
            });
        },

        remaining: function () {
            return this.filter(function (model) {
                return !model.get('completed');
            });
        }
    });
});
