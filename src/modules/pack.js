'use strict';

Communicator.Modules.Pack = Communicator.Modules.Container.extend({
  // @Override
  defaults: function() {
    return _.defaults({
      name: '',
      size: new Communicator.Base.Size({
        width: '100',
        height: '100'
      })
    }, _.result(Communicator.Modules.Container.prototype, 'defaults'));
  }
});
