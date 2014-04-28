(function() {
  'use strict';

  Communicator.Collections.Action = Backbone.Collection.extend({
    model: Communicator.Actions.Abstract
  });
})();