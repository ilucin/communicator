'use strict';

import ActionEndTrigger from 'old/triggers/action-end';
import ActionStartTrigger from 'old/triggers/action-start';
import ActiveTrigger from 'old/triggers/active';
import DropTrigger from 'old/triggers/drop';
import SwipeTrigger from 'old/triggers/swipe';
import FinishTrigger from 'old/triggers/finish';
import EventTrigger from 'old/triggers/event';
import EqualTrigger from 'old/triggers/equal';

var TriggerType = {
  'action-end': ActionEndTrigger,
  'action-start': ActionStartTrigger,
  'active': ActiveTrigger,
  'drop': DropTrigger,
  'swipe': SwipeTrigger,
  'finish': FinishTrigger,
  'event': EventTrigger,
  'equal': EqualTrigger
};

var TriggerFactory = {
  create: function(module, config) {
    if (!TriggerType[module.type]) {
      throw 'Invalid trigger module type: ' + module.type;
    }
    return new TriggerType[module.type](module, {
      config: config
    });
  }
};

export default TriggerFactory;
