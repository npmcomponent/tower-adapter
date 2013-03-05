var context = {}
  , container = require('tower-container');

exports.type = function(string, to, from){
  this.types[string] = context = {to: to, from: from};
  return this;
}

exports.to = function(fn){
  context.to = fn;
  return this;
}

exports.from = function(fn){
  context.from = fn;
  return this;
}

exports.resource = function(name){
  this.resources[name] = context = {};
  return this;
}

exports.inherits = function(parent){
  this.prototypes.push(parent);
  return this;
}

exports.find = instance('find');

exports.insert = instance('insert');

exports.update = instance('update');

exports.remove = instance('remove');

exports.all = instance('all');

function instance(name) {
  return function(criteria, callback) {
    return container.lookup('adapter:' + this.adapterName)[name](criteria, callback);
  }
}