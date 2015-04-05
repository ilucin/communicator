'use strict';

var _ = require('lodash');
import AbstractTrigger from 'old/triggers/abstract';

var DropTrigger = AbstractTrigger.extend({
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

export default DropTrigger;
