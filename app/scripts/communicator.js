'use strict';

var _ = require('lodash');
var Module = require('modules/base');

var Communicator = function(module) {
  this.module = module;
};

Communicator.prototype.init = function() {
  this.isInitialized = true;
  this.module = new Module(this.module);
  return Promise.resolve(this.module);
};

Communicator.prototype.display = function($container) {
  var self = this;
  this.hasRun = true;

  if (!this.isInitialized) {
    console.warn('Communicator is not initialized');
    return;
  }

  this.$container = $container || $('body');
  this.$container.html(this.module.view.$el);

  setTimeout(function() {
    self.module.onDisplay();
  });
};

Communicator.prototype.destroy = function() {
  if (this.isInitialized) {
    this.module.destroy();
  }
};

module.exports = Communicator;
