(function() {
  'use strict';

  Communicator.Triggers.Event = Communicator.Triggers.Abstract.extend({

    _getSourceModuleFromContainer: function(container) {
      return container.getChildById(this.get('sourceModuleId'));
    },

    _getEventName: function() {
      return this.get('event');
    }

  });
})();