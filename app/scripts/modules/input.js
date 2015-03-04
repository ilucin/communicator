'use strict';

import _ from 'lodash';
import Backbone from 'backbone';
import TextModule from 'modules/text';

var InputModule = TextModule.extend({
  defaults: function() {
    var defaults = {
      inputType: 'text',
      placeholder: ''
    };
    return _.defaults(defaults, TextModule.prototype.defaults.call(this));
  }
});

export default InputModule;
