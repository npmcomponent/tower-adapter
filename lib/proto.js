exports.find = todo('find');

exports.insert = todo('insert');

exports.update = todo('update');

exports.remove = todo('remove');

exports.all = todo('all');

exports.to = function(type, val){
  return this.type(type).to(val);
}

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

function todo(name){
  return function() {
    throw new Error(name + ' not implemented. function ' + name + '(criteria, callback){}');
  }
}
