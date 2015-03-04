'use strict';

import _ from 'lodash';
import Backbone from 'backbone';
import AreaModule from 'modules/area';

var VideoModule = AreaModule.extend({
  defaults: function() {
    var defaults = {
      keepAspectRatio: true,
      autoplay: false,
      controls: false,
      height: 10,
      width: 10,
      loop: false,
      muted: false,
      played: false
    };
    return _.defaults(defaults, AreaModule.prototype.defaults.call(this));
  },

  startPlayback: function() {
    this.trigger('playback:start');
    this._isPlaying = true;
  },

  stopPlayback: function() {
    this.trigger('playback:stop');
    this._isPlaying = false;
  },

  mutePlayback: function() {
    if (this.get('volume') > 0) {
      this._lastVolume = this.get('volume');
      this.setVolume(0);
    }
  },

  unmutePlayback: function() {
    if (this.get('volume') === 0) {
      this.setVolume(this._lastVolume);
    }
  },

  setVolume: function(volume) {
    this.set('volume', volume);
  },


  onPlay: function() {
    this.startPlayback();
  },

  onPause: function() {
    this.stopPlayback();
  },

  onVolumeChange: function() {}

});

export default AreaModule;
