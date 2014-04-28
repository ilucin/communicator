(function() {
  'use strict';

  Communicator.Triggers.ActionEnd = Communicator.Triggers.Abstract.extend({

    _getSourceModuleFromContainer: function(container) {
      return container.getActionById(this.get('sourceModuleId'));
    },

    _getEventName: function() {
      return 'end';
    },

    _onBeforeEvent: function(action) {
      return this.get('sourceModuleId') === action.get('id');
    }

  });
})();