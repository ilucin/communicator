'use strict';

var DataSubmodule = {
  init: function(dataConfig) {
    this.data = dataConfig;
  },

  api: {
    setData: function(data) {
      this.data = data;
      this.onDataChange();
      this.trigger('change:data');
    }
  }
};

module.exports = DataSubmodule;
