(function() {
  'use strict';

  Communicator.Base.Position = Backbone.Model.extend({

    defaults: {
      top: '0%',
      left: '0%'
    },

    initialize: function(attributes) {
      Communicator.Components.Helpers.checkProperties(attributes, ['top', 'left']);
      this.clear({
        silent: true
      });
      this.setTop(attributes.top);
      this.setLeft(attributes.left);
    },

    setTop: function(top) {
      this._top = parseFloat(top, 10);
      this.set('top', this._top + '%');
      return this;
    },

    setLeft: function(left) {
      this._left = parseFloat(left, 10);
      this.set('left', this._left + '%');
      return this;
    },

    getTopValue: function() {
      return this._top;
    },

    getLeftValue: function() {
      return this._left;
    }

  });

})();