'use strict';

var TriggerType = {
  'action-end': Communicator.Triggers.ActionEnd,
  'action-start': Communicator.Triggers.ActionStart,
  'active': Communicator.Triggers.Active,
  'drop': Communicator.Triggers.Drop,
  'swipe': Communicator.Triggers.Swipe,
  'finish': Communicator.Triggers.Finish,
  'event': Communicator.Triggers.Event,
  'equal': Communicator.Triggers.Equal
};

Communicator.Factories.Trigger = {
  create: function(module, config) {
    if (!TriggerType[module.type]) {
      throw 'Invalid trigger module type: ' + module.type;
    }
    return new TriggerType[module.type](module, {
      config: config
    });
  }
};
