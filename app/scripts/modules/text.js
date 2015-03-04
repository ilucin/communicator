'use strict';

import _ from 'lodash';
import Backbone from 'backbone';
import AreaModule from 'modules/area';

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
