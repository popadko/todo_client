define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    return Backbone.Model.extend({
        defaults: {
            completed: false
        },

        // TODO must bee save instead of set
        toggle: function () {
            this.set({
                completed: !this.get('completed')
            });
        }
    });
});
