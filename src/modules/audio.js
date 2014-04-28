(function() {
  'use strict';

  Communicator.Modules.Audio = Communicator.Modules.Area.extend({
    displayedProperties: _.clone(Communicator.Modules.Area.prototype.displayedProperties).concat([]),
    mandatoryProperties: _.clone(Communicator.Modules.Area.prototype.mandatoryProperties).concat(['src']),

    defaults: function() {
      var defaults = {
        keepAspectRatio: true,
        autoplay: false,
        controls: false,
        height: 16,
        width: 9,
        loop: false,
        muted: false,
        played: false
      };
      return _.defaults(defaults, Communicator.Modules.Area.prototype.defaults.call(this));
    },

    properties: function() {
      var properties = {
        label: 'Zvuk',
        fields: [].concat(Communicator.Modules.Area.prototype.properties.call(this).fields)
      };
      return this._filterProperties(properties);
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
})();