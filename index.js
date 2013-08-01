
/**
 * Module dependencies.
 */

var Emitter = require('tower-emitter');
var stream = require('tower-stream');
var resource = require('tower-resource');
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
 *
 * @param {String} name An adapter name.
 * @return {Adapter} An adapter.
 * @api public
 */

function adapter(name) {
  if (exports.collection[name]) return exports.collection[name];
  if (exports.load(name)) return exports.collection[name];

  var obj = new Adapter(name);
  exports.collection[name] = obj;
  // exports.collection.push(obj);
  // XXX: if has any event listeners...
  exports.emit('define', obj);
  return obj;
}

/**
 * Mixin `Emitter`.
 */

Emitter(exports);

/**
 * Lazy-load adapters.
 *
 * @param {String} name An adapter name.
 * @return {Adapter} An adapter.
 * @api public
 */

exports.load = function(name, path){
  return 1 === arguments.length
    ? load(exports, name)
    : load.apply(load, [exports].concat(Array.prototype.slice.call(arguments)));
};

/**
 * Check if adapter `name` exists.
 *
 * @param {String} name An adapter name.
 * @return {Boolean} true if adapter exists, otherwise false.
 * @api public
 */

exports.exists = function(name){
  return !!exports.collection[name];
};

// XXX: remove `exists` in favor of `has`.
exports.has = exports.exists;

/**
 * Class representing an abstraction over remote services and databases.
 *
 * @class
 *
 * @param {String} name An adapter name.
 * @api public
 */

function Adapter(name) {
  this.name = name;
  this.context = this;
  this.types = {};
  this.settings = {};
  // XXX
  this.resources = {};
  this.connections = {};
  //this.resource = this.resource.bind(this);
  // XXX: refactor, should handle namespacing.
  this.resource = resource.ns(name);
  this.action = stream.ns(name);
  // XXX: todo
  // this.type = type.ns(name);

  // make queryable.
  // XXX: add to `clear` for both (or something like).
  query.use(this);
}

/**
 * Start a query against this adapter.
 *
 * @return {Mixed} Whatever the implementation of the use function attribute returns.
 * @api public
 */

Adapter.prototype.query = function(){
  return query().use(this);
};

/**
 * Use database/connection (config).
 *
 * @param {String} name An adapter name.
 * @api public
 */

Adapter.prototype.use = function(name){
  throw new Error('Adapter#use not implemented');
};

/**
 * Define connection settings.
 *
 * @param {String} name An adapter name.
 * @param {Object} options Adapter options.
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
 * @chainable
 * @param {String} name An adapter name.
 * @return {Adapter}
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
 *
 * @chainable
 * @param {String} name An adapter name.
 * @return {Adapter}
 * @api public
 */

Adapter.prototype.serializer = function(name){
  // `this.types[x] === this.context`
  this.context.serializer(name);
  return this;
};

/**
 * Set a `to` relationship.
 *
 * @chainable
 * @param {Function} fn Function executed on `to` query.
 * @return {Adapter}
 * @api public
 */

Adapter.prototype.to = function(fn){
  this.context.to(fn);
  return this;
};

/**
 * Set a `from` relationship.
 *
 * @chainable
 * @param {Function} fn Function executed on `from` query.
 * @return {Adapter}
 * @api public
 */

Adapter.prototype.from = function(fn){
  this.context.from(fn);
  return this;
};

/**
 * Main Adapter function the query object executes which you need to implement on your own adapter.
 *
 * @chainable
 * @param {Query} query A query object.
 * @param {Function} fn Adapter implementation function.
 * @return {Adapter}
 * @api public
 */

Adapter.prototype.exec = function(query, fn){
  throw new Error('Adapter#exec not implemented.');
};

/**
 * Reset the context to `this`.
 *
 * @chainable
 * @return {Adapter}
 * @api public
 */

Adapter.prototype.self = function(){
  return this.context = this;
};

var methods = [ 'connect', 'disconnect', 'query', 'use', 'type', 'to', 'from' ];

exports.api = function(adapter){
  function fn(name) {
    return name
      ? adapter.query().select(name)
      : adapter;
  }

  methods.forEach(function(method){
    api(fn, method, adapter);
  });

  return fn;
};

function api(fn, method, adapter) {
  fn[method] = function(){
    return fn()[method].apply(adapter, arguments);
  }
}