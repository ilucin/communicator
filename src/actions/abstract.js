/* Abstract Trigger */
/* Deps:
  Components.IdManager
  Components.Config,
  Collections.Trigger
*/

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