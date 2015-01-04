define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/status.html',
    'views/status'
], function ($, _, Backbone, App, template) {

    return Backbone.View.extend({
        template: _.template(template),

        el: '#footer',

        events: {
            'click #clear-completed': 'clearCompleted'
        },

        initialize: function () {
            _.bindAll(this, 'render');
            this.collection.on('all', this.render);
            this.render();
        },

        render: function () {
            var completed = this.collection.completed().length;
            var remaining = this.collection.remaining().length;
            if (this.collection.length) {
                this.$el.show();

                this.$el.html(this.template({
                    completed: completed,
                    remaining: remaining
                }));

                this.$('#filters li a')
                    .removeClass('selected')
                    .filter('[href="#' + (App.TodoFilter || '') + '"]')
                    .addClass('selected');
            } else {
                this.$el.hide();
            }
        },

        clearCompleted: function (e) {
            e.preventDefault();
            _.each(this.collection.completed(), function (model) {
                model.destroy();
            });
        }
    });
});
