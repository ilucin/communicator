var Communicator = window.Communicator = (function(global, $, _, Backbone, Hammer) {
  'use strict';

  var Communicator = function(module, config) {
    this.config = new Communicator.Config(config);
    this._containerLastDimensions = {};

    if (_.isPlainObject(module)) {
      this.moduleModel = Communicator.Factories.Model.create(module, this.config);
      this.moduleView = Communicator.Factories.View.create(this.moduleModel, this.config);
    } else if (module instanceof Communicator.Models.Module) {
      this.moduleModel = module;
      this.moduleView = Communicator.Factories.View.create(this.moduleModel, this.config);
    } else if (module instanceof Communicator.Views.Module) {
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
        $surface = $('<div>').addClass('komunikator-player-surface');
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

  Communicator.Base = {};
  Communicator.Objects = {};
  Communicator.Actions = {};
  Communicator.Collections = {};
  Communicator.Components = {};
  Communicator.Factories = {};
  Communicator.Views = {};
  Communicator.Triggers = {};

  return Communicator;
})(this, $, _, Backbone, Hammer);