
/**
 * Module dependencies.
 */

var Emitter = require('tower-emitter');
var stream = require('tower-stream');
var model = require('tower-model');
var query = require('tower-query');
var type = require('tower-type');
var load = require('tower-load');

/**
 * Expose `adapter`.
 */

exports = module.exports = adapter;

/**
 * Expose `collection`.
 */

exports.collection = [];


/**
 * Expose `Adapter` constructor.
 */

exports.Adapter = Adapter;

/**
 * Lazily get an adapter instance by `name`.
 */

function adapter(name) {
  if (exports.collection[name]) return exports.collection[name];
  if (exports.load(name)) return exports.collection[name];

  // XXX: tmp lazy-load
  exports.model || (exports.model = require('tower-model'))

  var obj = new Adapter(name);
  exports.collection[name] = obj;
  // exports.collection.push(obj);
  exports.emit('define', obj);
  exports.emit('define ' + name, obj);
  return obj;
}

/**
 * Mixin `Emitter`.
 */

Emitter(exports);

/**
 * Lazy-load adapters.
 */

exports.load = function(name, path){
  return 1 === arguments.length
    ? load(exports, name)
    : load.apply(load, [exports].concat(Array.prototype.slice.call(arguments)));
};

/**
 * Check if adapter `name` exists.
 *
 * @param {String} name
 */

exports.exists = function(name) {
  return !!exports.collection[name];
};

// XXX: remove `exists` in favor of `has`.
exports.has = exports.exists;

/**
 * Instantiate a new `Adapter`.
 */

function Adapter(name) {
  this.name = name;
  this.context = this;
  this.types = {};
  this.settings = {};
  // XXX
  this.models = {};
  this.connections = {};
  //this.model = this.model.bind(this);
  // XXX: refactor, should handle namespacing.
  this.model = exports.model.ns(name);
  this.action = stream.ns(name);
  // XXX: todo
  // this.type = type.ns(name);

  // make queryable.
  // XXX: add to `clear` for both (or something like).
  query.use(this);
}

/**
 * Start a query against this adapter.
 */

Adapter.prototype.query = function(){
  return query().use(this);
};

/**
 * Use database/connection (config).
 */

Adapter.prototype.use = function(name){
  throw new Error('Adapter#use not implemented');
};

/**
 * Define connection settings.
 *
 * @api public
 */

Adapter.prototype.connection = function(name, options){
  if (1 === arguments.length && 'string' == typeof name) {
    setting = this.context = settings[name]
    return this;
  }

  if ('object' === typeof name) options = name;
  options || (options = {});
  options.name || (options.name = name);
  setting = this.context = settings[options.name] = options;

  return this;
};

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
};

/**
 * Delegate to `type`.
 *
 * XXX: This may just actually become the `type` object itself.
 */

Adapter.prototype.serializer = function(name){
  // `this.types[x] === this.context`
  this.context.serializer(name);
  return this;
};

Adapter.prototype.to = function(fn){
  this.context.to(fn);
  return this;
};

Adapter.prototype.from = function(fn){
  this.context.from(fn);
  return this;
};

Adapter.prototype.exec = function(){
  throw new Error('Adapter#exec not implemented.');
};

/**
 * Reset the context to `this`.
 */

Adapter.prototype.self = function(){
  return this.context = this;
};

exports.api = function(name, fn){
  ['connect', 'disconnect'].forEach(function(method){
    fn[method] = function(){
      return fn()[method].apply(adapter(name), arguments);
    }
  });
};