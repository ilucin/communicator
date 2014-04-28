(function() {
  'use strict';

  Communicator.Collections.Module = Backbone.Collection.extend({
    model: Communicator.Modules.Abstract
  });
})();