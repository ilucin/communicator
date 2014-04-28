(function() {
  'use strict';

  Communicator.Actions.Position = Communicator.Actions.Abstract.extend({

    mandatoryProperties: _.clone(Communicator.Actions.Abstract.prototype.mandatoryProperties).concat([]),

    defaults: function() {
      return _.defaults({
        position: new Communicator.Base.Position({
          top: 0,
          left: 0
        })
      }, _.result(Communicator.Actions.Abstract.prototype, 'defaults'));
    },

    properties: function() {
      return {
        label: 'Akcija pomicanja',
        fields: [].concat(Communicator.Actions.Abstract.prototype.properties.call(this).fields).concat([{
          name: 'duration',
          label: 'Duration',
          type: 'slider',
          model: _.bind(function() {
            return this;
          }, this),
          options: {
            step: 1,
            min: 20,
            max: 4000,
            label: 'ms',
          }
        }, {
          name: 'left',
          label: 'X pozicija',
          type: 'slider',
          model: _.bind(function() {
            return this.get('position');
          }, this),
          options: {
            step: 1,
            min: 0,
            max: 100,
            label: '%',
          }
        }, {
          name: 'top',
          label: 'Y pozicija',
          type: 'slider',
          model: _.bind(function() {
            return this.get('position');
          }, this),
          options: {
            step: 1,
            min: 0,
            max: 100,
            label: '%',
          }
        }])
      };
    },

    getParams: function() {
      return this.get('position');
    },

    start: function() {
      Communicator.Actions.Abstract.prototype.start.call(this);
    },

    toJSON: function() {
      return _.defaults({
        position: this.get('position').toJSON()
      }, Communicator.Actions.Abstract.prototype.toJSON.call(this));
    },

    onBeforeAddTargetId: function(targetId) {
      return targetId.length > 0;
    }

  });
})();