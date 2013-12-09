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
            'keypress #new-todo': 'createOnEnter',
            'click #header h1': 'connClose',
            'click #toggle-all': 'toggleAllComplete'
        },

        initialize: function () {
            _.bindAll(this, 'render', 'addOne', 'filterAll', 'createOnEnter', 'toggleAllComplete', 'toggleAllCompleteChecked', 'connClose');
            this.collection.on('add', this.addOne);
            this.collection.on('filter', this.filterAll);
            this.collection.on('change', this.toggleAllCompleteChecked);
            this.render();
            this.$input = this.$('#new-todo');
            this.allCheckbox = this.$('#toggle-all')[0];
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
            this.$('#todo-list').prepend(itemView.el);
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

            App.createTodo({title: value});
            this.$input.val('');
        },

        toggleAllCompleteChecked: function (){
            this.allCheckbox.checked = !this.collection.remaining().length;
        },

        toggleAllComplete: function (){
            var completed = this.allCheckbox.checked;

            this.collection.each(function (model) {
                model.set({
                    "completed": completed
                });
                App.updateTodo(model);
            });
        },

        connClose: function (){
            App.conn.close();
        }
    });
});
