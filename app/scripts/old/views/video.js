'use strict';

var _ = require('lodash');
var Backbone = require('backbone');
import AreaView from 'old/views/area';

var VideoView = AreaView.extend({
  className: AreaView.prototype.className + ' video',
  tagName: 'video',
  elEvents: {
    'onpause': 'onPause',
    'onplay': 'onPlay',
    'onvolumechange': 'onVolumeChange'
  },
  modelEvents: {
    'playback:start': 'startPlayback',
    'playback:stop': 'stopPlayback',
    'change:volume': 'updateVolume'
  },

  // @Override
  _initView: function() {
    AreaView.prototype._initView.apply(this, arguments);

    var attrsToSet = {};
    var attrsToCheck = ['autoplay', 'controls', 'loop', 'muted'];
    _.each(attrsToCheck, function(attr) {
      if (this.model.get(attr)) {
        attrsToSet[attr] = this.model.get(attr);
      }
    }, this);

    _.forOwn(this.modelEvents, function(method, event) {
      this.listenTo(this.model, event, this[method], this);
    }, this);

    _.forOwn(this.elEvents, function(method, event) {
      this.el[event] = _.bind(this[method], this);
    }, this);

    this.$el.attr(attrsToSet);

    this.video = this.$el[0];
  },

  startPlayback: function() {
    this.video.play();
  },

  stopPlayback: function() {
    this.video.pause();
  },

  updateVolume: function() {
    this.video.volume = this.model.get('volume');
  },

  onPlay: function() {
    this.model.onPlay();
  },

  onPause: function() {
    this.model.onPause();
  },

  onVolumeChange: function() {
    this.model.onVolumeChange();
  }
});

export default VideoView;
