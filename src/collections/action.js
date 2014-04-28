(function() {
  'use strict';

  Communicator.Collections.Action = Backbone.Collections.extend({
    model: Communicator.Actions.Abstract
  });
})();