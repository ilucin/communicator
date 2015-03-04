'use strict';

Communicator.Modules.Container = Communicator.Modules.Area.extend({
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
  }

});
