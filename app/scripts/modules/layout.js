'use strict';

var _ = require('lodash');
var utils = require('common/utils');
var value = utils.evaluateProperty;

var LayoutSubmodule = {
  init: function(layoutConfig) {
    this.layout = value(this, layoutConfig);
  },

  onDisplay: function() {
    // console.log('LayoutSubmodule.onDisplay');
    if (this.childrenArray) {
      this.view.layoutChildren(this.layout, this.childrenArray);
    }
  }
};

module.exports = LayoutSubmodule;
