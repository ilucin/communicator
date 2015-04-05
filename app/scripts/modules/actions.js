'use strict';

var _ = require('lodash');
var utils = require('common/utils');

var actionsSubmodule = {
  init: function(actions) {
    this.actions = {};

    if (_.isArray(actions)) {
      _.each(actions, actionsSubmodule.addComplexAction, this);
    } else if (_.isObject(actions)) {
      _.each(actions, actionsSubmodule.addSimpleAction, this);
    }
  },

  addAction: function(id, on, functionBody) {
    var action = {
      id: id,
      callback: utils.createFunction(this, functionBody)
    };
    var onSplit, onModule, onEvent;

    onSplit = on.split(' ');
    onModule = utils.evaluatePropertyChain(this, onSplit[0]);
    onEvent = onSplit[1];

    if (onModule) {
      action.onModule = onModule;
      action.onEvent = onEvent;

      onModule.on(onEvent, action.callback, this);
    } else {
      console.warn('onModule could not be found (evaluated through property chain)');
    }

    this.actions[action.id] = action;
  },

  addSimpleAction: function(functionBody, trigger) {
    actionsSubmodule.addAction.call(this, _.uniqueId('action_'), trigger, functionBody);
  },

  addComplexAction: function(actionConfig) {
    actionsSubmodule.addAction.call(this, actionConfig.id, actionConfig.on, actionConfig.do);
  }
};

module.exports = actionsSubmodule;
