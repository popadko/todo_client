define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    return Backbone.Model.extend({
        defaults: {
            "showed": false,
            "completed": false
        },

        initialize: function () {
            this.set({"showed": false});
        },

        save: function(attributes, options) {
            attributes || (attributes = {});
            if (this.isNew()) {
                attributes['created_at'] = (new Date()).getTime();
            }
            /**
             *
             * todo: don't update this timestamp on silent: true
             */
            attributes['updated_at'] = (new Date()).getTime();
            Backbone.Model.prototype.save.call(this, attributes, options);
        },

        destroy: function(options) {
            this.set({"deleted_at": (new Date()).getTime()});
            Backbone.Model.prototype.destroy.call(this, options);
        },

        toggle: function () {
            this.set({completed: !this.get('completed')});
            this.save();
        }
    });
});
