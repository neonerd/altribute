(function() {
  var AttributeGenerator, AttributeHook, DeleteAttributeHook, Entity, EntityType, RandomAttributeGenerator, Relation, RelationType, SetAttributeGenerator, altribute, utilities, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  utilities = {
    isString: function(str) {
      if (typeof str === 'string' || str instanceof String) {
        return true;
      } else {
        return false;
      }
    },
    isArray: function(arr) {
      return Object.prototype.toString.call(arr) === '[object Array]';
    },
    isObject: function(obj) {
      return typeof obj === 'object';
    },
    randomArrayValue: function(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },
    arrayIntersect: function(a, b) {
      var ai, bi, result;
      ai = 0;
      bi = 0;
      result = [];
      while (ai < a.length && bi < b.length) {
        if (a[ai] < b[bi]) {
          ai++;
        } else if (a[ai] > b[bi]) {
          bi++;
        } else {
          result.push(a[ai]);
          ai++;
          bi++;
        }
      }
      return result;
    },
    arraysIntersect: function(arrs) {
      var arr, index, result, _i, _len;
      result = [];
      for (index = _i = 0, _len = arrs.length; _i < _len; index = ++_i) {
        arr = arrs[index];
        if (result.length === 0) {
          if (arrs[index + 1] !== void 0) {
            result = utilities.arrayIntersect(arrs[index], arrs[index + 1]);
          }
        } else {
          if (arrs[index + 1] !== void 0) {
            result = utilities.arrayIntersect(result, arrs[index + 1]);
          }
        }
      }
      return result;
    }
  };

  AttributeGenerator = (function() {
    AttributeGenerator._getValueKeyByIndex = function(values, index) {
      var key, value, _i, _len;
      for (key = _i = 0, _len = values.length; _i < _len; key = ++_i) {
        value = values[key];
        if (utilities.isObject(value)) {
          if (value['index'] !== void 0 && value['index'] === index) {
            return key;
          }
          if (value['value'] === index) {
            return key;
          }
        } else {
          if (value === index) {
            return key;
          }
        }
      }
      return false;
    };

    function AttributeGenerator(options, values) {
      this.options = options;
      this.values = values;
      this.conditions = {};
    }

    AttributeGenerator.prototype.generate = function(store) {
      return false;
    };

    AttributeGenerator.prototype.addConditions = function(value, conditions) {
      var condition, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = conditions.length; _i < _len; _i++) {
        condition = conditions[_i];
        _results.push(this.addCondition(value, condition));
      }
      return _results;
    };

    AttributeGenerator.prototype.addCondition = function(value, condition) {
      var parsedCondition;
      if (this.conditions[value] === void 0) {
        this.conditions[value] = [];
      }
      parsedCondition = this.parseCondition(condition);
      return this.conditions[value].push(parsedCondition);
    };

    AttributeGenerator.prototype.parseCondition = function(condition) {
      return condition;
    };

    AttributeGenerator.prototype.applyConditions = function(values, data) {
      var condition, conditions, value, valuePassed, _fn, _i, _len, _ref, _results;
      _ref = this.conditions;
      _results = [];
      for (value in _ref) {
        conditions = _ref[value];
        valuePassed = true;
        _fn = function(condition) {
          var e, evaluation;
          e = data;
          evaluation = eval(condition);
          if (!evaluation) {
            return valuePassed = false;
          }
        };
        for (_i = 0, _len = conditions.length; _i < _len; _i++) {
          condition = conditions[_i];
          _fn(condition);
        }
        if (!valuePassed) {
          values.splice(AttributeGenerator._getValueKeyByIndex(values, value), 1);
          _results.push(console.log(values));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    AttributeGenerator.prototype.deleteValue = function(index) {
      var key, value, _i, _len, _ref, _results;
      _ref = this.values;
      _results = [];
      for (key = _i = 0, _len = _ref.length; _i < _len; key = ++_i) {
        value = _ref[key];
        if (utilities.isString(value) && value === index) {
          _results.push(this.values.splice(key, 1));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return AttributeGenerator;

  })();

  SetAttributeGenerator = (function(_super) {
    __extends(SetAttributeGenerator, _super);

    function SetAttributeGenerator() {
      _ref = SetAttributeGenerator.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SetAttributeGenerator.prototype.generate = function() {
      return null;
    };

    return SetAttributeGenerator;

  })(AttributeGenerator);

  /* 
  
  	Random Attribute Generator
  
  	options
  
  		distribution:
  
  			even -> takes either an Array of values or string defining range (e.g. "15-20")
  			weighted -> takes an Array of Object Literals in format of { weight : X, value : Y }
  */


  RandomAttributeGenerator = (function(_super) {
    __extends(RandomAttributeGenerator, _super);

    function RandomAttributeGenerator(options, values) {
      this.options = options;
      this.values = values;
      RandomAttributeGenerator.__super__.constructor.call(this, this.options, this.values);
      this.preprocessValues();
      if (RandomAttributeGenerator.valuesValidation[this.options.distribution] === void 0) {
        throw new Error("Unknown distribution type!");
      }
      if (!RandomAttributeGenerator.valuesValidation[this.options.distribution](this.values)) {
        throw new Error("Invalid values!");
      }
    }

    RandomAttributeGenerator.prototype.generate = function(store) {
      var values;
      values = this.values.concat([]);
      this.applyConditions(values, store);
      if (this.options.distribution === 'weighted') {
        this.recalculateWeights(values);
      }
      return RandomAttributeGenerator.generation[this.options.distribution](values);
    };

    RandomAttributeGenerator.prototype.preprocessValues = function() {
      var max, min, newValues, tokens;
      if (utilities.isString(this.values)) {
        tokens = this.values.split("-");
        if (tokens.length !== 2) {
          throw new Error("Value string could not be preprocessed!");
        } else {
          min = parseInt(tokens[0]);
          max = parseInt(tokens[1]);
          newValues = [];
          while (min <= max) {
            newValues.push(min);
            min++;
          }
          return this.values = newValues;
        }
      }
    };

    RandomAttributeGenerator.prototype.recalculateWeights = function(values) {
      return true;
    };

    RandomAttributeGenerator.valuesValidation = {
      even: function(values) {
        return utilities.isArray(values);
      },
      weighted: function(values) {
        return utilities.isArray(values);
      }
    };

    RandomAttributeGenerator.generation = {
      even: function(values) {
        if (values.length === 0) {
          throw new Error("No more possible values left!");
        }
        return utilities.randomArrayValue(values);
      },
      weighted: function(values) {
        var i, pair, weightedArray, _i, _len;
        if (values.length === 0) {
          throw new Error("No more possible values left!");
        }
        weightedArray = [];
        for (_i = 0, _len = values.length; _i < _len; _i++) {
          pair = values[_i];
          i = 0;
          while (i < pair.weight) {
            weightedArray.push(pair.value);
            i++;
          }
        }
        return utilities.randomArrayValue(weightedArray);
      }
    };

    return RandomAttributeGenerator;

  })(AttributeGenerator);

  /*
  
  	Structure key types:
  
  		- set (set programatically)
  		- random ()
  */


  AttributeHook = (function() {
    function AttributeHook() {}

    AttributeHook.prototype.run = function(current, generators, data) {
      return true;
    };

    return AttributeHook;

  })();

  DeleteAttributeHook = (function() {
    function DeleteAttributeHook() {}

    DeleteAttributeHook.prototype.run = function(current, generator, data) {
      return generator.deleteValue(current);
    };

    return DeleteAttributeHook;

  })();

  EntityType = (function() {
    function EntityType(structure) {
      this.structure = structure;
      this.generators = {};
      this.store = {};
      if (!(typeof this.structure === 'object')) {
        throw new Error("EntityType structure has to be an object literal!");
      }
      this.parseStructure(this.generators, this.structure);
    }

    EntityType.prototype.parseStructure = function(parent, structure) {
      var conditionDetails, generator, generatorClass, hook, hookDescription, key, targetValue, value, _ref1, _results;
      _results = [];
      for (key in structure) {
        value = structure[key];
        if (typeof value === 'object') {
          if (value._type !== void 0) {
            generatorClass = null;
            switch (value._type) {
              case "random":
                generatorClass = RandomAttributeGenerator;
                break;
              case "set":
                generatorClass = SetAttributeGenerator;
                break;
              default:
                throw new Error("Unknown attribute _type!");
            }
            generator = new generatorClass(value._options, value._values);
            if (value._conditions) {
              _ref1 = value._conditions;
              for (targetValue in _ref1) {
                conditionDetails = _ref1[targetValue];
                generator.addConditions(targetValue, conditionDetails);
              }
            }
            parent[key] = {
              'generator': generator,
              'hooks': {}
            };
            if (value._hooks) {
              _results.push((function() {
                var _i, _len, _ref2, _results1;
                _ref2 = value._hooks;
                _results1 = [];
                for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
                  hookDescription = _ref2[_i];
                  hook = null;
                  switch (hookDescription.type) {
                    case "delete":
                      hook = DeleteAttributeHook;
                      break;
                    default:
                      throw new Error("Unknown hook type!");
                  }
                  if (parent[key]['hooks'][hookDescription.on] === void 0) {
                    parent[key]['hooks'][hookDescription.on] = [];
                  }
                  _results1.push(parent[key]['hooks'][hookDescription.on].push(new hook()));
                }
                return _results1;
              })());
            } else {
              _results.push(void 0);
            }
          } else {
            parent[key] = {};
            _results.push(this.parseStructure(parent[key], value));
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    EntityType.prototype.generate = function(data) {
      this.store = data;
      return this._generate(this.generators, data);
    };

    EntityType.prototype._generate = function(parent, data) {
      var hook, key, value, _i, _len, _ref1, _results;
      _results = [];
      for (key in parent) {
        value = parent[key];
        if (value.generator instanceof AttributeGenerator) {
          if (value.hooks.before) {
            _ref1 = value.hooks.before;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              hook = _ref1[_i];
              hook.run(null, value.generator, data);
            }
          }
          data[key] = value.generator.generate(this.store);
          if (value.hooks.after) {
            _results.push((function() {
              var _j, _len1, _ref2, _results1;
              _ref2 = value.hooks.after;
              _results1 = [];
              for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                hook = _ref2[_j];
                _results1.push(hook.run(data[key], value.generator, data));
              }
              return _results1;
            })());
          } else {
            _results.push(void 0);
          }
        } else {
          data[key] = {};
          _results.push(this._generate(value, data[key]));
        }
      }
      return _results;
    };

    return EntityType;

  })();

  Entity = (function() {
    Entity._types = {};

    Entity._entities = {};

    Entity._idIterator = 1;

    Entity.type = function(name, type) {
      if (this._types[name] !== void 0) {
        throw new Error("Entity type named '" + name + "' already exists!");
      }
      if (!(type instanceof EntityType)) {
        throw new Error("Type is not an instance of EntityType");
      }
      this._types[name] = type;
      return true;
    };

    function Entity(type) {
      if (Entity._types[type] === void 0) {
        throw new Error("Entity type '" + type + "' does not exist!");
      }
      this._type = type;
      this._id = Entity._idIterator;
      Entity._idIterator++;
      Entity._entities[this._id] = this;
      Entity._types[type].generate(this);
    }

    Entity.prototype.getId = function() {
      return this._id;
    };

    Entity.prototype.getRelations = function() {
      return Relation.findRelationsByEntity(this.getId());
    };

    return Entity;

  })();

  Relation = (function() {
    Relation._types = {};

    Relation._relations = {};

    Relation._idIterator = {};

    Relation.type = function(name, type) {
      if (this._types[name] !== void 0) {
        throw new Error("Relation type named '" + name + "' already exists!");
      }
      if (!(type instanceof RelationType)) {
        throw new Error("Type is not an instance of RelationType");
      }
      this._types[name] = type;
      return true;
    };

    Relation.findRelationsByEntity = function(entityId) {
      var found, id, relation, _ref1;
      found = [];
      _ref1 = this._relations;
      for (id in _ref1) {
        relation = _ref1[id];
        if (relation.hasEntity(entityId)) {
          found.push(relation);
        }
      }
      return found;
    };

    Relation.findRelationsByEntities = function(ids) {
      var id, relations, _i, _len;
      relations = [];
      for (_i = 0, _len = ids.length; _i < _len; _i++) {
        id = ids[_i];
        relations.push(this.findRelationsByEntity(id));
      }
      return utilities.arraysIntersect(relations);
    };

    function Relation(type) {
      if (Relation._types[type] === void 0) {
        throw new Error("Relation type '" + type + "' does not exist!");
      }
      this._type = type;
      this._id = Relation._idIterator;
      Relation._idIterator++;
      Relation._relations[this._id] = this;
      this._entities = [];
      return true;
    }

    Relation.prototype.getId = function() {
      return this._id;
    };

    Relation.prototype.addEntity = function(entityId, group) {
      if (group === void 0) {
        return this._entities.push([entityId]);
      } else {
        if (this._entities[group] === void 0) {
          throw new Error("Entity group " + group + " does not exist in this relation!");
        }
        return this._entities[group].push(entityId);
      }
    };

    Relation.prototype.hasEntity = function(entityId) {
      var group, _i, _len, _ref1;
      _ref1 = this._entities;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        group = _ref1[_i];
        if (group.indexOf(entityId) !== -1) {
          return true;
        }
      }
      return false;
    };

    return Relation;

  })();

  RelationType = (function() {
    function RelationType(structure) {
      this.structure = structure;
      this.generators = {};
      this.store = {};
      if (!(typeof this.structure === 'object')) {
        throw new Error("EntityType structure has to be an object literal!");
      }
    }

    return RelationType;

  })();

  altribute = {
    'Entity': Entity,
    'EntityType': EntityType,
    'Relation': Relation,
    'RelationType': RelationType,
    'utilities': utilities
  };

  if (typeof module !== 'undefined') {
    module.exports = altribute;
  } else {
    window.altribute = altribute;
  }

}).call(this);
