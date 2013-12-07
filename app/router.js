define([
    'jquery',
    'underscore',
    'backbone',
    'app'
], function($, _, Backbone, App) {

    return Backbone.Router.extend({
        routes: {
            '*filter': 'filter'
        },

        filter: function (param) {
            App.TodoFilter = param || '';

            App.TodoCollection.trigger('filter');
        }
    });
});
