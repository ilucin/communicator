var Communicator = window.Communicator = (function(global, $, _, Backbone, Hammer) {
  'use strict';

  var Communicator = function(module, config) {
    this.config = new Communicator.Base.Config(config);
    this._containerLastDimensions = {};

    if (_.isPlainObject(module)) {
      this.moduleModel = Communicator.Factories.Module.create(module, this.config);
      this.moduleView = Communicator.Factories.View.create(this.moduleModel, this.config);
    } else if (module instanceof Communicator.Modules.Abstract) {
      this.moduleModel = module;
      this.moduleView = Communicator.Factories.View.create(this.moduleModel, this.config);
    } else if (module instanceof Communicator.Views.Abstract) {
      this.moduleModel = module.model;
      this.moduleView = module;
    } else {
      throw 'Invalid arguments for Communicator instance';
    }

    this.initialize(arguments);
  };

  _.extend(Communicator.prototype, {
    minDimensionsRefreshInterval: 100,

    initialize: function() {},

    run: function($container, $surface) {
      if (!$surface) {
        $surface = $('<div>').addClass('komunikator-player-surface');
        $container.html($surface);
      }

      this.$surface = $surface;
      this.$surfaceContainer = $container;

      this._updateSurfaceDimensions();
      $surface.html(this.moduleView.render().el);

      setTimeout(_.bind(function() {
        this.moduleView.onDomAttach.call(this.moduleView);
      }, this), 0);

      if (this.config.has('dimensionRefreshInterval') && this.config.get('dimensionRefreshInterval') > this.minDimensionsRefreshInterval) {
        this.dimensionTimer = window.setInterval(_.bind(this._checkForContainerDimensionChange, this), this.config.get('dimensionRefreshInterval'));
      }
    },

    stop: function() {
      if (this.dimensionTimer) {
        window.clearInterval(this.dimensionTimer);
      }
      this.moduleView.remove();
    },

    onDomAttach: function() {
      this._updateSurfaceDimensions();
    },

    _checkForContainerDimensionChange: function() {
      var cld = this._containerLastDimensions;
      var width = this.$surfaceContainer.width();
      var height = this.$surfaceContainer.height();
      if (cld && (width !== cld.width || height !== cld.height)) {
        this._updateSurfaceDimensions();
      }
      this._containerLastDimensions.width = width;
      this._containerLastDimensions.height = height;
    },

    _updateSurfaceDimensions: function() {
      var scWidth = this.$surfaceContainer.width();
      var scHeight = this.$surfaceContainer.height();
      var scRatio = scHeight / scWidth;
      var sHeight = scHeight;
      var sWidth = scWidth;
      var fontSize = sWidth * 0.025;

      if (scRatio < this.config.get('surfaceRatio')) {
        sWidth = scHeight * (1 / this.config.get('surfaceRatio'));
      } else {
        sHeight = scWidth * this.config.get('surfaceRatio');
      }

      this.config.set({
        dragVerticalOffset: (scHeight - sHeight) / 2,
        dragHorizontalOffset: (scWidth - sWidth) / 2,
        surfaceWidth: sWidth,
        surfaceHeight: sHeight,
        fontSize: sWidth * 0.025
      });

      this.$surface.css({
        'width': sWidth + 'px',
        'height': sHeight + 'px',
        'font-size': fontSize + 'px'
      });
    }
  });

  Communicator.Base = {};
  Communicator.Modules = {};
  Communicator.Actions = {};
  Communicator.Collections = {};
  Communicator.Components = {};
  Communicator.Factories = {};
  Communicator.Views = {};
  Communicator.Triggers = {};

  return Communicator;
})(this, $, _, Backbone, Hammer);
(function() {
  'use strict';

  Communicator.Components.Helpers = {
    checkProperties: function(obj, properties) {
      if (!obj || !properties) {
        throw 'MISSING MANDATORY PROPERTY';
      }
      for (var i = 0; i < properties.length; i++) {
        if (!obj.hasOwnProperty(properties[i])) {
          throw 'MISSING MANDATORY PROPERTY: -' + properties[i] + '-';
        }
      }
      return true;
    }
  };

})();
(function() {
  'use strict';

  Communicator.Components.IdManager = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(Communicator.Components.IdManager.prototype, {

    initialize: function() {
      this._data = {
        action: {
          counters: {},
          ids: {}
        },
        object: {
          counters: {},
          ids: {}
        },
        trigger: {
          counters: {},
          ids: {}
        }
      };
    },

    getNewTriggerId: function(actionId) {
      return this._getNewId('trigger', actionId);
    },

    getNewObjectId: function(type) {
      return this._getNewId('object', type);
    },

    registerObjectId: function(type, id) {
      return this._registerId('object', type, id);
    },

    getNewActionId: function(objectId) {
      return this._getNewId('action', objectId);
    },


    isObjectIdTaken: function(type, id) {
      return this._isIdTaken('object', type, id);
    },

    isActionIdTaken: function(objectId, actionId) {
      return this._isIdTaken('action', objectId, actionId);
    },

    _getNewId: function(type, key) {
      this._createKeyIfNotExist(type, key);
      var id;
      do {
        this._data[type].counters[key] += 1;
        id = type + '_' + key + '_' + this._data[type].counters[key];
      } while (this._isIdTaken(type, key, id));

      this._data[type].ids[key].push(id);
      return id;
    },

    _registerId: function(type, key, id) {
      if (!this._isIdTaken(type, key, id)) {
        this._createKeyIfNotExist(type, key);
        this._data[type].ids[key].push(id);
        this._data[type].counters[key]++;
      }
    },

    _createKeyIfNotExist: function(type, key) {
      if (!this._data[type].ids.hasOwnProperty(key)) {
        this._data[type].ids[key] = [];
        this._data[type].counters[key] = 0;
      }
    },

    _isIdTaken: function(type, key, id) {
      var result;
      if (this._data[type].ids.hasOwnProperty(key)) {
        result = this._data[type].ids[key].indexOf(id) >= 0;
      }
      return !!result;
    }

  });

})();
/*globals Communicator, $, _, Backbone, Hammer*/

(function() {
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

})();
(function() {
  'use strict';

  Communicator.Base.Position = Backbone.Model.extend({

    defaults: {
      top: '0%',
      left: '0%'
    },

    initialize: function(attributes) {
      Communicator.Components.Helpers.checkProperties(attributes, ['top', 'left']);
      this.clear({
        silent: true
      });
      this.setTop(attributes.top);
      this.setLeft(attributes.left);
    },

    setTop: function(top) {
      this._top = parseFloat(top, 10);
      this.set('top', this._top + '%');
      return this;
    },

    setLeft: function(left) {
      this._left = parseFloat(left, 10);
      this.set('left', this._left + '%');
      return this;
    },

    getTopValue: function() {
      return this._top;
    },

    getLeftValue: function() {
      return this._left;
    }

  });

})();
(function() {
  'use strict';

  Communicator.Base.Size = Backbone.Model.extend({

    defaults: {
      width: '0%',
      height: '0%'
    },

    initialize: function(attributes) {
      Communicator.Components.Helpers.checkProperties(attributes, ['width', 'height']);
      this.clear({
        silent: true
      });
      this.setWidth(attributes.width);
      this.setHeight(attributes.height);
    },

    setWidth: function(width) {
      this._width = parseFloat(width, 10);
      this.set('width', this._width + '%');
      return this;
    },

    setHeight: function(height) {
      this._height = parseFloat(height, 10);
      this.set('height', this._height + '%');
      return this;
    },

    getWidthValue: function() {
      return this._width;
    },

    getHeightValue: function() {
      return this._height;
    }

  });

})();
(function() {
  'use strict';

  Communicator.Base.Style = Backbone.Model.extend({});

})();
(function() {
  'use strict';

  Communicator.Triggers.Abstract = Backbone.Model.extend({
    defaults: {
      arguments: {},
      delay: 0
    },

    initialize: function(attributes, options) {
      options = options || {};
      Communicator.Components.Helpers.checkProperties(attributes, ['type', 'sourceModuleId']);
      this.config = options.config || new Communicator.Base.Config();
      this.module = attributes;
      this._count = 0;
      this._initTrigger();
    },

    _initTrigger: function() {},

    setConfig: function(config) {
      this.config = config;
    },

    hasTriggered: function() {
      return this._count > 0;
    },

    getCount: function() {
      return this._count;
    },

    debug: function() {
      console.log('Trigger:', this.get('id'), 'on', this.get('sourceModuleId'), 'when', this._getEventName());
    },

    cleanup: function() {
      this.stopListening();
    },

    reset: function() {
      this._count = 0;
    },

    setContainerModule: function(container) {
      this._setSourceModule(this._getSourceModuleFromContainer(container));
    },

    _getEventName: function() {
      return this.get('type');
    },

    _getSourceModuleFromContainer: function() {
      throw 'Not implemented. This is abstract method';
    },

    _setSourceModule: function(module) {
      this._sourceModule = module;
      if (module.get('id') !== this.get('sourceModuleId')) {
        throw 'Invalid module';
      }
      this.listenTo(module, this._getEventName(), this._onEvent, this);
      // console.log('ListenTo: Trigger', this.get('id'), 'is listening to module', module.get('id'), 'for', this._getEventName());
    },

    _onBeforeEvent: function() {
      return true;
    },

    _onEvent: function(params) {
      var me = this;
      if ( !! this._onBeforeEvent(params) && this.config.get('triggersEnabled')) {
        setTimeout(function() {
          me._count++;
          // console.log('Trigger: ', me.get('id'));
          me.trigger('trigger', params);
        }, this.get('delay'));
      }
    }

  });
})();
(function() {
  'use strict';

  Communicator.Triggers.ActionEnd = Communicator.Triggers.Abstract.extend({

    _getSourceModuleFromContainer: function(container) {
      return container.getActionById(this.get('sourceModuleId'));
    },

    _getEventName: function() {
      return 'end';
    },

    _onBeforeEvent: function(action) {
      return this.get('sourceModuleId') === action.get('id');
    }

  });
})();
(function() {
  'use strict';

  Communicator.Triggers.ActionStart = Communicator.Triggers.Abstract.extend({

    _getSourceModuleFromContainer: function(container) {
      return container.getActionById(this.get('sourceModuleId'));
    },

    _getEventName: function() {
      return 'start';
    },

    _onBeforeEvent: function(action) {
      return this.get('sourceModuleId') === action.get('id');
    }

  });
})();
(function() {
  'use strict';

  Communicator.Triggers.Active = Communicator.Triggers.Abstract.extend({

    _getSourceModuleFromContainer: function(container) {
      return container.getChildById(this.get('sourceModuleId'));
    },

    _getEventName: function() {
      return 'active';
    }

  });
})();
(function() {
  'use strict';

  Communicator.Triggers.Drop = Communicator.Triggers.Abstract.extend({

    _getSourceModuleFromContainer: function(container) {
      return container.getChildById(this.get('sourceModuleId'));
    },

    _getEventName: function() {
      return 'drop';
    },

    _onBeforeEvent: function(droppedModuleId) {
      return this.get('droppedModuleId') === droppedModuleId;
    }

  });
})();
(function() {
  'use strict';

  Communicator.Triggers.Equal = Communicator.Triggers.Abstract.extend({

    setContainerModule: function(container) {
      if (this._sourceModule) {
        this.stopListening(this._sourceModule);
      }
      Communicator.Triggers.Abstract.prototype.setContainerModule.apply(this, arguments);
      this.listenTo(this._sourceModule, 'change:' + this.get('attribute'), this.onAttributeChange, this);
    },

    _getSourceModuleFromContainer: function(container) {
      return container.getChildById(this.get('sourceModuleId'));
    },

    _getEventName: function() {
      return '';
    },

    onAttributeChange: function() {
      if (this._sourceModule.get(this.get('attribute')) === this.get('attributeValue')) {
        this._onEvent();
      }
    }

  });
})();
(function() {
  'use strict';

  Communicator.Triggers.Event = Communicator.Triggers.Abstract.extend({

    _getSourceModuleFromContainer: function(container) {
      return container.getChildById(this.get('sourceModuleId'));
    },

    _getEventName: function() {
      return this.get('event');
    }

  });
})();
(function() {
  'use strict';

  Communicator.Triggers.Finish = Communicator.Triggers.Abstract.extend({

    _getSourceModuleFromContainer: function(container) {
      return container.getChildById(this.get('sourceModuleId'));
    },

    _getEventName: function() {
      return 'finish';
    }

  });
})();
(function() {
  'use strict';

  Communicator.Triggers.Swipe = Communicator.Triggers.Abstract.extend({

    _getSourceModuleFromContainer: function(container) {
      return container.getChildById(this.get('sourceModuleId'));
    },

    _getEventName: function() {
      return 'swipe';
    }

  });
})();
(function() {
  'use strict';

  Communicator.Actions.Abstract = Backbone.Model.extend({

    mandatoryProperties: ['type'],

    properties: function() {
      return {
        label: 'Akcija',
        fields: [{
          name: 'name',
          label: 'Ime',
          type: 'text',
          value: this.get('name'),
          editable: true,
          options: {
            defaultVal: 'Akcija'
          }
        }]
      };
    },

    defaults: function() {
      return {
        triggers: new Communicator.Collections.Trigger(),
        targetIds: [],
        expression: 'true',
        name: 'New action',
        duration: 0,
        repeatable: true
      };
    },

    setConfig: function(config) {
      this.config = config;
    },

    initialize: function(module, options) {
      options = options || {};
      Communicator.Components.Helpers.checkProperties(module, this.mandatoryProperties);
      this.config = options.config || new Communicator.Components.Config();
      this.module = module;
      this._idManager = new Communicator.Components.IdManager();
      this._started = false;
      this.onEnd = _.bind(this.onEnd, this);
    },

    debug: function() {
      console.log('Action:', this.get('id'), 'will', this.get('type'), 'targets:', this.get('targetIds').join(','), 'on', this.get('triggers').length, 'triggers');
    },

    hasTargetId: function(targetId) {
      return this.get('targetIds').indexOf(targetId) >= 0;
    },

    onBeforeAddTargetId: function() {
      return true;
    },

    addTargetId: function(targetId) {
      if (this.hasTargetId(targetId)) {
        return console.warn('Action already has target with this id: ' + targetId);
      }
      if (this.onBeforeAddTargetId(targetId)) {
        this.get('targetIds').push(targetId);
      }
    },

    removeTargetId: function(targetId) {
      var index = this.get('targetIds').indexOf(targetId);
      if (index >= 0) {
        this.get('targetIds').splice(index, 1);
      } else {
        throw 'Action doesnt have that target id: ' + targetId;
      }
    },

    hasTrigger: function(trigger) {
      return this.get('triggers').indexOf(trigger) >= 0;
    },

    addTrigger: function(trigger) {
      if (!trigger.has('id')) {
        trigger.set('id', this._idManager.getNewTriggerId(this.get('id')));
      }
      if (this.hasTrigger(trigger)) {
        throw 'Action already has that trigger: ' + trigger.get('id');
      } else {
        if (this._containerModule) {
          trigger.setContainerModule(this._containerModule);
        }
        trigger.setConfig(this.config);
        this.listenTo(trigger, 'trigger', this.onTriggerTrigger, this);
        this.get('triggers').add(trigger);
        // console.log('ListenTo: Action', this.get('id'), 'is listening on trigger', trigger.get('id'));
      }
    },

    removeTrigger: function(trigger) {
      if (this.hasTrigger(trigger)) {
        this.stopListening(trigger);
        trigger.cleanup();
        this.get('triggers').remove(trigger);
      } else {
        throw 'Action doesnt have that trigger: ' + trigger.get('id');
      }
    },

    onTriggerTrigger: function(params) {
      if (this.evaluateExpression()) {
        this.start(params);
      }
    },

    // Split it over ( ) & | and validate variables
    validateExpression: function(expr) {
      var variables = expr.split(/\(|\)|\s|&&|\|/);
      var valid = true;
      _.forEach(variables, function(variable) {
        if (variable) {
          if (!this.get('triggers').findWhere({
            id: variable
          })) {
            valid = false;
          }
        }
      }, this);
      return valid;
    },

    evaluateExpression: function() {
      var assignVariables = '';
      this.get('triggers').each(function(trigger) {
        assignVariables += 'var ' + trigger.get('id') + '=!!' + trigger.getCount() + ';';
      });
      return window.eval(assignVariables + this.get('expression'));
    },

    setContainerModule: function(containerModule) {
      if (this._containerModule) {
        return;
      }

      this._containerModule = containerModule;
      this.get('triggers').each(function(trigger) {
        trigger.setSourceModule(containerModule.getChildById(trigger.get('sourceModuleId')));
      });
    },

    start: function(params) {
      if (this.get('targetIds').length <= 0) {
        console.warn('Warning: action doesnt have targets');
      }
      this._started = true;
      _.each(this.get('targetIds'), function(targetId) {
        this.startForTarget(targetId, params);
      }, this);
      this.trigger('start', this);
      console.log('Action', this.get('id'), this.get('type'), 'started');
    },

    startForTarget: function(targetId, params) {
      this._containerModule.onActionStart(this, targetId, params, this.onEnd);
    },

    onEnd: function() {
      this._started = false;
      this.resetTriggers();
      this._containerModule.onActionEnd(this);
      console.log('Action', this.get('id'), this.get('type'), 'ended');
      this.trigger('end', this);
    },

    isRunning: function() {
      return this._started;
    },

    resetTriggers: function() {
      this.get('triggers').each(function(trigger) {
        trigger.reset();
      });
    },

    getParams: function() {},

    toJSON: function() {
      return _.defaults({
        triggers: this.get('triggers').toJSON()
      }, Backbone.Model.prototype.toJSON.call(this));
    },

  });
})();
(function() {
  'use strict';

  Communicator.Actions.Finish = Communicator.Actions.Abstract.extend({
    properties: function() {
      return {
        label: 'Akcija za završetak',
        fields: [].concat(Communicator.Actions.Abstract.prototype.properties.call(this).fields).concat([])
      };
    },

    defaults: function() {
      return _.defaults({
        targetIds: ['']
      }, Communicator.Actions.Abstract.prototype.defaults.call(this));
    }

  });
})();
(function() {
  'use strict';

  Communicator.Actions.Invoke = Communicator.Actions.Abstract.extend({

    mandatoryProperties: _.clone(Communicator.Actions.Abstract.prototype.mandatoryProperties).concat(['method']),

    properties: function() {
      return {
        label: 'Akcija pokretanja',
        fields: [].concat(Communicator.Actions.Abstract.prototype.properties.call(this).fields).concat([])
      };
    },

    defaults: function() {
      return _.defaults({
        arguments: []
      }, Communicator.Actions.Abstract.prototype.defaults.call(this));
    },

    getParams: function() {
      return this.get('method');
    }

  });
})();
(function() {
  'use strict';

  Communicator.Actions.Position = Communicator.Actions.Abstract.extend({

    mandatoryProperties: _.clone(Communicator.Actions.Abstract.prototype.mandatoryProperties).concat([]),

    defaults: function() {
      return _.defaults({
        position: new Communicator.Base.Position({
          top: 0,
          left: 0
        })
      }, _.result(Communicator.Actions.Abstract.prototype, 'defaults'));
    },

    properties: function() {
      return {
        label: 'Akcija pomicanja',
        fields: [].concat(Communicator.Actions.Abstract.prototype.properties.call(this).fields).concat([{
          name: 'duration',
          label: 'Duration',
          type: 'slider',
          model: _.bind(function() {
            return this;
          }, this),
          options: {
            step: 1,
            min: 20,
            max: 4000,
            label: 'ms',
          }
        }, {
          name: 'left',
          label: 'X pozicija',
          type: 'slider',
          model: _.bind(function() {
            return this.get('position');
          }, this),
          options: {
            step: 1,
            min: 0,
            max: 100,
            label: '%',
          }
        }, {
          name: 'top',
          label: 'Y pozicija',
          type: 'slider',
          model: _.bind(function() {
            return this.get('position');
          }, this),
          options: {
            step: 1,
            min: 0,
            max: 100,
            label: '%',
          }
        }])
      };
    },

    getParams: function() {
      return this.get('position');
    },

    start: function() {
      Communicator.Actions.Abstract.prototype.start.call(this);
    },

    toJSON: function() {
      return _.defaults({
        position: this.get('position').toJSON()
      }, Communicator.Actions.Abstract.prototype.toJSON.call(this));
    },

    onBeforeAddTargetId: function(targetId) {
      return targetId.length > 0;
    }

  });
})();
(function() {
  'use strict';

  Communicator.Actions.Resize = Communicator.Actions.Abstract.extend({

    mandatoryProperties: _.clone(Communicator.Actions.Abstract.prototype.mandatoryProperties).concat(['size']),

    properties: function() {
      return {
        label: 'Akcija promjene veličine',
        fields: [].concat(Communicator.Actions.Abstract.prototype.properties.call(this).fields).concat([])
      };
    },

    getParams: function() {
      return this.get('size');
    },

    toJSON: function() {
      return _.defaults({
        size: this.get('size').toJSON()
      }, Communicator.Actions.Abstract.prototype.toJSON.call(this));
    },

    onBeforeAddTargetId: function(targetId) {
      return targetId.length > 0;
    }

  });
})();
(function() {
  'use strict';

  Communicator.Actions.Style = Communicator.Actions.Abstract.extend({

    mandatoryProperties: _.clone(Communicator.Actions.Abstract.prototype.mandatoryProperties).concat([]),

    defaults: function() {
      return _.defaults({
        style: new Communicator.Base.Style({
          transparency: 1,
          'border-width': '0px',
          'background-color': '#ffffff'
        })
      }, _.result(Communicator.Actions.Abstract.prototype, 'defaults'));
    },

    properties: function() {
      return {
        label: 'Akcija promjena izgleda',
        fields: [].concat(Communicator.Actions.Abstract.prototype.properties.call(this).fields).concat([{
          name: 'duration',
          label: 'Duration',
          type: 'slider',
          options: {
            step: 10,
            min: 0,
            max: 3000,
            label: 'ms',
          }
        }, {
          name: 'opacity',
          label: 'Prozirnost',
          type: 'slider',
          model: _.bind(function() {
            return this.get('style');
          }, this),
          options: {
            step: 0.05,
            min: 0,
            max: 1,
            label: '',
          }
        }, {
          name: 'border-width',
          label: 'Rub',
          type: 'slider',
          model: _.bind(function() {
            return this.get('style');
          }, this),
          options: {
            step: 0.1,
            min: 0,
            max: 3,
            label: '',
          }
        }, {
          name: 'background-color',
          label: 'Pozadina',
          type: 'color',
          model: _.bind(function() {
            return this.get('style');
          }, this),
          options: {
            default: '#ffffff'
          }
        }])
      };
    },

    getParams: function() {
      return this.get('style');
    },

    toJSON: function() {
      return _.defaults({
        style: this.get('style').toJSON()
      }, Communicator.Actions.Abstract.prototype.toJSON.call(this));
    }

  });
})();
(function() {
  'use strict';

  Communicator.Modules.Abstract = Backbone.Model.extend({
    displayedProperties: [],
    complexProperties: [],
    mandatoryProperties: ['type'],

    defaults: {
      enabled: true
    },

    initialize: function(module, options) {
      options = options || {};
      Communicator.Components.Helpers.checkProperties(module, this.mandatoryProperties);

      this.module = module;
      this.config = options.config || new Communicator.Base.Config();

      this.listenTo(this.get('style'), 'change', function() {
        this.trigger('update:style', this.get('style'));
      });
      this.listenTo(this.get('position'), 'change', function() {
        this.trigger('update:position', this.get('position'));
      });
      this.listenTo(this.get('size'), 'change', function() {
        this.trigger('update:size', this.get('size'));
      });
    },

    onLoad: function() {
      this.trigger('load');
    },

    invoke: function(method, duration, onEnd) {
      this[method](duration, onEnd);
    },

    toggleEnabled: function(duration, onEnd) {
      this.set('enabled', !this.get('enabled'));
      this.trigger('update:enabled', duration, onEnd);
    },

    finish: function() {
      this.trigger('finish', this);
    },

    toJSON: function() {
      var json = {};
      _.each(this.complexProperties, function(complexProperty) {
        json[complexProperty] = this.get(complexProperty).toJSON();
      }, this);
      return _.defaults(json, Backbone.Model.prototype.toJSON.call(this));
    },

    properties: function() {
      return {
        label: 'Module',
        fields: [{
          name: 'id',
          label: 'ID',
          type: 'text',
          editable: false,
          value: this.get('id'),
          model: this,
          options: {
            defaultVal: 'object id'
          }
        }, {
          name: 'name',
          label: 'Ime',
          type: 'text',
          value: this.get('name') || 'Neimenovan',
          editable: true,
          model: this,
          options: {
            defaultVal: 'Postavite ime'
          }
        }]
      };
    },

    setConfig: function(config) {
      this.config = config;
    },

    _filterProperties: function(props) {
      var result = [];
      _.forEach(props.fields, function(field) {
        if (this.displayedProperties.indexOf(field.name) >= 0) {
          result.push(field);
        }
      }, this);
      props.fields = result;
      return props;
    }

  });
})();
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
(function() {
  'use strict';

  // value string
  Communicator.Modules.Text = Communicator.Modules.Area.extend({
    displayedProperties: _.clone(Communicator.Modules.Area.prototype.displayedProperties).concat(['color', 'value', 'font-size', 'font-weight', 'font-family', 'text-align']),
    mandatoryProperties: _.clone(Communicator.Modules.Area.prototype.mandatoryProperties).concat([]),

    defaults: function() {
      var defaults = {
        'type': 'text',
        'draggable': false,
        'font-size': '120%',
        'height': '8%',
        'font-weight': '400',
        'color': '#000',
        'border': '0',
        'value': 'Text'
      };
      return _.defaults(defaults, Communicator.Modules.Area.prototype.defaults.call(this));
    },

    properties: function() {
      var properties = {
        label: 'Tekst',
        fields: [].concat(Communicator.Modules.Area.prototype.properties.call(this).fields).concat([{
          name: 'color',
          label: 'Boja',
          type: 'color',
          value: this.get('style').get('color') || '#000',
          model: this.get('style'),
          options: {
            default: '#000',
            prefix: '#'
          }
        }, {
          name: 'value',
          label: 'Tekst',
          type: 'text',
          value: this.get('value'),
          model: this,
          options: {
            defaultVal: 'placeholder text'
          }
        }, {
          name: 'font-size',
          label: 'Veličina',
          type: 'slider',
          value: this.get('style').get('font-size') || 100,
          model: this.get('style'),
          options: {
            step: 10,
            min: 50,
            max: 300,
            label: '%',
            sufix: '%'
          }
        }, {
          name: 'font-weight',
          label: 'Debljina slova',
          type: 'select',
          value: this.get('style').get('font-weight') || 400,
          model: this.get('style'),
          selectOptions: [{
            value: 'lighter',
            label: 'Tanka'
          }, {
            value: 'normal',
            label: 'Normalna'
          }, {
            value: 'bold',
            label: 'Debela'
          }]
        }, {
          name: 'font-family',
          label: 'Vrsta slova',
          type: 'select',
          value: this.get('style').get('font-family') || 'sans',
          model: this.get('style'),
          selectOptions: [{
            value: 'sans-serif',
            label: 'Sans'
          }, {
            value: 'serif',
            label: 'Serif'
          }, {
            value: 'monospace',
            label: 'Monospace'
          }, {
            value: 'Arial',
            label: 'Arial'
          }, {
            value: 'Times new Roman',
            label: 'Times new Roman'
          }, {
            value: 'Verdana',
            label: 'Verdana'
          }]
        }, {
          name: 'text-align',
          label: 'Poravnavanje',
          type: 'select',
          value: this.get('style').get('text-align') || 'left',
          model: this.get('style'),
          selectOptions: [{
            value: 'left',
            label: 'Lijevo'
          }, {
            value: 'center',
            label: 'Centar'
          }, {
            value: 'right',
            label: 'Desno'
          }, {
            value: 'justified',
            label: 'Justify'
          }]
        }])
      };
      return this._filterProperties(properties);
    }

  });
})();
(function() {
  'use strict';

  Communicator.Modules.Input = Communicator.Modules.Text.extend({
    displayedProperties: _.clone(Communicator.Modules.Text.prototype.displayedProperties).concat(['inputType']),
    mandatoryProperties: _.clone(Communicator.Modules.Text.prototype.mandatoryProperties).concat(['inputType']),

    defaults: function() {
      var defaults = {
        inputType: 'text',
        placeholder: ''
      };
      return _.defaults(defaults, Communicator.Modules.Text.prototype.defaults.call(this));
    },

    properties: function() {
      var properties = {
        label: 'Ulaz',
        fields: [].concat(Communicator.Modules.Text.prototype.properties.call(this).fields, [{
          name: 'inputType',
          label: 'Vrsta',
          type: 'select',
          value: this.get('inputType'),
          model: this,
          selectOptions: [{
            value: 'text',
            label: 'Tekst'
          }, {
            value: 'password',
            label: 'Password'
          }, {
            value: 'number',
            label: 'Broj'
          }, {
            value: 'email',
            label: 'Email'
          }]
        }, {
          name: 'placeholder',
          label: 'Placeholder',
          type: 'text',
          value: this.get('placeholder'),
          model: this
        }])
      };
      return this._filterProperties(properties);
    }

  });
})();
(function() {
  'use strict';

  Communicator.Modules.Image = Communicator.Modules.Area.extend({
    displayedProperties: _.clone(Communicator.Modules.Area.prototype.displayedProperties).concat([]),
    mandatoryProperties: _.clone(Communicator.Modules.Area.prototype.mandatoryProperties).concat(['src']),

    defaults: function() {
      var defaults = {
        keepAspectRatio: false
      };
      return _.defaults(defaults, Communicator.Modules.Area.prototype.defaults.call(this));
    },

    properties: function() {
      var properties = {
        label: 'Slika',
        // TODO: This should only have resource field propertyje
        fields: [].concat(Communicator.Modules.Area.prototype.properties.call(this).fields)
      };
      return this._filterProperties(properties);
    }

  });
})();
(function() {
  'use strict';

  Communicator.Modules.Audio = Communicator.Modules.Area.extend({
    displayedProperties: _.clone(Communicator.Modules.Area.prototype.displayedProperties).concat([]),
    mandatoryProperties: _.clone(Communicator.Modules.Area.prototype.mandatoryProperties).concat(['src']),

    defaults: function() {
      var defaults = {
        keepAspectRatio: true,
        autoplay: false,
        controls: false,
        height: 16,
        width: 9,
        loop: false,
        muted: false,
        played: false
      };
      return _.defaults(defaults, Communicator.Modules.Area.prototype.defaults.call(this));
    },

    properties: function() {
      var properties = {
        label: 'Zvuk',
        fields: [].concat(Communicator.Modules.Area.prototype.properties.call(this).fields)
      };
      return this._filterProperties(properties);
    },

    startPlayback: function() {
      this.trigger('playback:start');
      this._isPlaying = true;
    },

    stopPlayback: function() {
      this.trigger('playback:stop');
      this._isPlaying = false;
    },

    mutePlayback: function() {
      if (this.get('volume') > 0) {
        this._lastVolume = this.get('volume');
        this.setVolume(0);
      }
    },

    unmutePlayback: function() {
      if (this.get('volume') === 0) {
        this.setVolume(this._lastVolume);
      }
    },

    setVolume: function(volume) {
      this.set('volume', volume);
    },


    onPlay: function() {
      this.startPlayback();
    },

    onPause: function() {
      this.stopPlayback();
    },

    onVolumeChange: function() {}

  });
})();
(function() {
  'use strict';

  Communicator.Modules.Video = Communicator.Modules.Area.extend({
    displayedProperties: _.clone(Communicator.Modules.Area.prototype.displayedProperties).concat(['url']),
    mandatoryProperties: _.clone(Communicator.Modules.Area.prototype.mandatoryProperties).concat(['src']),

    defaults: function() {
      var defaults = {
        keepAspectRatio: true,
        autoplay: false,
        controls: false,
        height: 10,
        width: 10,
        loop: false,
        muted: false,
        played: false
      };
      return _.defaults(defaults, Communicator.Modules.Area.prototype.defaults.call(this));
    },

    properties: function() {
      var properties = {
        label: 'Video',
        fields: [].concat(Communicator.Modules.Area.prototype.properties.call(this).fields).concat([{
          name: 'url',
          label: 'Adresa resursa',
          type: 'text',
          value: this.get('url'),
          model: _.bind(function() {
            return this;
          }, this),
          options: {
            defaultVal: 'placeholder text'
          }
        }])
      };
      return this._filterProperties(properties);
    },

    startPlayback: function() {
      this.trigger('playback:start');
      this._isPlaying = true;
    },

    stopPlayback: function() {
      this.trigger('playback:stop');
      this._isPlaying = false;
    },

    mutePlayback: function() {
      if (this.get('volume') > 0) {
        this._lastVolume = this.get('volume');
        this.setVolume(0);
      }
    },

    unmutePlayback: function() {
      if (this.get('volume') === 0) {
        this.setVolume(this._lastVolume);
      }
    },

    setVolume: function(volume) {
      this.set('volume', volume);
    },


    onPlay: function() {
      this.startPlayback();
    },

    onPause: function() {
      this.stopPlayback();
    },

    onVolumeChange: function() {}

  });
})();
(function() {
  'use strict';

  Communicator.Modules.Container = Communicator.Modules.Area.extend({
    complexProperties: _.clone(Communicator.Modules.Area.prototype.complexProperties).concat(['actions', 'children']),
    displayedProperties: _.clone(Communicator.Modules.Area.prototype.displayedProperties).concat(['background-color', 'droppableArea']),

    // @Override
    defaults: function() {
      return _.defaults({
        children: new Communicator.Collections.Module(),
        actions: new Communicator.Collections.Action()
      }, _.result(Communicator.Modules.Area.prototype, 'defaults'));
    },

    // @Override
    initialize: function() {
      Communicator.Modules.Area.prototype.initialize.apply(this, arguments);

      this._droppableContainers = new Communicator.Collections.Module();
      this._idManager = new Communicator.Components.IdManager();
      this._childMap = {};
      this._actionMap = {};
    },

    addChild: function(child) {
      if (this.hasChild(child)) {
        throw 'Container already has that child model';
      }
      if (!child.has('id')) {
        child.set('id', this._idManager.getNewObjectId(child.get('type')));
      }
      child.setConfig(this.config);
      this.get('children').add(child);
      this._childMap[child.get('id')] = child;
      this.onAfterChildAdd(child);
    },

    onAfterChildAdd: function(child) {},

    removeChild: function(child) {
      if (!this.hasChild(child)) {
        throw 'Container doesnt have that child model';
      }

      delete this._childMap[child.get('id')];
      this.get('children').remove(child);
      this._droppableContainers.remove(child);

      this.stopListening(child);
      // child.destroy();

      this.onAfterChildRemove(child);

      return this;
    },

    onAfterChildRemove: function(child) {},

    getChildById: function(id) {
      return this._childMap[id];
    },

    hasChild: function(child) {
      return !!this._childMap[child.get('id')];
    },

    getActionById: function(id) {
      return this._actionMap[id];
    },

    hasAction: function(action) {
      return !!this._actionMap[action.get('id')];
    },

    addAction: function(action) {
      if (this.hasAction(action)) {
        throw 'Container already has that action';
      }
      if (!action.has('id')) {
        action.set('id', this._idManager.getNewActionId(this.get('id')));
      }
      action.setConfig(this.config);
      this.get('actions').add(action);
      action.setContainerModule(this);
      this._actionMap[action.get('id')] = action;
      this.onAfterActionAdd(action);
      return this;
    },

    onAfterActionAdd: function(action) {},

    removeAction: function(action) {
      if (!this.hasAction(action)) {
        throw 'Container doesnt hav that action';
      }

      delete this._actionMap[action.get('id')];
      this.get('actions').remove(action);

      this.stopListening(action);
      //action.destroy();

      console.log('obriso ' + action.get('id'));
      this.onAfterActionRemove();

      return this;
    },

    removeActionHierarchy: function(rootAction) {
      var allActions = this.get('actions');

      var mark = function(rootAction) {
        var candidateActions = allActions.filter(function(action) {
          var actionTriggers = action.get('triggers').filter(function(trg) {
            var type = trg.get('type');
            if (type !== 'action-end' && type !== 'action-start') {
              return false;
            }
            if (rootAction.get('id') !== trg.get('sourceModuleId')) {
              return false;
            }
            return true;
          });
          if (actionTriggers.length > 0) {
            return true;
          }
        });

        return _.reduceRight(_.map(candidateActions, mark), function(left, right) {
          return left.concat(right);
        }, candidateActions);

      };

      var markedActions = mark(rootAction);

      _.forEach(markedActions, function(childAction) {
        this.removeAction(childAction);
      }, this);

      this.removeAction(rootAction);
    },

    onAfterActionRemove: function() {},

    onActionStart: function(action, targetId, params, onEnd) {
      var target = targetId.length > 0 ? this.getChildById(targetId) : this;
      target[action.get('type')](action.getParams(), action.get('duration'), onEnd);
    },

    onActionEnd: function(action) {
      // console.log('Event: Container', this.get('id'), 'action-end:', action.get('id'));
      this.trigger('action-end', action.get('id'));
    },

    properties: function() {
      var properties = {
        label: 'Kontejner',
        fields: [].concat(Communicator.Modules.Area.prototype.properties.call(this).fields)
      };
      return this._filterProperties(properties);
    }

  });
})();
(function() {
  'use strict';

  Communicator.Modules.Carousel = Communicator.Modules.Container.extend({
    displayedProperties: [],

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
    },

    properties: function() {
      var properties = {
        label: 'Slider',
        fields: [].concat(Communicator.Modules.Container.prototype.properties.call(this).fields).concat([{
          name: 'switchable',
          label: 'Switchable slides',
          type: 'checkbox',
          model: _.bind(function() {
            return this;
          }, this),
        }])
      };
      return this._filterProperties(properties);
    }

  });
})();
(function() {
  'use strict';

  Communicator.Modules.Pack = Communicator.Modules.Container.extend({
    displayedProperties: ['name'],

    // @Override
    defaults: function() {
      return _.defaults({
        name: '',
        size: new Communicator.Base.Size({
          width: '100',
          height: '100'
        })
      }, _.result(Communicator.Modules.Container.prototype, 'defaults'));
    },

    properties: function() {
      return {
        label: 'Vježba',
        fields: [].concat(Communicator.Modules.Container.prototype.properties.call(this).fields).concat([{
          name: 'name',
          label: 'Nova vježba',
          type: 'text',
          model: this,
          options: {
            defaultVal: 'Nova vježba'
          }
        }])
      };
    }
  });
})();
(function() {
  'use strict';

  Communicator.Collections.Trigger = Backbone.Collection.extend({
    model: Communicator.Triggers.Abstract
  });
})();
(function() {
  'use strict';

  Communicator.Collections.Action = Backbone.Collection.extend({
    model: Communicator.Actions.Abstract
  });
})();
(function() {
  'use strict';

  Communicator.Collections.Module = Backbone.Collection.extend({
    model: Communicator.Modules.Abstract
  });
})();
(function() {
  'use strict';

  Communicator.Views.Abstract = Backbone.View.extend({
    className: 'module',

    // The module view constructor
    initialize: function(options) {
      options = options || {};
      if (!options.model) {
        throw 'AbstractView must have it\'s model set.';
      }
      this.config = options.config || new Communicator.Base.Config();
      this._zIndex = 100;
      this._initView();

      this.setEnabled(this.model.get('enabled'));
      this.listenTo(this.model, 'update:enabled', this.updateEnabled, this);
    },

    // Initialize view from the module params
    _initView: function() {
      this.$el.addClass(this.model.get('id'));
      this.$el.attr('data-id', this.model.get('id'));
      this.$el.css('z-index', this.getZIndex());
      return this;
    },

    setZIndex: function(zIndex) {
      this._zIndex = zIndex;
      this.$el.css('z-index', zIndex);
    },

    getZIndex: function() {
      return this._zIndex;
    },

    getId: function() {
      return this.model.get('id');
    },

    getModel: function() {
      return this.model;
    },

    setConfig: function(config) {
      this.config = config;
    },

    // Method that is called when the view is attached to the DOM. Used for some view
    // initializations that have to happen after the core styles had been applied to the view
    onDomAttach: function() {},

    setEnabled: function(enabled) {
      if ( !! enabled) {
        this.$el.removeClass('disabled');
      } else {
        this.$el.addClass('disabled');
      }
    },

    updateEnabled: function(duration, onEnd) {
      this.setEnabled(this.model.get('enabled'));
      if (onEnd) {
        onEnd();
      }
    },

    fixIndex: function() {},

  });

})();
(function() {
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

      if (this.model.get('draggable') && !! this.config.get('viewDrag')) {
        this._setViewDraggable();
      }

      if (this.isDroppableArea()) {
        this.$el.addClass('droppable-area');
      }
      if (this.isSwipable() && !! this.config.get('viewSwipe')) {
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
      if ( !! this.config.get('viewTap')) {
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

})();
(function() {
  'use strict';

  Communicator.Views.Text = Communicator.Views.Area.extend({
    className: Communicator.Views.Area.prototype.className + ' text',

    // @Override
    _initView: function() {
      Communicator.Views.Area.prototype._initView.call(this);
      this.listenTo(this.model, 'change:value', this.updateValue);
      this.updateValue();
    },

    updateValue: function() {
      this.$el.html(this.model.get('value'));
    },

    // @Override
    onDomAttach: function() {
      Communicator.Views.Area.prototype.onDomAttach.call(this);
      this.model.onLoad();
    }

  });

})();
(function() {
  'use strict';

  Communicator.Views.Input = Communicator.Views.Area.extend({
    className: Communicator.Views.Area.prototype.className + ' input',
    tagName: 'input',
    events: _.defaults({
      'change': 'onChange'
    }, Communicator.Views.Area.prototype.events),

    // @Override
    _initView: function() {
      Communicator.Views.Area.prototype._initView.call(this);
      this.$el.val(this.model.get('value'));
      this.listenTo(this.model, 'change:inputType', this.updateInputType);
      this.listenTo(this.model, 'change:placeholder', this.updatePlaceholder);
      this.updateInputType();
      this.updatePlaceholder();
    },

    updateValue: function() {
      this.$el.val(this.model.get('value'));
    },

    updateInputType: function() {
      this.$el.attr('type', this.model.get('inputType'));
    },

    updatePlaceholder: function() {
      this.$el.attr('placeholder', this.model.get('placeholder'));
    },

    onChange: function() {
      this.model.set('value', this.$el.val());
    }
  });

})();
(function() {
  'use strict';

  Communicator.Views.Image = Communicator.Views.Area.extend({
    className: Communicator.Views.Area.prototype.className + ' image',
    tagName: 'div',

    // @Override
    _initView: function() {
      Communicator.Views.Area.prototype._initView.apply(this, arguments);
      this.$img = $('<img>');
      this.updateSrc();

      this.$el.append(this.$img);

      this.listenTo(this.model, 'change:src', this.updateSrc, this);
    },

    // @Override
    onDomAttach: function() {
      Communicator.Views.Area.prototype.onDomAttach.apply(this, arguments);
      this.model.onLoad();
    },

    updateSrc: function() {
      this.$img.attr('src', this.model.get('src'));
    }
  });

})();
(function() {
  'use strict';

  Communicator.Views.Audio = Communicator.Views.Area.extend({
    className: Communicator.Views.Area.prototype.className + ' audio',
    tagName: 'div',
    elEvents: {
      'onpause': 'onPause',
      'onplay': 'onPlay',
      'onvolumechange': 'onVolumeChange'
    },
    modelEvents: {
      'playback:start': 'startPlayback',
      'playback:stop': 'stopPlayback',
      'change:volume': 'updateVolume'
    },

    // @Override
    _initView: function() {
      Communicator.Views.Area.prototype._initView.apply(this, arguments);

      this.$audioEl = $('<audio>');
      this.$audioEl.attr('src', this.model.get('src'));
      this.$audioEl.addClass('containerChild');
      this.$audioEl.addClass('audioPlayer');
      this.$el.append(this.$audioEl);

      this.audio = this.$audioEl[0];

      var attrsToSet = {};
      var attrsToCheck = ['autoplay', 'controls', 'loop', 'muted'];
      _.each(attrsToCheck, function(attr) {
        if (this.model.get(attr)) {
          attrsToSet[attr] = this.model.get(attr);
        }
      }, this);

      _.forOwn(this.modelEvents, function(method, event) {
        this.listenTo(this.model, event, this[method], this);
      }, this);

      _.forOwn(this.elEvents, function(method, event) {
        this.el[event] = _.bind(this[method], this);
      }, this);

      this.$audioEl.attr(attrsToSet);
    },

    startPlayback: function() {
      this.audio.play();
    },

    stopPlayback: function() {
      this.audio.pause();
    },

    updateVolume: function() {
      this.audio.volume = this.model.get('volume');
    },

    onPlay: function() {
      this.model.onPlay();
    },

    onPause: function() {
      this.model.onPause();
    },

    onVolumeChange: function() {
      this.model.onVolumeChange();
    }

  });
})();
(function() {
  'use strict';

  Communicator.Views.Video = Communicator.Views.Area.extend({
    className: Communicator.Views.Area.prototype.className + ' video',
    tagName: 'video',
    elEvents: {
      'onpause': 'onPause',
      'onplay': 'onPlay',
      'onvolumechange': 'onVolumeChange'
    },
    modelEvents: {
      'playback:start': 'startPlayback',
      'playback:stop': 'stopPlayback',
      'change:volume': 'updateVolume'
    },

    // @Override
    _initView: function() {
      Communicator.Views.Area.prototype._initView.apply(this, arguments);

      var attrsToSet = {};
      var attrsToCheck = ['autoplay', 'controls', 'loop', 'muted'];
      _.each(attrsToCheck, function(attr) {
        if (this.model.get(attr)) {
          attrsToSet[attr] = this.model.get(attr);
        }
      }, this);

      _.forOwn(this.modelEvents, function(method, event) {
        this.listenTo(this.model, event, this[method], this);
      }, this);

      _.forOwn(this.elEvents, function(method, event) {
        this.el[event] = _.bind(this[method], this);
      }, this);

      this.$el.attr(attrsToSet);

      this.video = this.$el[0];
    },

    startPlayback: function() {
      this.video.play();
    },

    stopPlayback: function() {
      this.video.pause();
    },

    updateVolume: function() {
      this.video.volume = this.model.get('volume');
    },

    onPlay: function() {
      this.model.onPlay();
    },

    onPause: function() {
      this.model.onPause();
    },

    onVolumeChange: function() {
      this.model.onVolumeChange();
    }

  });
})();
(function() {
  'use strict';

  var H = Communicator.Components.Helpers;

  Communicator.Views.Container = Communicator.Views.Area.extend({
    className: Communicator.Views.Area.prototype.className + ' container',
    actionAlias: {
      'position': 'setChildPosition',
      'style': 'setChildStyle'
    },

    // @Override
    initialize: function(options) {
      Communicator.Views.Area.prototype.initialize.apply(this, arguments);

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
      Communicator.Views.Area.prototype.remove.apply(this, arguments);
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
})();
(function() {
  'use strict';

  Communicator.Views.Carousel = Communicator.Views.Container.extend({
    className: Communicator.Views.Container.prototype.className + ' carousel',

    // @Override
    initialize: function(options) {
      Communicator.Views.Container.prototype.initialize.call(this, options);
      if (this.config.get('viewCarouselUpdateCurrentItem')) {
        this.listenTo(this.model, 'update:currentItem', this._onCurrentItemChange, this);
      }
    },

    _moveToCurrentSlide: function() {
      this.$el.css('left', '-' + (this._currentSlide * 100) + '%');
    },

    _onCurrentItemChange: function() {
      this.setSlide(this.model.get('currentItem'));
    },

    nextSlide: function() {
      if (this._currentSlide < this._children.length - 1) {
        this._currentSlide++;
        this._moveToCurrentSlide();
      }
    },

    previousSlide: function() {
      if (this._currentSlide > 0) {
        this._currentSlide--;
        this._moveToCurrentSlide();
      }
    },

    setSlide: function(arg) {
      var num = _.isNumber(arg) ? arg : this._children.indexOf(arg);
      if (num >= 0 && num < this._children.length && num !== this._currentSlide) {
        this._currentSlide = num;
        this._moveToCurrentSlide();
      }
    }

  });
})();
(function() {
  'use strict';

  Communicator.Views.Pack = Communicator.Views.Container.extend({
    className: Communicator.Views.Container.prototype.className + ' pack'
  });

})();
(function() {
  'use strict';

  var TriggerType = {
    'action-end': Communicator.Triggers.ActionEnd,
    'action-start': Communicator.Triggers.ActionStart,
    'active': Communicator.Triggers.Active,
    'drop': Communicator.Triggers.Drop,
    'swipe': Communicator.Triggers.Swipe,
    'finish': Communicator.Triggers.Finish,
    'event': Communicator.Triggers.Event,
    'equal': Communicator.Triggers.Equal
  };

  Communicator.Factories.Trigger = {
    create: function(module, config) {
      if (!TriggerType[module.type]) {
        throw 'Invalid trigger module type: ' + module.type;
      }
      return new TriggerType[module.type](module, {
        config: config
      });
    }
  };
})();
(function() {
  'use strict';

  var ActionType = {
    'finish': Communicator.Actions.Finish,
    'position': Communicator.Actions.Position,
    'style': Communicator.Actions.Style,
    'invoke': Communicator.Actions.Invoke
  };

  Communicator.Factories.Action = {

    complexObjects: ['triggers', 'style', 'position', 'targetIds', 'size'],

    createForContainer: function(module, containerModel, config) {
      if (!ActionType[module.type]) {
        throw 'Invalid action module type: ' + module.type;
      }
      var preparedModule = _.clone(module);

      _.each(this.complexObjects, function(key) {
        delete preparedModule[key];
      });

      if (module.style) {
        preparedModule.style = new Communicator.Base.Style(module.style);
      }
      if (module.position) {
        preparedModule.position = new Communicator.Base.Position(module.position);
      }
      if (module.size) {
        preparedModule.size = new Communicator.Base.Size(module.size);
      }

      var action = new ActionType[preparedModule.type](preparedModule, {
        config: config
      });
      containerModel.addAction(action);

      _.each(module.targetIds, function(targetId) {
        action.addTargetId(targetId);
      });

      _.each(module.triggers, function(trigger) {
        action.addTrigger(Communicator.Factories.Trigger.create(trigger, config));
      });

      return action;
    }

  };
})();
(function() {
  'use strict';

  var ModuleType = {
    'container': Communicator.Modules.Container,
    'area': Communicator.Modules.Area,
    'image': Communicator.Modules.Image,
    'pack': Communicator.Modules.Pack,
    'carousel': Communicator.Modules.Carousel,
    'text': Communicator.Modules.Text,
    'input': Communicator.Modules.Input,
    'video': Communicator.Modules.Video,
    'sound': Communicator.Modules.Sound
  };

  Communicator.Factories.Module = {

    complexObjects: ['children', 'actions', 'style', 'position', 'size'],

    create: function(module, configModel) {
      var preparedModule = _.clone(module, true);
      if (!ModuleType[module.type]) {
        throw 'Invalid preparedModule type: ' + preparedModule.type;
      }
      _.each(this.complexObjects, function(key) {
        delete preparedModule[key];
      });

      if (module.style) {
        preparedModule.style = new Communicator.Base.Style(module.style);
      }
      if (module.position) {
        preparedModule.position = new Communicator.Base.Position(module.position);
      }
      if (module.size) {
        preparedModule.size = new Communicator.Base.Size(module.size);
      }

      var moduleModel = new ModuleType[module.type](preparedModule, {
        config: configModel
      });

      _.each(module.children, function(child) {
        moduleModel.addChild(Communicator.Factories.Module.create(child, configModel));
      });

      _.each(module.actions, function(action) {
        Communicator.Factories.Action.createForContainer(action, moduleModel, configModel);
      });


      return moduleModel;
    }

  };
})();
(function() {
  'use strict';

  var ViewType = {
    'container': Communicator.Views.Container,
    'area': Communicator.Views.Area,
    'image': Communicator.Views.Image,
    'pack': Communicator.Views.Pack,
    'carousel': Communicator.Views.Carousel,
    'text': Communicator.Views.Text,
    'input': Communicator.Views.Input,
    'video': Communicator.Views.Video,
    'sound': Communicator.Views.Sound
  };

  Communicator.Factories.View = {

    create: function(moduleModel, config) {
      if (!ViewType[moduleModel.get('type')]) {
        throw 'Invalid module type: ' + moduleModel.get('type');
      }

      var children = [];
      if (moduleModel.has('children')) {
        moduleModel.get('children').each(function(child) {
          children.push(this.create(child, config));
        }, this);
      }

      var moduleView = new ViewType[moduleModel.get('type')]({
        model: moduleModel,
        children: children,
        config: config
      }, Communicator.Factories.View);

      moduleView.fixIndex();

      return moduleView;
    }

  };
})();