'use strict';

var Backbone = require('backbone');
import AbstractModule from 'old/modules/abstract';

export default Backbone.Collection.extend({
  model: AbstractModule
});
