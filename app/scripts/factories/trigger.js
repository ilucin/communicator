'use strict';

import ActionEndTrigger from 'triggers/action-end';
import ActionStartTrigger from 'triggers/action-start';
import ActiveTrigger from 'triggers/active';
import DropTrigger from 'triggers/drop';
import SwipeTrigger from 'triggers/swipe';
import FinishTrigger from 'triggers/finish';
import EventTrigger from 'triggers/event';
import EqualTrigger from 'triggers/equal';

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
