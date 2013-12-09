define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    return Backbone.Model.extend({
        defaults: {
            completed: false
        },

        initialize: function () {
            this.setTimestamp();
        },

        toggle: function () {
            this.save({
                completed: !this.get('completed')
            });
        },

        setTimestamp: function() {
            if(this.id) {
                this.set({"timestamp": parseInt(this.id.slice(0, 8), 16) * 1000});
            }
        }
    });
});
