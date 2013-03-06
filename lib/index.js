
/**
 * Module dependencies.
 */

var Emitter = require('emitter-component')
  , proto = require('./proto')
  , statics = require('./static')
  , container = require('tower-container');

/**
 * Expose `createAdapter`.
 */

module.exports = createAdapter;

function createAdapter(name) {
  if ('string' != typeof name) throw new TypeError('adapter name required');

  var factory = container.factory('adapter:' + name);

  if (factory) return factory.fn;

  /**
   * Initialize a new adapter.
   *
   * @param {Object} attrs
   * @api public
   */

  function adapter() {
    if (!(this instanceof adapter)) return new adapter();
  }

  // mixin emitter

  Emitter(adapter);

  // statics

  adapter.adapterName = name;
  adapter.attrs = [];
  adapter.types = {};
  adapter.resources = {};

  for (var key in statics) adapter[key] = statics[key];

  // prototype

  adapter.prototype = {};
  adapter.prototype.adapter = adapter;
  
  for (var key in proto) adapter.prototype[key] = proto[key];

  container.factory('adapter:' + name, adapter);

  return adapter;
}