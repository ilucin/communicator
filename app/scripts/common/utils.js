'use strict';

var _ = require('lodash');

var utils = {
  evaluatePropertyChain: function(ctx, chain) {
    if (chain === 'this') {
      return ctx;
    }

    var chainArr = chain.split('.');
    var val = ctx;
    for (var i = 0, l = chainArr.length; i < l; i++) {
      if (chainArr[i]) {
        val = val[chainArr[i]];
      }
    }
    return val;
  },

  createFunction: function(ctx, functionDefinition) {
    var startIndex = functionDefinition.indexOf('{');
    var endIndex = functionDefinition.lastIndexOf('}');
    var f = new Function(functionDefinition.slice(startIndex + 1, endIndex));
    return f.bind(ctx);
  },

  evaluate: function(expr) {
    return eval(expr);
  },

  evaluateProperty: function(ctx, prop) {
    if (typeof prop === 'string') {
      if (prop.indexOf('this') === 0) {
        return utils.evaluatePropertyChain(ctx, prop.replace('this', ''));
      } else if (prop.indexOf('() =>') === 0) {
        return utils.createFunction(ctx, prop);
      } else {
        return prop;
      }
    } else if (typeof prop === 'function') {
      return prop.apply(ctx);
    } else if (typeof prop === 'undefined') {
      return {};
    } else {
      return prop;
    }
  }
};

window.utils = utils;

module.exports = utils;
