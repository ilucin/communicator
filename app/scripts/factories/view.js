'use strict';

import ContainerView from 'views/container';
import AreaView from 'views/area';
import ImageView from 'views/image';
import PackView from 'views/pack';
import CarouselView from 'views/carousel';
import TextView from 'views/text';
import InputView from 'views/input';
import VideoView from 'views/video';
import AudioView from 'views/audio';

var ViewType = {
  'container': ContainerView,
  'area': AreaView,
  'image': ImageView,
  'pack': PackView,
  'carousel': CarouselView,
  'text': TextView,
  'input': InputView,
  'video': VideoView,
  'audio': AudioView
};

var ViewFactory = {
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
    }, ViewFactory);

    moduleView.fixIndex();

    return moduleView;
  }
};

export default ViewFactory;
