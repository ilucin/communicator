(function() {
  'use strict';

  Communicator.Modules.Image = Communicator.Modules.Area.extend({
    displayedProperties: _.clone(Communicator.Modules.Area.prototype.displayedProperties).concat([]),
    mandatoryProperties: _.clone(Communicator.Modules.Area.prototype.mandatoryProperties).concat(['src']),

    defaults: function() {
      var defaults = {
        keepAspectRatio: false
      };
      return _.defaults(defaults, Communicator.Modules.Area.prototype.defaults.call(this));
    },

    properties: function() {
      var properties = {
        label: 'Slika',
        // TODO: This should only have resource field propertyje
        fields: [].concat(Communicator.Modules.Area.prototype.properties.call(this).fields)
      };
      return this._filterProperties(properties);
    }

  });
})();