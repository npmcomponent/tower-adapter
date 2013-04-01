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

    assert.equal('to value!', memory.to('string', 'asdf'));
    assert.equal('from value!', memory.from('string', 'asdf'));
  });

  it('should define databases', function(){
    var memory = adapter('memory');

    memory.create = function(fn){
      console.log('created!');
    }

    memory.create();
  })
});
