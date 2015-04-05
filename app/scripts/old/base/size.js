'use strict';

var Backbone = require('backbone');
import H from 'old/components/helpers';

var Size = Backbone.Model.extend({
  defaults: {
    width: '0%',
    height: '0%'
  },

  initialize: function(attributes) {
    H.checkProperties(attributes, ['width', 'height']);
    this.clear({
      silent: true
    });
    this.setWidth(attributes.width);
    this.setHeight(attributes.height);
  },

  setWidth: function(width) {
    this._width = parseFloat(width, 10);
    this.set('width', this._width + '%');
    return this;
  },

  setHeight: function(height) {
    this._height = parseFloat(height, 10);
    this.set('height', this._height + '%');
    return this;
  },

  getWidthValue: function() {
    return this._width;
  },

  getHeightValue: function() {
    return this._height;
  }
});

export default Size;
