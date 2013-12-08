define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/app.html',
    'views/status',
    'views/item'
], function ($, _, Backbone, App, template, StatusViewClass, ItemViewClass) {

    return Backbone.View.extend({
        el: '#todoapp',

        template: _.template(template),

        events: {
            'keypress #new-todo': 'createOnEnter'
        },

        initialize: function () {
            _.bindAll(this, 'render', 'addOne', 'filterAll', 'createOnEnter');
            this.collection.on('add', this.addOne);
            this.collection.on('filter', this.filterAll);
            this.render();
            this.$input = this.$('#new-todo');
        },

        render: function () {
            this.$el.html(this.template({}));
            new StatusViewClass({
                collection: this.collection
            });
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
        },

        createOnEnter: function (e) {
            var value = this.$input.val().trim();
            if (e.which !== App.ENTER_KEY || !value) {
                return;
            }

            this.collection.create({title: value});
            this.$input.val('');
        }
    });
});
