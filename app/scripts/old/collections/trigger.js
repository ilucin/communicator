'use strict';

var Backbone = require('backbone');
import AbstractTrigger from 'old/triggers/abstract';

export default Backbone.Collection.extend({
  model: AbstractTrigger
});
