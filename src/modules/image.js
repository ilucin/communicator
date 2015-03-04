'use strict';

Communicator.Modules.Image = Communicator.Modules.Area.extend({
  defaults: function() {
    var defaults = {
      keepAspectRatio: false
    };
    return _.defaults(defaults, Communicator.Modules.Area.prototype.defaults.call(this));
  }
});
