'use strict';

var _ = require('lodash');
var utils = require('common/utils');

var actionsSubmodule = {
  init: function(actions) {
    this.actions = {};
    _.each(actions, actionsSubmodule.addAction, this);
  },

  addAction: function(actionConfig) {
    var action = {
      id: actionConfig.id,
      callback: (new Function(actionConfig.do)).bind(this)
    };
    var onSplit, onModule, onEvent;

    if (actionConfig.on) {
      onSplit = actionConfig.on.split(' ');
      onModule = utils.evaluatePropertyChain(this, onSplit[0]);
      onEvent = onSplit[1];

      if (onModule) {
        action.onModule = onModule;
        action.onEvent = onEvent;

        onModule.on(onEvent, action.callback, this);
      } else {
        console.warn('onModule could not be found (evaluated through property chain)');
      }
    }

    this.actions[actionConfig.id] = action;
  }
};

module.exports = actionsSubmodule;
