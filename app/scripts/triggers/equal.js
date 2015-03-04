'use strict';

import _ from 'lodash';
import AbstractTrigger from 'triggers/abstract';

var EqualTrigger = AbstractTrigger.extend({
  setContainerModule: function(container) {
    if (this._sourceModule) {
      this.stopListening(this._sourceModule);
    }
    AbstractTrigger.prototype.setContainerModule.apply(this, arguments);
    this.listenTo(this._sourceModule, 'change:' + this.get('attribute'), this.onAttributeChange, this);
  },

  _getSourceModuleFromContainer: function(container) {
    return container.getChildById(this.get('sourceModuleId'));
  },

  _getEventName: function() {
    return '';
  },

  onAttributeChange: function() {
    if (this._sourceModule.get(this.get('attribute')) === this.get('attributeValue')) {
      this._onEvent();
    }
  }
});

export default EqualTrigger;
