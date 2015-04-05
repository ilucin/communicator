'use strict';

var _ = require('lodash');
var Backbone = require('backbone');
import AbstractAction from 'old/actions/abstract';
import Position from 'old/base/position';

var PositionAction = AbstractAction.extend({
  defaults: function() {
    return _.defaults({
      position: new Position({
        top: 0,
        left: 0
      })
    }, _.result(AbstractAction.prototype, 'defaults'));
  },

  getParams: function() {
    return this.get('position');
  },

  start: function() {
    AbstractAction.prototype.start.call(this);
  },

  toJSON: function() {
    return _.defaults({
      position: this.get('position').toJSON()
    }, AbstractAction.prototype.toJSON.call(this));
  },

  onBeforeAddTargetId: function(targetId) {
    return targetId.length > 0;
  }
});

export default PositionAction;
