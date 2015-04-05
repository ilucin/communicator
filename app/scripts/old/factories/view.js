'use strict';

import ContainerView from 'old/views/container';
import AreaView from 'old/views/area';
import ImageView from 'old/views/image';
import PackView from 'old/views/pack';
import CarouselView from 'old/views/carousel';
import TextView from 'old/views/text';
import InputView from 'old/views/input';
import VideoView from 'old/views/video';
import AudioView from 'old/views/audio';

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
