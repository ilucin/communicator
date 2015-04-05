'use strict';

var _ = require('lodash');
var Backbone = require('backbone');
import AreaModule from 'old/modules/area';

var ImageModule = AreaModule.extend({
  defaults: function() {
    var defaults = {
      keepAspectRatio: false
    };
    return _.defaults(defaults, AreaModule.prototype.defaults.call(this));
  }
});

export default ImageModule;
