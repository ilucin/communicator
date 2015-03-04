'use strict';

import _ from 'lodash';
import Backbone from 'backbone';
import ContainerModule from 'modules/container';
import Size from 'base/size';

var PackModule = ContainerModule.extend({
  // @Override
  defaults: function() {
    return _.defaults({
      name: '',
      size: new Size({
        width: '100',
        height: '100'
      })
    }, _.result(ContainerModule.prototype, 'defaults'));
  }
});

export default PackModule;
