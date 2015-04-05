'use strict';

var _ = require('lodash');

import ContainerModule from 'old/modules/container';
import AreaModule from 'old/modules/area';
import ImageModule from 'old/modules/image';
import PackModule from 'old/modules/pack';
import CarouselModule from 'old/modules/carousel';
import TextModule from 'old/modules/text';
import InputModule from 'old/modules/input';
import VideoModule from 'old/modules/video';
import AudioModule from 'old/modules/audio';

import ActionFactory from 'old/factories/action';
import ModuleFactory from 'old/factories/module';
import Style from 'old/base/style';
import Size from 'old/base/size';
import Position from 'old/base/position';

var ModuleType = {
  'container': ContainerModule,
  'area': AreaModule,
  'image': ImageModule,
  'pack': PackModule,
  'carousel': CarouselModule,
  'text': TextModule,
  'input': InputModule,
  'video': VideoModule,
  'audio': AudioModule
};

var ModuleFactory = {

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
      preparedModule.style = new Style(module.style);
    }
    if (module.position) {
      preparedModule.position = new Position(module.position);
    }
    if (module.size) {
      preparedModule.size = new Size(module.size);
    }

    var moduleModel = new ModuleType[module.type](preparedModule, {
      config: configModel
    });

    _.each(module.children, function(child) {
      moduleModel.addChild(ModuleFactory.create(child, configModel));
    });

    _.each(module.actions, function(action) {
      ActionFactory.createForContainer(action, moduleModel, configModel);
    });

    return moduleModel;
  }
};

export default ModuleFactory;
