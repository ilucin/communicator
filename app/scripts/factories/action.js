'use strict';

import _ from 'lodash';

import FinishAction from 'actions/finish';
import PositionAction from 'actions/position';
import StyleAction from 'actions/style';
import InvokeAction from 'actions/invoke';
import TriggerFactory from 'factories/trigger';
import Style from 'base/style';
import Size from 'base/size';
import Position from 'base/position';

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
