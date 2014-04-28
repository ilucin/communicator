(function() {
  'use strict';

  Communicator.Modules.Abstract = Backbone.Model.extend({
    displayedProperties: [],
    complexProperties: [],
    mandatoryProperties: ['type'],

    defaults: {
      enabled: true
    },

    initialize: function(module, options) {
      options = options || {};
      Communicator.Components.Helpers.checkProperties(module, this.mandatoryProperties);

      this.module = module;
      this.config = options.config || new Communicator.Base.Config();

      this.listenTo(this.get('style'), 'change', function() {
        this.trigger('update:style', this.get('style'));
      });
      this.listenTo(this.get('position'), 'change', function() {
        this.trigger('update:position', this.get('position'));
      });
      this.listenTo(this.get('size'), 'change', function() {
        this.trigger('update:size', this.get('size'));
      });
    },

    onLoad: function() {
      this.trigger('load');
    },

    invoke: function(method, duration, onEnd) {
      this[method](duration, onEnd);
    },

    toggleEnabled: function(duration, onEnd) {
      this.set('enabled', !this.get('enabled'));
      this.trigger('update:enabled', duration, onEnd);
    },

    finish: function() {
      this.trigger('finish', this);
    },

    toJSON: function() {
      var json = {};
      _.each(this.complexProperties, function(complexProperty) {
        json[complexProperty] = this.get(complexProperty).toJSON();
      }, this);
      return _.defaults(json, Backbone.Model.prototype.toJSON.call(this));
    },

    properties: function() {
      return {
        label: 'Module',
        fields: [{
          name: 'id',
          label: 'ID',
          type: 'text',
          editable: false,
          value: this.get('id'),
          model: this,
          options: {
            defaultVal: 'object id'
          }
        }, {
          name: 'name',
          label: 'Ime',
          type: 'text',
          value: this.get('name') || 'Neimenovan',
          editable: true,
          model: this,
          options: {
            defaultVal: 'Postavite ime'
          }
        }]
      };
    },

    setConfig: function(config) {
      this.config = config;
    },

    _filterProperties: function(props) {
      var result = [];
      _.forEach(props.fields, function(field) {
        if (this.displayedProperties.indexOf(field.name) >= 0) {
          result.push(field);
        }
      }, this);
      props.fields = result;
      return props;
    }

  });
})();