'use strict';

import _ from 'lodash';
import Backbone from 'backbone';
import AreaView from 'views/area';

var ImageView = AreaView.extend({
  className: AreaView.prototype.className + ' image',
  tagName: 'div',

  // @Override
  _initView: function() {
    AreaView.prototype._initView.apply(this, arguments);
    this.$img = $('<img>');
    this.updateSrc();

    this.$el.append(this.$img);

    this.listenTo(this.model, 'change:src', this.updateSrc, this);
  },

  // @Override
  onDomAttach: function() {
    AreaView.prototype.onDomAttach.apply(this, arguments);
    this.model.onLoad();
  },

  updateSrc: function() {
    this.$img.attr('src', this.model.get('src'));
  }
});

export default ImageView;
