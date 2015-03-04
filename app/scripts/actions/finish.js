'use strict';

import _ from 'lodash';
import Backbone from 'backbone';
import AbstractAction from 'actions/abstract';

var FinishAction = AbstractAction.extend({
  defaults: function() {
    return _.defaults({
      targetIds: ['']
    }, AbstractAction.prototype.defaults.call(this));
  }
});

export default FinishAction;
