'use strict';

var Backbone = require('backbone');
import AbstractAction from 'old/actions/abstract';

export default Backbone.Collection.extend({
  model: AbstractAction
});
