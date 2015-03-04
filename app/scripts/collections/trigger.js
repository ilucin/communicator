'use strict';

import Backbone from 'backbone';
import AbstractTrigger from 'triggers/abstract';

export default Backbone.Collection.extend({
  model: AbstractTrigger
});
