'use strict';

function createSheet() {
  var style = document.createElement('style');
  style.appendChild(document.createTextNode(''));
  document.head.appendChild(style);
  return style.sheet;
}

function Styler(viewId) {
  this.viewId = viewId;
  this.sheet = createSheet();
}

Styler.prototype.insertRule = function(rule) {
  this.sheet.insertRule(rule, 0);
};

Styler.prototype.addStyle = function(styles) {
  styles = styles.replace(new RegExp('this', 'g'), '#' + this.viewId);
  var splitStyles = styles.split('}');
  var splitStyle;

  for (var i = 0, l = splitStyles.length; i < l; i++) {
    splitStyle = splitStyles[i].trim();
    if (splitStyle) {
      this.insertRule(splitStyle + '}');
    }
  }
};

Styler.prototype.addStyleRules = function(styleRules) {
  var style;
  for (var i = 0, l = styleRules.length; i < l; i++) {
    style = styleRules[i].trim().replace(new RegExp('this', 'g'), '#' + this.viewId);
    if (style) {
      this.insertRule(style);
    }
  }
};

module.exports = Styler;
