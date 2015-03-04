'use strict';

import _ from 'lodash';
import Backbone from 'backbone';
import AreaView from 'views/area';

var TextView = AreaView.extend({
  className: AreaView.prototype.className + ' text',

  // @Override
  _initView: function() {
    AreaView.prototype._initView.call(this);
    this.listenTo(this.model, 'change:value', this.updateValue);
    this.updateValue();
  },

  updateValue: function() {
    this.$el.html(this.model.get('value'));
  },

  // @Override
  onDomAttach: function() {
    AreaView.prototype.onDomAttach.call(this);
    this.model.onLoad();
  }
});

export default TextView;
