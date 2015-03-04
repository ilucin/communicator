'use strict';

import _ from 'lodash';
import AbstractTrigger from 'triggers/abstract';

var ActiveTrigger = AbstractTrigger.extend({
  _getSourceModuleFromContainer: function(container) {
    return container.getChildById(this.get('sourceModuleId'));
  },

  _getEventName: function() {
    return 'active';
  }
});

export default ActiveTrigger;
