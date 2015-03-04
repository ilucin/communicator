'use strict';

Communicator.Views.Area = Communicator.Views.Abstract.extend({
  className: Communicator.Views.Abstract.prototype.className + ' area',
  events: {
    'click': '_onTap'
  },

  // @Override
  initialize: function(options) {
    Communicator.Views.Abstract.prototype.initialize.call(this, options);
    this._hammerSettings = {
      swipe_velocity: 0.4,
      drag_block_horizontal: true,
      drag_block_vertical: true
    };
  },

  // @Override
  _initView: function() {
    Communicator.Views.Abstract.prototype._initView.call(this);

    if (this.model.get('draggable') && !!this.config.get('viewDrag')) {
      this._setViewDraggable();
    }

    if (this.isDroppableArea()) {
      this.$el.addClass('droppable-area');
    }
    if (this.isSwipable() && !!this.config.get('viewSwipe')) {
      this._setViewSwipable();
    }

    this.listenTo(this.model, 'update:position', this.setPosition, this);
    this.listenTo(this.model, 'update:style', this.setStyle, this);
    this.listenTo(this.model, 'update:size', this.setSize, this);

    this.setPosition(this.model.get('position'));
    this.setStyle(this.model.get('style'));
    this.setSize(this.model.get('size'));

    return this;
  },

  _calculateViewDimensions: function() {
    this.width = this.$el.width();
    this.height = this.$el.height();
    this.anchorWidth = this.width / 2;
    this.anchorHeight = this.height / 2;
  },

  _setTempTransition: function(clb) {
    var $el = this.$el;
    $el.on('transitionend', function() {
      $el.off('transitionend');
      $el.css({
        transitionDuration: 0
      });
      if (clb) {
        clb();
      }
    });
  },

  _onTap: function() {
    if (!!this.config.get('viewTap')) {
      this.model.onActive();
    }
  },

  _onBeforeAction: function() {
    return !!this.model.get('enabled');
  },

  _setViewDraggable: function() {
    this._drag = {
      throttle: 2
    };
    // debugger;
    this._hammer = Hammer(this.el, this._hammerSettings);
    this._hammer.on('dragstart', _.bind(this.onDragStart, this));
    this._hammer.on('drag', _.bind(this.onDrag, this));
    this._hammer.on('dragend', _.bind(this.onDragEnd, this));
  },

  _setViewSwipable: function() {
    this._hammer = this._hammer || Hammer(this.el, this._hammerSettings);
    this._hammer.on('swipe', _.bind(function(event) {
      if (event.target === this.el) {
        this.model.onSwipe(event.gesture.direction);
      }
    }, this));
  },

  _drawDraggedView: function() {
    var me = this;
    if ((++this._drag.drawCount) % this._drag.throttle === 0) {
      this.$el.css('webkitTransform', 'translate(' + this._drag.x + 'px,' + this._drag.y + 'px)');
    }
    this.animationFrame = window.requestAnimationFrame(function() {
      me._drawDraggedView();
    });
  },

  onDrag: function(e) {
    if (!this.model.get('enabled')) {
      return;
    }

    this._drag.x = e.gesture.touches[0].pageX - this._drag.startX;
    this._drag.y = e.gesture.touches[0].pageY - this._drag.startY;

    this._drag.left = this._drag.beforeDragLeft + ((this._drag.x / this.config.get('surfaceWidth')) * 100);
    this._drag.top = this._drag.beforeDragTop + ((this._drag.y / this.config.get('surfaceHeight')) * 100);

    e.gesture.preventDefault();

    this.trigger('drag', {
      target: this,
      x: this._drag.x,
      y: this._drag.y,
      left: this._drag.left,
      top: this._drag.top
    });
  },

  onDragStart: function(e) {
    if (!this.model.get('enabled')) {
      return;
    }

    this._drag.drawCount = 0;
    this.$el.addClass('dragging');

    this._drag.startX = e.gesture.touches[0].pageX;
    this._drag.startY = e.gesture.touches[0].pageY;

    this._drag.beforeDragLeft = parseFloat(this.el.style.left, 10);
    this._drag.beforeDragTop = parseFloat(this.el.style.top, 10);

    if (!this.animationFrame) {
      this._drawDraggedView();
    }

    this.trigger('drag:start', this);
  },

  onDragEnd: function(e) {
    if (!this.model.get('enabled')) {
      return;
    }

    window.cancelAnimationFrame(this.animationFrame);
    this.animationFrame = null;

    var newLeft = this._drag.beforeDragLeft;
    var newTop = this._drag.beforeDragTop;

    if (!this.isSnapback()) {
      // Move element to new position
      newLeft += ((this._drag.x / this.config.get('surfaceWidth')) * 100);
      newTop += ((this._drag.y / this.config.get('surfaceHeight')) * 100);

      if (newLeft <= 0) {
        newLeft = 0;
      } else if (newLeft > 95) {
        newLeft = 95;
      }

      if (newTop <= 0) {
        newTop = 0;
      } else if (newTop > 95) {
        newTop = 95;
      }

      this.model.get('position').setTop(newTop).setLeft(newLeft);
      this.$el.css({
        left: newLeft + '%',
        top: newTop + '%',
        webkitTransform: ''
      });
    } else {
      // Snap element back to old position (with transition)
      var me = this;
      this.$el.css({
        transition: 'all ' + this.model.get('snapbackDuration') + 'ms',
        webkitTransform: ''
      });
      this.$el.on('transitionend', function() {
        me.$el.css('transition', '');
      });
    }

    this.$el.removeClass('dragging');
    this.trigger('drag:end', {
      target: this,
      top: newTop,
      left: newLeft
    });
  },

  // *****************************************************
  // Public methods
  // *****************************************************

  onDragEnter: function() {
    if (!this._dragEnter) {
      this.$el.addClass('droppable-area-drag-entered');
      this._dragEnter = true;
    }
  },

  onDragLeave: function() {
    if (this._dragEnter) {
      this.$el.removeClass('droppable-area-drag-entered');
      this._dragEnter = false;
    }
  },

  onDrop: function(moduleView) {
    this.onDragLeave();
    this.model.onDrop(moduleView);
  },

  onDomAttach: function() {
    this._calculateViewDimensions();
    this.model.onLoad();
    Communicator.Views.Abstract.prototype.onDomAttach.apply(this, arguments);
  },

  isDroppableArea: function() {
    return this.model.get('droppableArea');
  },

  isDraggable: function() {
    return this.model.get('draggable');
  },

  isSnapback: function() {
    return !!this.model.get('snapback');
  },

  isSwipable: function() {
    return !!this.model.get('swipable');
  },

  getElWidth: function() {
    return 100 * (parseFloat(this.$el.css('width'), 10) / parseFloat(this.$el.parent().css('width'), 10));
  },

  getElHeight: function() {
    return 100 * (parseFloat(this.$el.css('height'), 10) / parseFloat(this.$el.parent().css('height'), 10));
  },

  setPosition: function(position, duration, onEnd) {
    this.setStyle(position, duration, onEnd);
  },

  setSize: function(size, duration, onEnd) {
    this.setStyle(size, duration, onEnd);
  },

  setStyle: function(style, duration, onEnd) {
    duration = parseInt(duration, 10);
    if (_.isNumber(duration) && duration > 0) {
      this.$el.css('transitionDuration', duration + 'ms');
      this._setTempTransition(onEnd);
    } else {
      if (onEnd) {
        onEnd();
      }
    }
    if (style.get('opacity') !== undefined && style.get('opacity') < this.config.get('viewMinOpacity')) {
      style.set('opacity', this.config.get('viewMinOpacity'));
    }
    this.$el.css(style.toJSON());
  },

  setAttribute: function(attribute, value) {
    this.$el.attr(attribute, value);
  }
});
