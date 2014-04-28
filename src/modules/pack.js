(function() {
  'use strict';

  Communicator.Modules.Pack = Communicator.Modules.Container.extend({
    displayedProperties: ['name'],

    // @Override
    defaults: function() {
      return _.defaults({
        name: '',
        size: new Communicator.Base.Size({
          width: '100',
          height: '100'
        })
      }, _.result(Communicator.Modules.Container.prototype, 'defaults'));
    },

    properties: function() {
      return {
        label: 'Vježba',
        fields: [].concat(Communicator.Modules.Container.prototype.properties.call(this).fields).concat([{
          name: 'name',
          label: 'Nova vježba',
          type: 'text',
          model: this,
          options: {
            defaultVal: 'Nova vježba'
          }
        }])
      };
    }
  });
})();