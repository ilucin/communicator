'use strict';

var _ = require('lodash');
var Backbone = require('backbone');
import Config from 'old/base/config';

var AbstractModule = Backbone.Model.extend({
  defaults: {
    enabled: true
  },

  initialize: function(module, options) {
    options = options || {};

    this.module = module;
    this.config = options.config || new Config();

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

  setConfig: function(config) {
    this.config = config;
  }
});

export default AbstractModule;
