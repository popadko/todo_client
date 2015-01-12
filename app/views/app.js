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
            var showed = this.collection.showed();
            console.log(showed.length);
            if (showed.length === 0) {
                this.$('#todo-list').append(itemView.el);
            } else {
                var modelTo = showed[0];
                var isAfter = true;
                _.each(showed, function (modelShowed) {
                    var timestamp = modelShowed.get('created_at');
                    if (model.get('created_at') >= timestamp && timestamp >= modelTo.get('created_at')) {
                        modelTo = modelShowed;
                        isAfter = false;
                    }
                });
                var selector = "li[data-id='" + modelTo.id + "']";
                if (isAfter) {
                    itemView.$el.insertAfter(this.$(selector));
                } else {
                    itemView.$el.insertBefore(this.$(selector));
                }
            }
            model.set({"showed": true});
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
        },

        toggleAllCompleteChecked: function () {
            this.allCheckbox.checked = !this.collection.remaining().length;
        },

        toggleAllComplete: function () {
            var completed = this.allCheckbox.checked;

            this.collection.each(function (model) {
                model.set({
                    "completed": completed
                });
                model.save();
            });
        },

        connClose: function () {
            App.conn.close();
        }
    });
});
