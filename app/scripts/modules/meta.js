'use strict';

var _ = require('lodash');
var utils = require('common/utils');

var MetaSubmodule = {
  init: function(metaConfig) {
    this.meta = {};
    _.each(metaConfig, function(metaVal, metaKey) {
      this.meta[metaKey] = utils.evaluateProperty(this, metaVal);
    }, this);
  }
};

module.exports = MetaSubmodule;
