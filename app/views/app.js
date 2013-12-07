define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/app.html',
    'views/status'
], function($, _, Backbone, template, StatusViewClass) {

    return Backbone.View.extend({
        el: '#todoapp',

        template: _.template(template),

        initialize: function () {
            _.bindAll(this,'render');
            this.render();
        },

        render: function() {
            this.$el.html(this.template({}));
            var statusView = new StatusViewClass({
                collection: this.collection
            });
            this.$('#footer').html(statusView.el);
        }
    });
});
