(function() {
  'use strict';

  Communicator.Actions.Style = Communicator.Actions.Abstract.extend({

    mandatoryProperties: _.clone(Communicator.Actions.Abstract.prototype.mandatoryProperties).concat([]),

    defaults: function() {
      return _.defaults({
        style: new Communicator.Base.Style({
          transparency: 1,
          'border-width': '0px',
          'background-color': '#ffffff'
        })
      }, _.result(Communicator.Actions.Abstract.prototype, 'defaults'));
    },

    properties: function() {
      return {
        label: 'Akcija promjena izgleda',
        fields: [].concat(Communicator.Actions.Abstract.prototype.properties.call(this).fields).concat([{
          name: 'duration',
          label: 'Duration',
          type: 'slider',
          options: {
            step: 10,
            min: 0,
            max: 3000,
            label: 'ms',
          }
        }, {
          name: 'opacity',
          label: 'Prozirnost',
          type: 'slider',
          model: _.bind(function() {
            return this.get('style');
          }, this),
          options: {
            step: 0.05,
            min: 0,
            max: 1,
            label: '',
          }
        }, {
          name: 'border-width',
          label: 'Rub',
          type: 'slider',
          model: _.bind(function() {
            return this.get('style');
          }, this),
          options: {
            step: 0.1,
            min: 0,
            max: 3,
            label: '',
          }
        }, {
          name: 'background-color',
          label: 'Pozadina',
          type: 'color',
          model: _.bind(function() {
            return this.get('style');
          }, this),
          options: {
            default: '#ffffff'
          }
        }])
      };
    },

    getParams: function() {
      return this.get('style');
    },

    toJSON: function() {
      return _.defaults({
        style: this.get('style').toJSON()
      }, Communicator.Actions.Abstract.prototype.toJSON.call(this));
    }

  });
})();