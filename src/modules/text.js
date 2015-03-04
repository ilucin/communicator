'use strict';

// value string
Communicator.Modules.Text = Communicator.Modules.Area.extend({
  defaults: function() {
    var defaults = {
      'type': 'text',
      'draggable': false,
      'font-size': '120%',
      'height': '8%',
      'font-weight': '400',
      'color': '#000',
      'border': '0',
      'value': 'Text'
    };
    return _.defaults(defaults, Communicator.Modules.Area.prototype.defaults.call(this));
  }
});
