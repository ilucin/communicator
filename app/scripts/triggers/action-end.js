'use strict';

import _ from 'lodash';
import AbstractTrigger from 'triggers/abstract';

var ActionEndTrigger = AbstractTrigger.extend({
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

export default ActionEndTrigger;
