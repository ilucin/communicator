'use strict';

import _ from 'lodash';
import Backbone from 'backbone';
import AreaView from 'views/area';

var AudioView = AreaView.extend({
  className: AreaView.prototype.className + ' audio',
  tagName: 'div',
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

    this.$audioEl = $('<audio>');
    this.$audioEl.attr('src', this.model.get('src'));
    this.$audioEl.addClass('containerChild');
    this.$audioEl.addClass('audioPlayer');
    this.$el.append(this.$audioEl);

    this.audio = this.$audioEl[0];

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

    this.$audioEl.attr(attrsToSet);
  },

  startPlayback: function() {
    this.audio.play();
  },

  stopPlayback: function() {
    this.audio.pause();
  },

  updateVolume: function() {
    this.audio.volume = this.model.get('volume');
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

export default AudioView;
