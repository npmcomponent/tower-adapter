*This repository is a mirror of the [component](http://component.io) module [tower/adapter](http://github.com/tower/adapter). It has been modified to work with NPM+Browserify. You can install it using the command `npm install npmcomponent/tower-adapter`. Please do not open issues or send pull requests against this repo. If you have issues with this repo, report it to [npmcomponent](https://github.com/airportyh/npmcomponent).*
# Tower Adapter

Datastore abstraction layer.

To abstract out some database like Cassandra, a REST API like Facebook, or even something like plain web crawling, so that it can be queried like any other resource, just implement the `exec` method on a new adapter.

## Installation

node.js:

```
$ npm install tower-adapter
```

browser:

```
$ component install tower/adapter
```

## Examples

```js
var adapter = require('tower-adapter');
```

See one of these for a complete example:

- mongodb: https://github.com/tower/mongodb-adapter
- ec2: https://github.com/tower/ec2-adapter

Example custom REST adapter implementing the `exec` method:

```js
/**
 * Map of query actions to HTTP methods.
 */

var methods = {
  find: 'GET',
  create: 'POST',
  update: 'PUT',
  remove: 'DELETE'
};

adapter('rest').exec = function(query, fn){
  var name = query.selects[0].resource;
  var method = methods[query.type];
  var params = serializeParams(query);

  $.ajax({
    url: '/api/' + name,
    dataType: 'json',
    type: method,
    data: params,
    success: function(data){
      fn(null, data);
    },
    error: function(data){
      fn(data);
    }
  });
};

/**
 * Convert query constraints into query parameters.
 */

function serializeParams(query) {
  var constraints = query.constraints;
  var params = {};

  constraints.forEach(function(constraint){
    params[constraint.left.attr] = constraint.right.value;
  });

  return params;
}
```

Map REST API objects to resources:

```js
adapter('facebook')
  .model('user')
    .attr('name')
    .attr('firstName').from('first_name')
    .attr('middleName').from('middle_name')
    .attr('lastName').from('last_name')
    .attr('gender')
      .validate('in', [ 'female', 'male' ])
    .attr('link')
      .validate('isUrl')
    .attr('username');
```

Specify (optional) how to serialize data types from JavaScript to the database-/service-specific format:

```js
adapter('mongodb')
  .type('string', fn)
  .type('text', fn)
  .type('date', fn)
  .type('float', fn)
  .type('integer', fn)
  .type('number', fn)
  .type('boolean', fn)
  .type('bitmask', fn)
  .type('array', fn);
```

## License

MIT