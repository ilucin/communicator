'use strict';

Communicator.Triggers.ActionStart = Communicator.Triggers.Abstract.extend({

  _getSourceModuleFromContainer: function(container) {
    return container.getActionById(this.get('sourceModuleId'));
  },

  _getEventName: function() {
    return 'start';
  },

  _onBeforeEvent: function(action) {
    return this.get('sourceModuleId') === action.get('id');
  }
});
