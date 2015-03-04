'use strict';

Communicator.Base.Config = Backbone.Model.extend({
  defaults: {
    surfaceWidth: 0,
    surfaceHeight: 0,
    surfaceRatio: 0.5625, // 720 x 1280
    dragVerticalOffset: 0,
    dragHorizontalOffset: 0,
    triggersEnabled: false,
    viewDrag: false,
    viewSwipe: false,
    viewTap: false,
    viewMinOpacity: 0,
    viewCarouselUpdateCurrentItem: true,
    fontSize: 12,
    dimensionRefreshInterval: 0
  }
});
