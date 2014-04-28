(function() {
  'use strict';

  var ModuleType = {
    'container': Communicator.Modules.Container,
    'area': Communicator.Modules.Area,
    'image': Communicator.Modules.Image,
    'pack': Communicator.Modules.Pack,
    'carousel': Communicator.Modules.Carousel,
    'text': Communicator.Modules.Text,
    'input': Communicator.Modules.Input,
    'video': Communicator.Modules.Video,
    'sound': Communicator.Modules.Sound
  };

  Communicator.Factories.Module = {

    complexObjects: ['children', 'actions', 'style', 'position', 'size'],

    create: function(module, configModel) {
      var preparedModule = _.clone(module, true);
      if (!ModuleType[module.type]) {
        throw 'Invalid preparedModule type: ' + preparedModule.type;
      }
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

      var moduleModel = new ModuleType[module.type](preparedModule, {
        config: configModel
      });

      _.each(module.children, function(child) {
        moduleModel.addChild(Communicator.Factories.Module.create(child, configModel));
      });

      _.each(module.actions, function(action) {
        Communicator.Factories.Action.createForContainer(action, moduleModel, configModel);
      });


      return moduleModel;
    }

  };
})();