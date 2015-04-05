'use strict';

var _ = require('lodash');
var utils = require('common/utils');
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

    _.each(opts.events, function(handler, ev) {
      this.$el.on.apply(this.$el, ev.split(' ').concat(utils.createFunction(this.module, handler)));
    }, this);
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
