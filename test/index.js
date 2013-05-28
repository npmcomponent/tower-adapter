
var adapter = require('..');
var query = require('tower-query');
var assert = require('assert');

describe('adapter', function(){
  it('should define serializers for data types', function(){
    function to() { return 'to value!' }
    function from() { return 'from value!' }

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

  it('should be added to query', function(){
    adapter('memory');
    assert(1 === query.adapters.length);
    assert(adapter('memory') === query.adapters['memory']);
  });

  it('should have `query` method', function(done){
    adapter('memory').exec = function(q2, fn){
      assert(q === q2);
      done();
    }

    var q = adapter('memory').query().action('find');
    q.exec();
  });
});