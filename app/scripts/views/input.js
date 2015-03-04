'use strict';

import _ from 'lodash';
import Backbone from 'backbone';
import AreaView from 'views/area';

var InputView = AreaView.extend({
  className: AreaView.prototype.className + ' input',
  tagName: 'input',
  events: _.defaults({
    'change': 'onChange'
  }, AreaView.prototype.events),

  // @Override
  _initView: function() {
    AreaView.prototype._initView.call(this);
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

export default InputView;
