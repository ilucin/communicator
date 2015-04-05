'use strict';

var _ = require('lodash');
var Backbone = require('backbone');
import AreaModule from 'old/modules/area';

var TextModule = AreaModule.extend({
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
    return _.defaults(defaults, AreaModule.prototype.defaults.call(this));
  }
});

export default TextModule;
