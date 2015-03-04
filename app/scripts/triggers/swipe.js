'use strict';

import _ from 'lodash';
import AbstractTrigger from 'triggers/abstract';

var SwipeTrigger = AbstractTrigger.extend({
  _getSourceModuleFromContainer: function(container) {
    return container.getChildById(this.get('sourceModuleId'));
  },

  _getEventName: function() {
    return 'swipe';
  }
});

export default SwipeTrigger;
