'use strict';

import _ from 'lodash';
import Backbone from 'backbone';
import AreaModule from 'modules/area';

var ImageModule = AreaModule.extend({
  defaults: function() {
    var defaults = {
      keepAspectRatio: false
    };
    return _.defaults(defaults, AreaModule.prototype.defaults.call(this));
  }
});

export default ImageModule;
