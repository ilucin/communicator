'use strict';

Communicator.Triggers.Abstract = Backbone.Model.extend({
  defaults: {
    arguments: {},
    delay: 0
  },

  initialize: function(attributes, options) {
    options = options || {};
    Communicator.Components.Helpers.checkProperties(attributes, ['type', 'sourceModuleId']);
    this.config = options.config || new Communicator.Base.Config();
    this.module = attributes;
    this._count = 0;
    this._initTrigger();
  },

  _initTrigger: function() {},

  setConfig: function(config) {
    this.config = config;
  },

  hasTriggered: function() {
    return this._count > 0;
  },

  getCount: function() {
    return this._count;
  },

  debug: function() {
    console.log('Trigger:', this.get('id'), 'on', this.get('sourceModuleId'), 'when', this._getEventName());
  },

  cleanup: function() {
    this.stopListening();
  },

  reset: function() {
    this._count = 0;
  },

  setContainerModule: function(container) {
    this._setSourceModule(this._getSourceModuleFromContainer(container));
  },

  _getEventName: function() {
    return this.get('type');
  },

  _getSourceModuleFromContainer: function() {
    throw 'Not implemented. This is abstract method';
  },

  _setSourceModule: function(module) {
    this._sourceModule = module;
    if (module.get('id') !== this.get('sourceModuleId')) {
      throw 'Invalid module';
    }
    this.listenTo(module, this._getEventName(), this._onEvent, this);
    // console.log('ListenTo: Trigger', this.get('id'), 'is listening to module', module.get('id'), 'for', this._getEventName());
  },

  _onBeforeEvent: function() {
    return true;
  },

  _onEvent: function(params) {
    var me = this;
    if (!!this._onBeforeEvent(params) && this.config.get('triggersEnabled')) {
      setTimeout(function() {
        me._count++;
        // console.log('Trigger: ', me.get('id'));
        me.trigger('trigger', params);
      }, this.get('delay'));
    }
  }
});
