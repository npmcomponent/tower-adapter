var adapter = require('..')
  , assert = require('assert');

describe('adapter', function(){
  it('should define serializers for data types', function(){
    var to = function() { return 'to value!' }
    var from = function() { return 'from value!' }

    var memory = adapter('memory')
      .type('string')
        .to(to)
        .from(from)
      .type('date')
        .to(function(){})
        .from(function(){});

    // XXX: should be more like:
    //      `memory.type('string').serializer`
    //      or
    //      `memory.serializer('string')`
    //      `memory.serializer('string.default')`
    var serializer = memory.types['string'].serializers['default'];
    assert.equal('to value!', serializer.to('asdf'));
    assert.equal('from value!', serializer.from('asdf'));
  });

  it('should define databases', function(done){
    var memory = adapter('memory');

    memory.create = function(fn){
      done();
    }

    memory.create();
  });
});
