(function() {
  'use strict';

  Communicator.Modules.Area = Communicator.Modules.Abstract.extend({
    displayedProperties: _.clone(Communicator.Modules.Abstract.prototype.displayedProperties).concat(['background-color', 'border-width', 'border-color', 'border-radius', 'opacity', 'draggable', 'name']),
    complexProperties: _.clone(Communicator.Modules.Abstract.prototype.complexProperties).concat('style', 'size', 'position'),

    defaults: function() {
      return _.defaults({
        position: new Communicator.Base.Position({
          top: 0,
          left: 0
        }),
        style: new Communicator.Base.Style(),
        size: new Communicator.Base.Size({
          width: 10,
          height: 10
        }),
        draggable: false,
        droppableArea: false,
        swipable: false,
        snapback: 0
      }, _.result(Communicator.Modules.Abstract.prototype, 'defaults'));
    },

    isDraggable: function() {
      return !!this.get('draggable');
    },

    onActive: function() {
      this.trigger('active');
    },

    position: function(position, duration, onEnd) {
      this.get('position').set(position.toJSON());
      this.trigger('update:position', this.get('position'), duration, onEnd);
    },

    style: function(style, duration, onEnd) {
      this.get('style').set(style.toJSON());
      this.trigger('update:style', this.get('style'), duration, onEnd);
    },

    resize: function(size, duration, onEnd) {
      this.get('size').set(size.toJSON());
      this.trigger('update:size', this.get('size'), duration, onEnd);
    },

    onDrop: function(module) {
      this.trigger('drop', module.get('id'));
    },

    onSwipe: function(direction) {
      this.trigger('swipe', direction);
    },

    properties: function() {
      var properties = {
        label: 'Područje',
        fields: [].concat(Communicator.Modules.Abstract.prototype.properties.call(this).fields).concat([{
          name: 'background-color',
          label: 'Pozadina',
          type: 'color',
          value: this.get('style').get('background-color'),
          model: this.get('style'),
          options: {
            default: '#ffffff'
          }
        }, {
          name: 'border-width',
          label: 'Obrub',
          type: 'slider',
          value: this.get('style').get('border-width') || 0,
          model: this.get('style'),
          options: {
            step: 1,
            min: 0,
            max: 20,
            sufix: 'px'
          }
        }, {
          name: 'border-color',
          label: 'Boja obruba',
          type: 'color',
          value: this.get('style').get('border-color'),
          model: this.get('style'),
          options: {
            default: '#ffffff'
          }
        }, {
          name: 'border-radius',
          label: 'Zakrivljenost',
          type: 'slider',
          value: this.get('style').get('border-radius') || 0,
          model: this.get('style'),
          options: {
            step: 1,
            min: 0,
            max: 50,
            sufix: 'px'
          }
        }, {
          name: 'opacity',
          label: 'Prozirnost',
          type: 'slider',
          value: this.get('style').get('opacity') || 1,
          model: this.get('style'),
          options: {
            step: 0.05,
            min: 0,
            max: 1,
            label: '%'
          }
        }, {
          name: 'draggable',
          label: 'Povlači se',
          type: 'checkbox',
          value: this.get('draggable'),
          model: this,
          options: {}
        }, {
          name: 'droppableArea',
          label: 'Prihvaća objekte',
          type: 'checkbox',
          value: this.get('droppableArea'),
          model: this,
          options: {}
        }, {
          name: 'snapbackduration',
          label: 'Zadržava poziciju',
          value: this.get('snapbackduration'),
          model: this,
          type: 'text',
          options: {
            defaultVal: '0'
          }
        }])
      };
      return this._filterProperties(properties);
    }

  });
})();