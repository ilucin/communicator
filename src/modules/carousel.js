'use strict';

Communicator.Modules.Carousel = Communicator.Modules.Container.extend({
  // @Override
  defaults: function() {
    return _.defaults({
      itemChangeOnSwipe: true,
      currentItem: 0,
      size: new Communicator.Base.Size({
        width: '100',
        height: '100'
      })
    }, _.result(Communicator.Modules.Container.prototype, 'defaults'));
  },

  nextItem: function() {
    if (this.get('currentItem') < this.get('children').length - 1) {
      this.setCurrentItem(this.get('currentItem') + 1);
    }
  },

  previousItem: function() {
    if (this.get('currentItem') > 0) {
      this.setCurrentItem(this.get('currentItem') - 1);
    }
  },

  setCurrentItem: function(arg) {
    var num = _.isNumber(arg) ? arg : this.get('children').indexOf(arg);
    if (num >= 0 && num < this.get('children').length && num !== this.get('currentItem')) {
      this.set('currentItem', num);
      this.trigger('update:currentItem');
    }
  },

  // @Override
  onAfterChildAdd: function(child) {
    Communicator.Modules.Container.prototype.onAfterChildAdd.apply(this, arguments);
    if (this.get('itemChangeOnSwipe')) {
      this.listenTo(child, 'swipe', this._onChildSwipe, this);
    }
    this._updatePositionAndSize();
  },

  // @Override
  onAfterChildRemove: function(child) {
    Communicator.Modules.Container.prototype.onAfterChildRemove.apply(this, arguments);
    this._updatePositionAndSize();
  },

  _updatePositionAndSize: function() {
    var length = this.get('children').length;
    this.resize(new Communicator.Base.Size({
      width: 100 * length,
      height: this.get('size').get('height')
    }));

    var index = 0;
    this.get('children').each(function(child) {
      child.resize(new Communicator.Base.Size({
        width: 100 / length,
        height: 100
      }));
      child.position(new Communicator.Base.Position({
        top: child.get('position').get('top'),
        left: index * (100 / length)
      }));
      index++;
    }, this);
  },

  _onChildSwipe: function(direction) {
    if (direction === 'left') {
      this.nextItem();
    } else if (direction === 'right') {
      this.previousItem();
    }
  }

});
