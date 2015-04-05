'use strict';

var _ = require('lodash');
var Backbone = require('backbone');
import TextModule from 'old/modules/text';

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
