'use strict';

Communicator.Actions.Invoke = Communicator.Actions.Abstract.extend({
  defaults: function() {
    return _.defaults({
      arguments: []
    }, Communicator.Actions.Abstract.prototype.defaults.call(this));
  },

  getParams: function() {
    return this.get('method');
  }
});
