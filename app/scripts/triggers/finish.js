'use strict';

import _ from 'lodash';
import AbstractTrigger from 'triggers/abstract';

var FinishTrigger = AbstractTrigger.extend({
  _getSourceModuleFromContainer: function(container) {
    return container.getChildById(this.get('sourceModuleId'));
  },

  _getEventName: function() {
    return 'finish';
  }
});

export default FinishTrigger;
