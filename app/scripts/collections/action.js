'use strict';

import Backbone from 'backbone';
import AbstractAction from 'actions/abstract';

export default Backbone.Collection.extend({
  model: AbstractAction
});
