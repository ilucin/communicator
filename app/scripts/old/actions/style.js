'use strict';

var _ = require('lodash');
var Backbone = require('backbone');
import AbstractAction from 'old/actions/abstract';
import Style from 'old/base/style';

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
