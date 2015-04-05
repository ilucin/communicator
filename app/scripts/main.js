'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');

window.$ = window.jQuery = $;
window._ = _;
Backbone.$ = $;

var Communicator = require('communicator');

$(function() {
  var hash = window.location.hash;
  var packName = hash.substr(1, hash.lenght) || 'test2';
  var pack;

  // db.init().then(function() {
  $.get('packs/' + packName + '.json', {
    async: false
  }).success(function(result) {
    var player = new Communicator(result);

    player.init().then(function() {
      player.display($('#main-container'));
    });

    window.player = player;
  });
  // });
});
