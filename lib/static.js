var container = require('tower-container');


// env.name.credentials
// { shard_1: { user: x, pass: y }, shard_2: { user: a, pass: b } }
var settings = {}
  // XXX: default pool size
  , pool = 5
  , context
  , resource
  , type
  , setting
  , attr;

/**
 * Define connection settings.
 *
 * @api public
 */

exports.connection = function(name, options){
  if (arguments.length == 1 && 'string' == typeof name) {
    setting = context = settings[name]
    return this;
  }

  if ('object' == typeof name) options = name;
  options || (options = {});
  options.name || (options.name = name);
  setting = context = settings[options.name] = options;

  return this;
}

/**
 * Set pool size.
 *
 * @param {Integer} size
 * @api public
 */

exports.pool = function(size){
  if (setting)
    setting.pool = size;
  else
    pool = size;

  return this;
}

/**
 * Datatype serialization.
 *
 * @param {String} name
 * @param {Function} [to]
 * @param {Function} [from]
 * @api public
 */

exports.type = function(name, to, from){
  type = context = this.types[name] || (this.types[name] = {to: to, from: from});
  return this;
}

/**
 * Resource serialization (as opposed to attribute/datatype serialization)
 *
 * @api public
 */

exports.resource = function(name){
  resource = context = this.resources[name] || (this.resources[name] = {});
  return this;
}

/**
 * You can specify how a property on the model gets
 * serialized to/from MySQL.
 *
 * You can specify `to`, `from`, and `name` (the column name).
 *
 * Must be defined within the context of a `resource`.
 */

exports.attr = function(name){
  attr = context = resource[name] || (resource[name] = {});
  return this
}

/**
 * Convert a record into something for the database.
 *
 * You'd only want to use this if your model and your database
 * are totally different from each other, such as when you're migrating
 * a legacy database to a better schema.
 */

exports.serialize = function(fn){
  context.serialize = fn;
  return this;
}

/**
 * Convert a record from a database representation.
 */

exports.from = exports.serialize;

/**
 * Convert a record into a proper model from the database.
 */

exports.deserialize = function(fn){
  context.deserialize = fn;
  return this;
}

/**
 * Convert a record to a database representation.
 */

exports.to = exports.deserialize;

/**
 * Prototypes this inherits.
 */

exports.inherits = function(parent){
  this.prototypes.push(parent);
  return this;
}

exports.find = instance('find');

exports.insert = instance('insert');

exports.update = instance('update');

exports.remove = instance('remove');

exports.all = instance('all');

exports.execute = instance('execute');

function instance(name) {
  return function(criteria, callback) {
    return container.lookup('adapter:' + this.adapterName)[name](criteria, callback);
  }
}