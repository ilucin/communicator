'use strict';

$('document').ready(function() {

  var hash = window.location.hash;
  var packName = hash.substr(1, hash.lenght) || 'test';
  var pack;

  $.get('packs/' + packName + '.json', {
    async: false
  }).success(function(result) {
    pack = result;

    var player = new Communicator(pack, {
      viewTap: true,
      viewDrag: true,
      viewSwipe: true,
      triggersEnabled: true,
      dimensionRefreshInterval: 500
    });
    player.run($('#main-container'));
  });

});
