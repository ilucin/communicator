/* Abstract Trigger */
/* Deps: Communicator.Triggers.Abstract, Communicator.Helpers */

(function() {
  'use strict';

  Communicator.Triggers.Equal = Communicator.Triggers.Abstract.extend({

    setContainerModule: function(container) {
      if (this._sourceModule) {
        this.stopListening(this._sourceModule);
      }
      Communicator.Triggers.Abstract.prototype.setContainerModule.apply(this, arguments);
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
})();