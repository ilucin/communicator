(function() {
  'use strict';

  Communicator.Views.Text = Communicator.Views.Area.extend({
    className: Communicator.Views.Area.prototype.className + ' text',

    // @Override
    _initView: function() {
      Communicator.Views.Area.prototype._initView.call(this);
      this.listenTo(this.model, 'change:value', this.updateValue);
      this.updateValue();
    },

    updateValue: function() {
      this.$el.html(this.model.get('value'));
    },

    // @Override
    onDomAttach: function() {
      Communicator.Views.Area.prototype.onDomAttach.call(this);
      this.model.onLoad();
    }

  });

})();