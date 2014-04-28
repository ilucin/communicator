(function() {
  'use strict';

  Communicator.Actions.Invoke = Communicator.Actions.Abstract.extend({

    mandatoryProperties: _.clone(Communicator.Actions.Abstract.prototype.mandatoryProperties).concat(['method']),

    properties: function() {
      return {
        label: 'Akcija pokretanja',
        fields: [].concat(Communicator.Actions.Abstract.prototype.properties.call(this).fields).concat([])
      };
    },

    defaults: function() {
      return _.defaults({
        arguments: []
      }, Communicator.Actions.Abstract.prototype.defaults.call(this));
    },

    getParams: function() {
      return this.get('method');
    }

  });
})();