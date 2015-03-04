'use strict';

Communicator.Components.Helpers = {
  checkProperties: function(obj, properties) {
    if (!obj || !properties) {
      throw 'MISSING MANDATORY PROPERTY';
    }
    for (var i = 0; i < properties.length; i++) {
      if (!obj.hasOwnProperty(properties[i])) {
        throw 'MISSING MANDATORY PROPERTY: -' + properties[i] + '-';
      }
    }
    return true;
  }
};
