'use strict';

Communicator.Views.Input = Communicator.Views.Area.extend({
  className: Communicator.Views.Area.prototype.className + ' input',
  tagName: 'input',
  events: _.defaults({
    'change': 'onChange'
  }, Communicator.Views.Area.prototype.events),

  // @Override
  _initView: function() {
    Communicator.Views.Area.prototype._initView.call(this);
    this.$el.val(this.model.get('value'));
    this.listenTo(this.model, 'change:inputType', this.updateInputType);
    this.listenTo(this.model, 'change:placeholder', this.updatePlaceholder);
    this.updateInputType();
    this.updatePlaceholder();
  },

  updateValue: function() {
    this.$el.val(this.model.get('value'));
  },

  updateInputType: function() {
    this.$el.attr('type', this.model.get('inputType'));
  },

  updatePlaceholder: function() {
    this.$el.attr('placeholder', this.model.get('placeholder'));
  },

  onChange: function() {
    this.model.set('value', this.$el.val());
  }
});
