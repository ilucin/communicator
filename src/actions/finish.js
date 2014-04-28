(function() {
  'use strict';

  Communicator.Actions.Finish = Communicator.Actions.Abstract.extend({
    properties: function() {
      return {
        label: 'Akcija za završetak',
        fields: [].concat(Communicator.Actions.Abstract.prototype.properties.call(this).fields).concat([])
      };
    },

    defaults: function() {
      return _.defaults({
        targetIds: ['']
      }, Communicator.Actions.Abstract.prototype.defaults.call(this));
    }

  });
})();