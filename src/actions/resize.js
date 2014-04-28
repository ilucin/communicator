(function() {
  'use strict';

  Communicator.Actions.Resize = Communicator.Actions.Abstract.extend({

    mandatoryProperties: _.clone(Communicator.Actions.Abstract.prototype.mandatoryProperties).concat(['size']),

    properties: function() {
      return {
        label: 'Akcija promjene veličine',
        fields: [].concat(Communicator.Actions.Abstract.prototype.properties.call(this).fields).concat([])
      };
    },

    getParams: function() {
      return this.get('size');
    },

    toJSON: function() {
      return _.defaults({
        size: this.get('size').toJSON()
      }, Communicator.Actions.Abstract.prototype.toJSON.call(this));
    },

    onBeforeAddTargetId: function(targetId) {
      return targetId.length > 0;
    }

  });
})();