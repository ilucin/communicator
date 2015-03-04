'use strict';

import _ from 'lodash';
import Backbone from 'backbone';
import AbstractAction from 'actions/abstract';

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
