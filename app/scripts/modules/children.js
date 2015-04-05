'use strict';

var _ = require('lodash');

var ChildrenSubmodule = {
  init: function(childrenConfig) {
    this.childrenArray = [];
    this.children = {};

    for (var i = 0, l = childrenConfig.length; i < l; i++) {
      this.addChild(childrenConfig[i]);
    }
  },

  onDisplay: function() {
    // console.log('ChildrenSubmodule.onDisplay');
    _.each(this.childrenArray, function(child) {
      child.onDisplay();
    });
  },

  api: {
    addChild: function(childConfig) {
      var child = this.createModule(childConfig);
      this.childrenArray.push(child);
      this.children[child.id] = child;
    },

    removeChild: function(child) {
      var idx = this.childrenArray.indexOf(child);
      if (idx >= 0) {
        this.childrenArray.splice(idx, 1);
      }
      delete this.children[child.id];
    }
  }
};

module.exports = ChildrenSubmodule;
