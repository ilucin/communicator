'use strict';

var _ = require('lodash');
import AbstractTrigger from 'old/triggers/abstract';

var SwipeTrigger = AbstractTrigger.extend({
  _getSourceModuleFromContainer: function(container) {
    return container.getChildById(this.get('sourceModuleId'));
  },

  _getEventName: function() {
    return 'swipe';
  }
});

export default SwipeTrigger;
