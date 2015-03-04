'use strict';

import Backbone from 'backbone';
import AbstractModule from 'modules/abstract';

export default Backbone.Collection.extend({
  model: AbstractModule
});
