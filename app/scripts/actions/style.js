'use strict';

import _ from 'lodash';
import Backbone from 'backbone';
import AbstractAction from 'actions/abstract';
import Style from 'base/style';

var StyleAction = AbstractAction.extend({
  defaults: function() {
    return _.defaults({
      style: new Style({
        transparency: 1,
        'border-width': '0px',
        'background-color': '#ffffff'
      })
    }, _.result(AbstractAction.prototype, 'defaults'));
  },

  getParams: function() {
    return this.get('style');
  },

  toJSON: function() {
    return _.defaults({
      style: this.get('style').toJSON()
    }, AbstractAction.prototype.toJSON.call(this));
  }
});

export default StyleAction;
