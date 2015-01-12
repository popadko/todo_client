define([
    'jquery',
    'underscore',
    'backbone',
    'moment',
    'app',
    'text!templates/item.html'
], function ($, _, Backbone, moment, App, template) {

    return Backbone.View.extend({
        template: _.template(template),

        tagName: 'li',

        events: {
            'click .toggle': 'toggleCompleted',
            'click .destroy': 'clear',
            'dblclick label': 'edit',
            'keypress .edit': 'updateOnEnter',
            'blur .edit': 'close'
        },

        initialize: function () {
            _.bindAll(this, 'render', 'toggleVisible', 'isHidden', 'toggleCompleted', 'clear', 'edit', 'close', 'updateOnEnter');
            this.model.on('change', this.render);
            this.model.on('destroy', this.remove, this);
            this.model.on('visible', this.toggleVisible);
            this.model.on('change:completed', this.toggleVisible);
            this.render();
        },

        render: function () {
            this.$el.attr({"data-id": this.model.id});
            this.$el.html(this.template(this.model.toJSON()));
            var self = this;
            self.$('span').html(self.dateFormat(self.model.get('created_at')));
            this.timeIntervalId = setInterval(function () {
                self.$('span').html(self.dateFormat(self.model.get('created_at')));
            }, 1000);
            this.$el.toggleClass('completed', this.model.get('completed'));
            this.toggleVisible();
            this.$input = this.$('.edit');
        },

        toggleVisible: function () {
            this.$el.toggleClass('hidden', this.isHidden());
        },

        isHidden: function () {
            var isCompleted = this.model.get('completed');
            // hidden cases only
            return ((!isCompleted && App.TodoFilter === 'completed') || (isCompleted && App.TodoFilter === 'active'));
        },

        toggleCompleted: function () {
            this.model.toggle();
        },

        edit: function () {
            this.$el.addClass('editing');
            this.$input.focus();
        },

        close: function () {
            var trimmedValue = this.$input.val().trim();
            this.$input.val(trimmedValue);

            if (trimmedValue) {
                this.model.set({"title": trimmedValue});
                this.model.save();
            } else {
                this.clear();
            }

            this.$el.removeClass('editing');
        },

        updateOnEnter: function (e) {
            if (e.which === App.ENTER_KEY) {
                this.close();
            }
        },

        clear: function () {
            clearInterval(this.timeIntervalId);
            this.model.destroy();
        },

        dateFormat: function (date, dateFormat) {
            //return date;
            var momentObj = moment(date);
            var now = moment();
            var diff = now.diff(momentObj);
            var nowDay = moment(now).startOf('day');
            if (diff > (24 * 60 * 60 * 1000 + now - nowDay) || diff < 0) {
                momentObj = moment(momentObj).format(!!dateFormat ? dateFormat : 'lll');
            }
            else if (diff > 60 * 60 * 1000) {
                momentObj = moment(momentObj).calendar();
            }
            else {
                momentObj = moment(momentObj).fromNow();
            }
            return momentObj;
        }
    });
});
