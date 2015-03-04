'use strict';

Communicator.Triggers.Active = Communicator.Triggers.Abstract.extend({

  _getSourceModuleFromContainer: function(container) {
    return container.getChildById(this.get('sourceModuleId'));
  },

  _getEventName: function() {
    return 'active';
  }
});
