'use strict';

Communicator.Actions.Style = Communicator.Actions.Abstract.extend({
  defaults: function() {
    return _.defaults({
      style: new Communicator.Base.Style({
        transparency: 1,
        'border-width': '0px',
        'background-color': '#ffffff'
      })
    }, _.result(Communicator.Actions.Abstract.prototype, 'defaults'));
  },

  getParams: function() {
    return this.get('style');
  },

  toJSON: function() {
    return _.defaults({
      style: this.get('style').toJSON()
    }, Communicator.Actions.Abstract.prototype.toJSON.call(this));
  }
});
