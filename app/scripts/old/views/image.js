'use strict';

var _ = require('lodash');
var Backbone = require('backbone');
import AreaView from 'old/views/area';

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
