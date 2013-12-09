define([
    'jquery',
    'underscore',
    'backbone',
    'app'
], function($, _, Backbone, App) {

    return Backbone.Model.extend({
        defaults: {
            "completed": false,
            "sync":false
        },

        initialize: function () {
            this.setTimestamp();
        },

        toggle: function () {
            this.set({completed: !this.get('completed')});
            App.updateTodo(this);
        },

        setTimestamp: function() {
            if(this.id) {
                this.set({"timestamp": parseInt(this.id.slice(0, 8), 16) * 1000});
            }
        }
    });
});
