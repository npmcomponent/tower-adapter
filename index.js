
/**
 * Module dependencies.
 */

var Emitter = require('tower-emitter')
  , stream = require('tower-stream')
  , type = require('tower-type')
  , context
  , setting
  , attr
  , database
  , model
  , index;

/**
 * Expose `adapter`.
 */

exports = module.exports = adapter;

/**
 * Expose `Adapter` constructor.
 */

exports.Adapter = Adapter;

/**
 * Lazily get an adapter instance by `name`.
 */

function adapter(name) {
  // XXX: tmp lazy-load
  exports.model || (exports.model = require('tower-model'))
  return exports.collection[name] || (exports.collection[name] = new Adapter(name));
}

/**
 * Check if adapter `name` exists.
 *
 * @param {String} name
 */

exports.exists = function(name) {
  return !!exports.collection[name];
}

/**
 * All adapters.
 */

exports.collection = {};

/**
 * Instantiate a new `Adapter`.
 */

function Adapter(name) {
  this.name = name;
  this.context = this;
  this.databases = {};
  this.types = {};
  this.settings = {};
  this.models = {};
  this.connections = {};
  //this.model = this.model.bind(this);
  // XXX: refactor, should handle namespacing.
  this.model = exports.model;
  this.action = stream.ns(name);
  // XXX: todo
  // this.type = type.ns(name);
}

/**
 * Mixin `Emitter`.
 */

//Emitter(Adapter.prototype);

/**
 * Define connection settings.
 *
 * @api public
 */

Adapter.prototype.connection = function(name, options){
  if (1 == arguments.length && 'string' == typeof name) {
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
 * Datatype serialization.
 *
 * @param {String} name
 * @param {Function} [to]
 * @param {Function} [from]
 * @api public
 */

Adapter.prototype.type = function(name, to, from){
  type = context = this.types[name]
    = this.types[name] || { deserialize: to, serialize: from };

  return this;
}

Adapter.prototype.database = function(name){
  database = context = this.databases[name] = this.databases[name] || { name: name };
  return this;
}

Adapter.prototype.model = function(name){
  return exports.model()
}

/**
 * Convert a record into something for the database.
 *
 * You'd only want to use this if your model and your database
 * are totally different from each other, such as when you're migrating
 * a legacy database to a better schema.
 */

Adapter.prototype.serialize = function(fn){
  if (1 === arguments.length) {
    context.serialize = fn;
    return this;
  }

  return this.types[arguments[0]].serialize(arguments[1]);
}

/**
 * Convert a record into a proper model from the database.
 */

Adapter.prototype.deserialize = function(fn){
  if (1 === arguments.length) {
    context.deserialize = fn;
    return this;
  }

  return this.types[arguments[0]].deserialize(arguments[1]);
}

Adapter.prototype.exec = function(){
  throw new Error('Adapter#exec not implemented.');
}

/**
 * Reset the context to this.
 */

Adapter.prototype.self = function(){
  model = setting = attr = undefined;
  return context = this;
}

/**
 * Find a keyspace/column family/column/index.
 *
 * Example:
 *
 *    adapter('cassandra').database('main').find()
 *    adapter('cassandra').collection('users').find()
 *    adapter('cassandra').collection('users').attr('email').find()
 *    adapter('cassandra').collection('users').index('email').find()
 */

Adapter.prototype.find = Adapter.prototype.execute;

/**
 * Find a column family.
 *
 * Example:
 *
 *    adapter('mysql').table('users').create(function(err, ks) {});
 */

Adapter.prototype.create = Adapter.prototype.execute;

/**
 * Update a column family or column via `ALTER`.
 */

Adapter.prototype.update = Adapter.prototype.execute;

/**
 * Drop a keyspace or column.
 */

Adapter.prototype.remove = Adapter.prototype.execute;

// alternative apis
Adapter.prototype.keystore
  = Adapter.prototype.database;

Adapter.prototype.table
  = Adapter.prototype.columnFamily
  = Adapter.prototype.collection
  = Adapter.prototype.model;

Adapter.prototype.to
  = Adapter.prototype.deserialize;

Adapter.prototype.from
  = Adapter.prototype.serialize;

exports.api = function(name, fn){
  ['connect', 'disconnect'].forEach(function(method){
    fn[method] = function(){
      return fn()[method].apply(adapter(name), arguments);
    }
  });
}