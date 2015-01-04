define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    return Backbone.Model.extend({
        defaults: {
            "showed": false,
            "completed": false,
            "sync": false
        },

        initialize: function () {
            this.set({"showed": false});
            this.setTimestamp();
        },

        save: function(attributes, options) {
            attributes || (attributes = {});
            if (this.isNew) {
                attributes['created_at'] = (new Date()).getTime();
            }
            attributes['updated_at'] = (new Date()).getTime();
            Backbone.Model.prototype.save.call(this, attributes, options);
        },

        toggle: function () {
            this.set({completed: !this.get('completed')});
            this.save();
        },

        setTimestamp: function () {
            if (this.id) {
                this.set({"timestamp": this.get("create") * 1000});
            } else {
                this.set({"timestamp": (new Date()).getTime()});
            }

        }
    });
});
