'use strict';

import _ from 'lodash';
import AbstractTrigger from 'triggers/abstract';

var EventTrigger = AbstractTrigger.extend({
  _getSourceModuleFromContainer: function(container) {
    return container.getChildById(this.get('sourceModuleId'));
  },

  _getEventName: function() {
    return this.get('event');
  }
});

export default EventTrigger;
