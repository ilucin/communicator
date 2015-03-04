'use strict';

var ViewType = {
  'container': Communicator.Views.Container,
  'area': Communicator.Views.Area,
  'image': Communicator.Views.Image,
  'pack': Communicator.Views.Pack,
  'carousel': Communicator.Views.Carousel,
  'text': Communicator.Views.Text,
  'input': Communicator.Views.Input,
  'video': Communicator.Views.Video,
  'sound': Communicator.Views.Sound
};

Communicator.Factories.View = {
  create: function(moduleModel, config) {
    if (!ViewType[moduleModel.get('type')]) {
      throw 'Invalid module type: ' + moduleModel.get('type');
    }

    var children = [];
    if (moduleModel.has('children')) {
      moduleModel.get('children').each(function(child) {
        children.push(this.create(child, config));
      }, this);
    }

    var moduleView = new ViewType[moduleModel.get('type')]({
      model: moduleModel,
      children: children,
      config: config
    }, Communicator.Factories.View);

    moduleView.fixIndex();

    return moduleView;
  }
};
