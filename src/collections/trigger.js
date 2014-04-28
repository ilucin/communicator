(function() {
  'use strict';

  Communicator.Collections.Trigger = Backbone.Collections.extend({
    model: Communicator.Triggers.Abstract
  });
})();