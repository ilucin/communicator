'use strict';

var _ = require('lodash');
var Backbone = require('backbone');
import Position from 'old/base/position';
import Style from 'old/base/style';
import Size from 'old/base/size';
import AbstractModule from 'old/modules/abstract';

var AreaModule = AbstractModule.extend({
  defaults: function() {
    return _.defaults({
      position: new Position({
        top: 0,
        left: 0
      }),
      style: new Style(),
      size: new Size({
        width: 10,
        height: 10
      }),
      draggable: false,
      droppableArea: false,
      swipable: false,
      snapback: 0
    }, _.result(AbstractModule.prototype, 'defaults'));
  },

  isDraggable: function() {
    return !!this.get('draggable');
  },

  onActive: function() {
    this.trigger('active');
  },

  position: function(position, duration, onEnd) {
    this.get('position').set(position.toJSON());
    this.trigger('update:position', this.get('position'), duration, onEnd);
  },

  style: function(style, duration, onEnd) {
    this.get('style').set(style.toJSON());
    this.trigger('update:style', this.get('style'), duration, onEnd);
  },

  resize: function(size, duration, onEnd) {
    this.get('size').set(size.toJSON());
    this.trigger('update:size', this.get('size'), duration, onEnd);
  },

  onDrop: function(module) {
    this.trigger('drop', module.get('id'));
  },

  onSwipe: function(direction) {
    this.trigger('swipe', direction);
  }
});

export default AreaModule;
