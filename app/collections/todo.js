define([
    'jquery',
    'underscore',
    'backbone',
    'models/todo'
], function($, _, Backbone, TodoModelClass) {

    return Backbone.Collection.extend({
        model: TodoModelClass,

        completed: function () {
            return this.filter(function (model) {
                return model.get('completed');
            });
        },

        remaining: function () {
            return this.without.apply(this, this.completed());
        }
    });
});
