'use strict';

import _ from 'lodash';

import ContainerModule from 'modules/container';
import AreaModule from 'modules/area';
import ImageModule from 'modules/image';
import PackModule from 'modules/pack';
import CarouselModule from 'modules/carousel';
import TextModule from 'modules/text';
import InputModule from 'modules/input';
import VideoModule from 'modules/video';
import AudioModule from 'modules/audio';

import ActionFactory from 'factories/action';
import ModuleFactory from 'factories/module';
import Style from 'base/style';
import Size from 'base/size';
import Position from 'base/position';

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
