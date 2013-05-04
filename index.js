
/**
 * Module dependencies.
 */

var Emitter = require('tower-emitter')
  , stream = require('tower-stream')
  , type = require('tower-type')
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
  this.model = exports.model.ns(name);
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
    setting = this.context = settings[name]
    return this;
  }

  if ('object' == typeof name) options = name;
  options || (options = {});
  options.name || (options.name = name);
  setting = this.context = settings[options.name] = options;

  return this;
}

/**
 * Datatype serialization.
 *
 * @param {String} name
 * @api public
 */

Adapter.prototype.type = function(name){
  this.context =
    this.types[name] || (this.types[name] = type(this.name + '.' + name));
  return this;
}

/**
 * Delegate to `type`.
 *
 * XXX: This may just actually become the `type` object itself.
 */

Adapter.prototype.serializer = function(name){
  // `this.types[x] === this.context`
  this.context.serializer(name);
  return this;
}

Adapter.prototype.to = function(fn){
  this.context.to(fn);
  return this;
}

Adapter.prototype.from = function(fn){
  this.context.from(fn);
  return this;
}

Adapter.prototype.database = function(name){
  database = this.context = this.databases[name] = this.databases[name] || { name: name };
  return this;
}

Adapter.prototype.exec = function(){
  throw new Error('Adapter#exec not implemented.');
}

/**
 * Reset the context to this.
 */

Adapter.prototype.self = function(){
  model = setting = attr = undefined;
  return this.context = this;
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
 *
 *    // that could just delegate:
 *    query().use('cassandra.schema').where('collection').eq('users')
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

// XXX: Maybe for managing tables/databases/indexes/etc.
//      that stuff goes into another adapter, such as
//      `adapter('mysql.meta')` or `adapter('mysql.schema')`.
//      This way there's no room for security holes
//      and the common case (querying records) is kept
//      separate from managing tables/etc. (so there doesn't)
//      have to be conditionals everywhere.
// alternative apis
Adapter.prototype.keystore
  = Adapter.prototype.database;

Adapter.prototype.table
  = Adapter.prototype.columnFamily
  = Adapter.prototype.collection
  = Adapter.prototype.model;

exports.api = function(name, fn){
  ['connect', 'disconnect'].forEach(function(method){
    fn[method] = function(){
      return fn()[method].apply(adapter(name), arguments);
    }
  });
}