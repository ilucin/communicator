'use strict';

var _ = require('lodash');
var Backbone = require('backbone');
import AbstractAction from 'old/actions/abstract';

var InvokeAction = AbstractAction.extend({
  defaults: function() {
    return _.defaults({
      arguments: []
    }, AbstractAction.prototype.defaults.call(this));
  },

  getParams: function() {
    return this.get('method');
  }
});

export default InvokeAction;
