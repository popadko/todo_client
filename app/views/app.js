define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/app.html',
    'views/status',
    'views/item'
], function ($, _, Backbone, template, StatusViewClass, ItemViewClass) {

    return Backbone.View.extend({
        el: '#todoapp',

        template: _.template(template),

        initialize: function () {
            _.bindAll(this, 'render', 'addOne', 'filterAll');
            this.collection.on('add', this.addOne);
            this.collection.on('filter', this.filterAll);
            this.render();
        },

        render: function () {
            this.$el.html(this.template({}));
            var statusView = new StatusViewClass({
                collection: this.collection
            });
            this.$('#footer').html(statusView.el);
        },

        addOne: function (model) {
            var itemView = new ItemViewClass({
                model: model
            });
            this.$('#todo-list').append(itemView.el);
        },

        filterAll: function () {
            this.collection.each(this.filterOne, this);
        },

        filterOne: function (item) {
            item.trigger('visible');
        }
    });
});
