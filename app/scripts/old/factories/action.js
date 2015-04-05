'use strict';

var _ = require('lodash');

import FinishAction from 'old/actions/finish';
import PositionAction from 'old/actions/position';
import StyleAction from 'old/actions/style';
import InvokeAction from 'old/actions/invoke';
import TriggerFactory from 'old/factories/trigger';
import Style from 'old/base/style';
import Size from 'old/base/size';
import Position from 'old/base/position';

var ActionType = {
  'finish': FinishAction,
  'position': PositionAction,
  'style': StyleAction,
  'invoke': InvokeAction
};

var ActionFactory = {

  complexObjects: ['triggers', 'style', 'position', 'targetIds', 'size'],

  createForContainer: function(module, containerModel, config) {
    if (!ActionType[module.type]) {
      throw 'Invalid action module type: ' + module.type;
    }
    var preparedModule = _.clone(module);

    _.each(this.complexObjects, function(key) {
      delete preparedModule[key];
    });

    if (module.style) {
      preparedModule.style = new Style(module.style);
    }
    if (module.position) {
      preparedModule.position = new Position(module.position);
    }
    if (module.size) {
      preparedModule.size = new Size(module.size);
    }

    var action = new ActionType[preparedModule.type](preparedModule, {
      config: config
    });
    containerModel.addAction(action);

    _.each(module.targetIds, function(targetId) {
      action.addTargetId(targetId);
    });

    _.each(module.triggers, function(trigger) {
      action.addTrigger(TriggerFactory.create(trigger, config));
    });

    return action;
  }
};

export default ActionFactory;
