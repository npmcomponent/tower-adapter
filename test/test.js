var adapter = require('../lib')
  , assert = require('chai').assert;

describe('adapter', function() {
  it('should define', function() {
    var to = function() { return 'to value!' }
    var from = function() { return 'from value!' }

    var MemoryAdapter = adapter('memory')
      .type('string')
        .to(to)
        .from(from)
      .type('date')
        .to(function(){})
        .from(function(){});

    var memory = new MemoryAdapter;

    assert.equal('to value!', memory.to('string', 'asdf'));
    assert.equal('from value!', memory.from('string', 'asdf'));
  });
});
