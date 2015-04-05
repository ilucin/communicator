'use strict';

var _ = require('lodash');
var Backbone = require('backbone');
var Styler = require('common/Styler');

var HtmlView = Backbone.View.extend({
  initialize: function(opts) {
    this.template = opts.template;
    this.data = opts.data;
    this.el.id = opts.id;
    this.module = opts.module;

    this.styler = new Styler(opts.id);
    if (opts.style) {
      this.styler.addStyle(opts.style);
    }
    if (opts.styleRules) {
      this.styler.addStyleRules(opts.styleRules);
    }

    this.eventHandlers = {};
    _.each(opts.events, function(handler, ev) {
      var args = ev.split(' ');
      var split = handler.split(' => ');
      var funcName = split[0];
      var funcBody = split[1];
      this.eventHandlers[funcName] = (new Function(funcBody)).bind(this.module);
      args.push(this.eventHandlers[funcName]);
      this.$el.on.apply(this.$el, args);
    }, this);
    this.delegateEvents();
  },

  serializeData: function() {
    return this.data;
  },

  render: function() {
    if (this.template) {
      this.$el.html(this.template(this.serializeData()));
    }
    return this;
  },

  setData: function(data) {
    this.data = data;
  },

  layoutChildren: function(layout, children) {
    _.each(children, function(child) {
      var $container;
      if (child && child.view) {
        if (typeof layout === 'string') {
          $container = this.$(layout);
        } else if (typeof layout === 'object') {
          $container = this.$(layout[child.id]);
        }
      }

      if ($container.length > 0) {
        $container.append(child.view.$el);
      } else {
        console.warn('Could not find layout for child: ' + child.id);
      }
    }, this);
  }
});

module.exports = HtmlView;
