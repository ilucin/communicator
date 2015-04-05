'use strict';

var _ = require('lodash');
var Backbone = require('backbone');
import AbstractAction from 'old/actions/abstract';

var FinishAction = AbstractAction.extend({
  defaults: function() {
    return _.defaults({
      targetIds: ['']
    }, AbstractAction.prototype.defaults.call(this));
  }
});

export default FinishAction;
