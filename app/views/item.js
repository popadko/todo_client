define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/item.html'
], function ($, _, Backbone, App, template) {

    return Backbone.View.extend({
        template: _.template(template),

        tagName: 'li',

        events: {
            'click .toggle': 'toggleCompleted'
        },

        initialize: function () {
            _.bindAll(this, 'render', 'toggleVisible', 'isHidden', 'toggleCompleted');
            this.model.on('change', this.render);
            this.model.on('visible', this.toggleVisible);
            this.model.on('change:completed', this.toggleVisible);
            this.render();
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('completed', this.model.get('completed'));
            this.toggleVisible();
        },

        toggleVisible: function () {
            this.$el.toggleClass('hidden', this.isHidden());
        },

        isHidden: function () {
            var isCompleted = this.model.get('completed');
            return (// hidden cases only
                (!isCompleted && App.TodoFilter === 'completed') ||
                    (isCompleted && App.TodoFilter === 'active')
                );
        },

        toggleCompleted: function () {
            this.model.toggle();
        }
    });
});
