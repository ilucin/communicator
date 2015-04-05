'use strict';

var _ = require('lodash');
import Config from 'old/base/config';
import ModuleFactory from 'old/factories/module';
import ViewFactory from 'old/factories/view';
import AbstractModule from 'old/modules/abstract';
import AbstractView from 'old/views/abstract';

var Communicator = function(module, config) {
  this.config = new Config(config);
  this._containerLastDimensions = {};

  if (_.isPlainObject(module)) {
    this.moduleModel = ModuleFactory.create(module, this.config);
    this.moduleView = ViewFactory.create(this.moduleModel, this.config);
  } else if (module instanceof AbstractModule) {
    this.moduleModel = module;
    this.moduleView = ViewFactory.create(this.moduleModel, this.config);
  } else if (module instanceof AbstractView) {
    this.moduleModel = module.model;
    this.moduleView = module;
  } else {
    throw 'Invalid arguments for Communicator instance';
  }

  this.initialize(arguments);
};

_.extend(Communicator.prototype, {
  minDimensionsRefreshInterval: 100,

  initialize: function() {},

  run: function($container, $surface) {
    if (!$surface) {
      $surface = $('<div>').addClass('communicator-surface');
      $container.html($surface);
    }

    this.$surface = $surface;
    this.$surfaceContainer = $container;

    this._updateSurfaceDimensions();
    $surface.html(this.moduleView.render().el);

    setTimeout(_.bind(function() {
      this.moduleView.onDomAttach.call(this.moduleView);
    }, this), 0);

    if (this.config.has('dimensionRefreshInterval') && this.config.get('dimensionRefreshInterval') > this.minDimensionsRefreshInterval) {
      this.dimensionTimer = window.setInterval(_.bind(this._checkForContainerDimensionChange, this), this.config.get('dimensionRefreshInterval'));
    }
  },

  stop: function() {
    if (this.dimensionTimer) {
      window.clearInterval(this.dimensionTimer);
    }
    this.moduleView.remove();
  },

  onDomAttach: function() {
    this._updateSurfaceDimensions();
  },

  _checkForContainerDimensionChange: function() {
    var cld = this._containerLastDimensions;
    var width = this.$surfaceContainer.width();
    var height = this.$surfaceContainer.height();
    if (cld && (width !== cld.width || height !== cld.height)) {
      this._updateSurfaceDimensions();
    }
    this._containerLastDimensions.width = width;
    this._containerLastDimensions.height = height;
  },

  _updateSurfaceDimensions: function() {
    var scWidth = this.$surfaceContainer.width();
    var scHeight = this.$surfaceContainer.height();
    var scRatio = scHeight / scWidth;
    var sHeight = scHeight;
    var sWidth = scWidth;
    var fontSize = sWidth * 0.025;

    if (scRatio < this.config.get('surfaceRatio')) {
      sWidth = scHeight * (1 / this.config.get('surfaceRatio'));
    } else {
      sHeight = scWidth * this.config.get('surfaceRatio');
    }

    this.config.set({
      dragVerticalOffset: (scHeight - sHeight) / 2,
      dragHorizontalOffset: (scWidth - sWidth) / 2,
      surfaceWidth: sWidth,
      surfaceHeight: sHeight,
      fontSize: sWidth * 0.025
    });

    this.$surface.css({
      'width': sWidth + 'px',
      'height': sHeight + 'px',
      'font-size': fontSize + 'px'
    });
  }
});

export default Communicator;
