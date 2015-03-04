'use strict';

import Backbone from 'backbone';
import ContainerView from 'views/area';

var PackView = ContainerView.extend({
  className: ContainerView.prototype.className + ' pack'
});

export default PackView;
