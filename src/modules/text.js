(function() {
  'use strict';

  // value string
  Communicator.Modules.Text = Communicator.Modules.Area.extend({
    displayedProperties: _.clone(Communicator.Modules.Area.prototype.displayedProperties).concat(['color', 'value', 'font-size', 'font-weight', 'font-family', 'text-align']),
    mandatoryProperties: _.clone(Communicator.Modules.Area.prototype.mandatoryProperties).concat([]),

    defaults: function() {
      var defaults = {
        'type': 'text',
        'draggable': false,
        'font-size': '120%',
        'height': '8%',
        'font-weight': '400',
        'color': '#000',
        'border': '0',
        'value': 'Text'
      };
      return _.defaults(defaults, Communicator.Modules.Area.prototype.defaults.call(this));
    },

    properties: function() {
      var properties = {
        label: 'Tekst',
        fields: [].concat(Communicator.Modules.Area.prototype.properties.call(this).fields).concat([{
          name: 'color',
          label: 'Boja',
          type: 'color',
          value: this.get('style').get('color') || '#000',
          model: this.get('style'),
          options: {
            default: '#000',
            prefix: '#'
          }
        }, {
          name: 'value',
          label: 'Tekst',
          type: 'text',
          value: this.get('value'),
          model: this,
          options: {
            defaultVal: 'placeholder text'
          }
        }, {
          name: 'font-size',
          label: 'Veličina',
          type: 'slider',
          value: this.get('style').get('font-size') || 100,
          model: this.get('style'),
          options: {
            step: 10,
            min: 50,
            max: 300,
            label: '%',
            sufix: '%'
          }
        }, {
          name: 'font-weight',
          label: 'Debljina slova',
          type: 'select',
          value: this.get('style').get('font-weight') || 400,
          model: this.get('style'),
          selectOptions: [{
            value: 'lighter',
            label: 'Tanka'
          }, {
            value: 'normal',
            label: 'Normalna'
          }, {
            value: 'bold',
            label: 'Debela'
          }]
        }, {
          name: 'font-family',
          label: 'Vrsta slova',
          type: 'select',
          value: this.get('style').get('font-family') || 'sans',
          model: this.get('style'),
          selectOptions: [{
            value: 'sans-serif',
            label: 'Sans'
          }, {
            value: 'serif',
            label: 'Serif'
          }, {
            value: 'monospace',
            label: 'Monospace'
          }, {
            value: 'Arial',
            label: 'Arial'
          }, {
            value: 'Times new Roman',
            label: 'Times new Roman'
          }, {
            value: 'Verdana',
            label: 'Verdana'
          }]
        }, {
          name: 'text-align',
          label: 'Poravnavanje',
          type: 'select',
          value: this.get('style').get('text-align') || 'left',
          model: this.get('style'),
          selectOptions: [{
            value: 'left',
            label: 'Lijevo'
          }, {
            value: 'center',
            label: 'Centar'
          }, {
            value: 'right',
            label: 'Desno'
          }, {
            value: 'justified',
            label: 'Justify'
          }]
        }])
      };
      return this._filterProperties(properties);
    }

  });
})();