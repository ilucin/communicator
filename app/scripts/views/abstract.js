'use strict';

import _ from 'lodash';
import Backbone from 'backbone';
import Config from 'base/config';

var AbstractView = Backbone.View.extend({
  className: 'module',

  // The module view constructor
  initialize: function(options) {
    options = options || {};
    if (!options.model) {
      throw 'AbstractView must have it\'s model set.';
    }
    this.config = options.config || new Config();
    this._zIndex = 100;
    this._initView();

    this.setEnabled(this.model.get('enabled'));
    this.listenTo(this.model, 'update:enabled', this.updateEnabled, this);
  },

  // Initialize view from the module params
  _initView: function() {
    this.$el.addClass(this.model.get('id'));
    this.$el.attr('data-id', this.model.get('id'));
    this.$el.css('z-index', this.getZIndex());
    return this;
  },

  setZIndex: function(zIndex) {
    this._zIndex = zIndex;
    this.$el.css('z-index', zIndex);
  },

  getZIndex: function() {
    return this._zIndex;
  },

  getId: function() {
    return this.model.get('id');
  },

  getModel: function() {
    return this.model;
  },

  setConfig: function(config) {
    this.config = config;
  },

  // Method that is called when the view is attached to the DOM. Used for some view
  // initializations that have to happen after the core styles had been applied to the view
  onDomAttach: function() {},

  setEnabled: function(enabled) {
    if (!!enabled) {
      this.$el.removeClass('disabled');
    } else {
      this.$el.addClass('disabled');
    }
  },

  updateEnabled: function(duration, onEnd) {
    this.setEnabled(this.model.get('enabled'));
    if (onEnd) {
      onEnd();
    }
  },

  fixIndex: function() {}
});

export default AbstractView;
