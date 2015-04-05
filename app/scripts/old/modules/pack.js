'use strict';

var _ = require('lodash');
var Backbone = require('backbone');
import ContainerModule from 'old/modules/container';
import Size from 'old/base/size';

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
