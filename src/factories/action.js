(function() {
  'use strict';

  var ActionType = {
    'finish': Communicator.Actions.Finish,
    'position': Communicator.Actions.Position,
    'style': Communicator.Actions.Style,
    'invoke': Communicator.Actions.Invoke
  };

  Communicator.Factories.Action = {

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
        preparedModule.style = new Communicator.Base.Style(module.style);
      }
      if (module.position) {
        preparedModule.position = new Communicator.Base.Position(module.position);
      }
      if (module.size) {
        preparedModule.size = new Communicator.Base.Size(module.size);
      }

      var action = new ActionType[preparedModule.type](preparedModule, {
        config: config
      });
      containerModel.addAction(action);

      _.each(module.targetIds, function(targetId) {
        action.addTargetId(targetId);
      });

      _.each(module.triggers, function(trigger) {
        action.addTrigger(Communicator.Factories.Trigger.create(trigger, config));
      });

      return action;
    }

  };
})();