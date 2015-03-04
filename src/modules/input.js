'use strict';

Communicator.Modules.Input = Communicator.Modules.Text.extend({
  defaults: function() {
    var defaults = {
      inputType: 'text',
      placeholder: ''
    };
    return _.defaults(defaults, Communicator.Modules.Text.prototype.defaults.call(this));
  },

  properties: function() {
    var properties = {
      label: 'Ulaz',
      fields: [].concat(Communicator.Modules.Text.prototype.properties.call(this).fields, [{
        name: 'inputType',
        label: 'Vrsta',
        type: 'select',
        value: this.get('inputType'),
        model: this,
        selectOptions: [{
          value: 'text',
          label: 'Tekst'
        }, {
          value: 'password',
          label: 'Password'
        }, {
          value: 'number',
          label: 'Broj'
        }, {
          value: 'email',
          label: 'Email'
        }]
      }, {
        name: 'placeholder',
        label: 'Placeholder',
        type: 'text',
        value: this.get('placeholder'),
        model: this
      }])
    };
    return this._filterProperties(properties);
  }

});
