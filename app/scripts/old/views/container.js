'use strict';

var _ = require('lodash');
var Backbone = require('backbone');
import AreaView from 'old/views/area';
import H from 'old/components/helpers';

var ContainerView = AreaView.extend({
  className: AreaView.prototype.className + ' container',
  actionAlias: {
    'position': 'setChildPosition',
    'style': 'setChildStyle'
  },

  // @Override
  initialize: function(options) {
    AreaView.prototype.initialize.apply(this, arguments);

    this._childMap = {};
    this._children = [];
    this._droppableAreaMap = [];
    this._loadCount = 0;

    _.each(options.children, function(childView) {
      this.addChild(childView);
    }, this);

    this.listenTo(this.model, 'action:start', this.onActionStart, this);
  },

  // @Override
  onDomAttach: function() {
    _.each(this._children, function(child) {
      child.onDomAttach();
    }, this);

    if (this._children.length === 0) {
      this.model.onLoad();
    }
  },

  // @Override
  remove: function() {
    _.each(this._children, function(child) {
      child.remove();
    });
    AreaView.prototype.remove.apply(this, arguments);
  },

  addChild: function(child) {
    if (child.isDroppableArea()) {
      this._droppableAreaMap.push(child);
    }
    if (child.isDraggable()) {
      this.listenTo(child, 'drag', this._onChildDrag, this);
      this.listenTo(child, 'drag:end', this._onChildDragEnd, this);
    }
    child.setZIndex(this.getZIndex() + this._children.indexOf(child) + 1);
    this._childMap[child.getId()] = child;
    this._children.push(child);
    this.$el.append(child.render().el);
  },

  fixIndex: function() {
    _.each(this._children, function(child) {
      child.setZIndex(this.getZIndex() + this._children.indexOf(child) + 2);
      child.fixIndex();
    }, this);
  },

  removeChild: function(childSthg) {
    var childId = childSthg.model.get('id');
    var child = this._childMap[childId];
    this._children.splice(this._children.indexOf(child), 1);
    if (child.isDroppableArea()) {
      delete this._droppableAreaMap[childId];
    }
    this.stopListening(child);
    child.remove();
    delete this._childMap[childId];
  },

  getChildren: function() {
    return this._children;
  },

  _onChildLoad: function() {
    if (++this._loadCount === 0) {
      this.trigger('load');
    }
  },

  _onChildDrag: function(ev) {
    _.forOwn(this._droppableAreaMap, function(droppable) {
      if (H.isBoundingRectInArea(ev.target.el.getBoundingClientRect(), droppable.el.getBoundingClientRect())) {
        droppable.onDragEnter();
      } else {
        droppable.onDragLeave();
      }
    });
  },

  _onChildDragEnd: function(e) {
    _.forOwn(this._droppableAreaMap, function(droppable) {
      if (H.isBoundingRectInArea(e.target.el.getBoundingClientRect(), droppable.el.getBoundingClientRect())) {
        droppable.onDrop(e.target);
      }
    });
  },

  onActionStart: function(action, module, params, onEnd) {
    var child = this._childMap[module.get('id')];
    this[this.actionAlias[action.get('type')]](action, module, onEnd);
  }
});

export default ContainerView;
