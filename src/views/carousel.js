(function() {
  'use strict';

  Communicator.Views.Carousel = Communicator.Views.Container.extend({
    className: Communicator.Views.Container.prototype.className + ' carousel',

    // @Override
    initialize: function(options) {
      Communicator.Views.Container.prototype.initialize.call(this, options);
      if (this.config.get('viewCarouselUpdateCurrentItem')) {
        this.listenTo(this.model, 'update:currentItem', this._onCurrentItemChange, this);
      }
    },

    _moveToCurrentSlide: function() {
      this.$el.css('left', '-' + (this._currentSlide * 100) + '%');
    },

    _onCurrentItemChange: function() {
      this.setSlide(this.model.get('currentItem'));
    },

    nextSlide: function() {
      if (this._currentSlide < this._children.length - 1) {
        this._currentSlide++;
        this._moveToCurrentSlide();
      }
    },

    previousSlide: function() {
      if (this._currentSlide > 0) {
        this._currentSlide--;
        this._moveToCurrentSlide();
      }
    },

    setSlide: function(arg) {
      var num = _.isNumber(arg) ? arg : this._children.indexOf(arg);
      if (num >= 0 && num < this._children.length && num !== this._currentSlide) {
        this._currentSlide = num;
        this._moveToCurrentSlide();
      }
    }

  });
})();