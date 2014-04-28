/* Abstract Trigger */
/* Deps: Communicator.Triggers.Abstract, Communicator.Helpers */

(function() {
  'use strict';

  Communicator.Triggers.Drop = Communicator.Triggers.Abstract.extend({

    _getSourceModuleFromContainer: function(container) {
      return container.getChildById(this.get('sourceModuleId'));
    },

    _getEventName: function() {
      return 'drop';
    },

    _onBeforeEvent: function(droppedModuleId) {
      return this.get('droppedModuleId') === droppedModuleId;
    }

  });
})();