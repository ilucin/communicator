'use strict';

import _ from 'lodash';
import Backbone from 'backbone';
import AbstractAction from 'actions/abstract';

var ResizeAction = AbstractAction.extend({
  getParams: function() {
    return this.get('size');
  },

  toJSON: function() {
    return _.defaults({
      size: this.get('size').toJSON()
    }, AbstractAction.prototype.toJSON.call(this));
  },

  onBeforeAddTargetId: function(targetId) {
    return targetId.length > 0;
  }
});

export default ResizeAction;
