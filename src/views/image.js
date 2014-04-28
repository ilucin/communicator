(function() {
  'use strict';

  Communicator.Views.Image = Communicator.Views.Area.extend({
    className: Communicator.Views.Area.prototype.className + ' image',
    tagName: 'div',

    // @Override
    _initView: function() {
      Communicator.Views.Area.prototype._initView.apply(this, arguments);
      this.$img = $('<img>');
      this.updateSrc();

      this.$el.append(this.$img);

      this.listenTo(this.model, 'change:src', this.updateSrc, this);
    },

    // @Override
    onDomAttach: function() {
      Communicator.Views.Area.prototype.onDomAttach.apply(this, arguments);
      this.model.onLoad();
    },

    updateSrc: function() {
      this.$img.attr('src', this.model.get('src'));
    }
  });

})();