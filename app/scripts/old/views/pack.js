'use strict';

var Backbone = require('backbone');
import ContainerView from 'old/views/container';

var PackView = ContainerView.extend({
  className: ContainerView.prototype.className + ' pack'
});

export default PackView;
