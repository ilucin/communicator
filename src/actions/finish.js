'use strict';

Communicator.Actions.Finish = Communicator.Actions.Abstract.extend({
  defaults: function() {
    return _.defaults({
      targetIds: ['']
    }, Communicator.Actions.Abstract.prototype.defaults.call(this));
  }
});
