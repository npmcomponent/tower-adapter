
/**
 * Find a single record.
 *
 * @param {Array}     criteria
 * @param {Function}  fn
 * @api public
 */

exports.find = todo('find');

/**
 * Find all records matching certain criteria.
 *
 * @param {Array}     criteria
 * @param {Function}  fn
 * @api public
 */

exports.all = todo('all');

/**
 * Insert one or many records.
 *
 * @param {Array}     criteria
 * @param {Function}  fn
 * @api public
 */

exports.insert = todo('insert');

/**
 * Update one or many records,
 * or those matching certain criteria.
 *
 * @param {Array}     criteria
 * @param {Function}  fn
 * @api public
 */

exports.update = todo('update');

/**
 * Remove one or many records,
 * or those matching certain criteria.
 *
 * @param {Array}     criteria
 * @param {Function}  fn
 * @api public
 */

exports.remove = todo('remove');

/**
 * Convert a datatype to the adapter-specific format.
 *
 * Think of `to` as "`toDatabase`".
 *
 * @param {String} type
 * @param {Function} val
 * @api public
 */

exports.to = function(type, val){
  return this.type(type).to(val);
}

/**
 * Convert a datatype from the adapter-specific format
 * to a JavaScript datatype.
 *
 * Think of `from` as "`fromDatabase`".
 *
 * @param {String} type
 * @param {Function} val
 * @api public
 */

exports.from = function(type, val){
  return this.type(type).from(val);
}

exports.type = function(type){
  return this.adapter.types[type];
}

exports.typeForAttr = function(record, name){
  for (var key in record.model.attrs) {
    
  }
}

/**
 * Dummy function.
 *
 * @api private
 */
function todo(name){
  return function() {
    throw new Error(name + ' not implemented. function ' + name + '(criteria, callback){}');
  }
}
