'use strict';

var _ = require('lodash');
var templater = require('common/templater');
var utils = require('common/utils');

var ViewTypes = {
  html: require('views/html')
};

var value = utils.evaluateProperty;

var ViewSubmodule = {
  init: function(viewConfig) {
    this.viewConfig = _.defaults(viewConfig, {
      type: 'html',
      templateType: 'ejs',
      data: 'this.data'
    });
  },

  createView: function() {
    var vc = this.viewConfig;
    var data;

    var viewOptions = {
      data: value(this, vc.data),
      id: _.uniqueId('view_'),
      style: vc.style,
      styleRules: vc.styleRules,
      events: vc.events,
      module: this
    };

    if (vc.template) {
      viewOptions.template = templater.compile(vc.templateType, value(this, vc.template));
    }

    var ViewClass = ViewTypes[vc.type];
    if (ViewClass) {
      this.view = new ViewClass(viewOptions);
    } else {
      console.warn('Could not load view class: ' + vc.type);
    }
  },

  onCreate: function() {
    ViewSubmodule.createView.call(this);
  },

  onDataChange: function() {
    this.view.setData(this.data);
    this.view.render();
  },

  onDisplay: function() {
    // console.log('ViewSubmodule.onDisplay');
    this.view.render();
  }
};

module.exports = ViewSubmodule;
