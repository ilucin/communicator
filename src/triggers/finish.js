/* Abstract Trigger */
/* Deps: Communicator.Triggers.Abstract, Communicator.Helpers */

(function() {
  'use strict';

  Communicator.Triggers.Finish = Communicator.Triggers.Abstract.extend({

    _getSourceModuleFromContainer: function(container) {
      return container.getChildById(this.get('sourceModuleId'));
    },

    _getEventName: function() {
      return 'finish';
    }

  });
})();