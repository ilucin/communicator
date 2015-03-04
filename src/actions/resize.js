'use strict';

Communicator.Actions.Resize = Communicator.Actions.Abstract.extend({
  getParams: function() {
    return this.get('size');
  },

  toJSON: function() {
    return _.defaults({
      size: this.get('size').toJSON()
    }, Communicator.Actions.Abstract.prototype.toJSON.call(this));
  },

  onBeforeAddTargetId: function(targetId) {
    return targetId.length > 0;
  }
});
