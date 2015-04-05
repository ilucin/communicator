'use strict';

var _ = require('lodash');

var compilers = {
  ejs: function(template) {
    return _.template(template);
  }
};

module.exports = {
  compile: function(type, template) {
    return compilers[type](template);
  }
};
