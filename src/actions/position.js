'use strict';

Communicator.Actions.Position = Communicator.Actions.Abstract.extend({
  defaults: function() {
    return _.defaults({
      position: new Communicator.Base.Position({
        top: 0,
        left: 0
      })
    }, _.result(Communicator.Actions.Abstract.prototype, 'defaults'));
  },

  getParams: function() {
    return this.get('position');
  },

  start: function() {
    Communicator.Actions.Abstract.prototype.start.call(this);
  },

  toJSON: function() {
    return _.defaults({
      position: this.get('position').toJSON()
    }, Communicator.Actions.Abstract.prototype.toJSON.call(this));
  },

  onBeforeAddTargetId: function(targetId) {
    return targetId.length > 0;
  }
});
