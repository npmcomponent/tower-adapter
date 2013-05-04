# Tower Adapter

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

See https://github.com/tower/ec2-adapter for the most complete example so far.

```js
var adapter = require('tower-adapter');

adapter('mongodb')
  .type('string')
  .type('text')
  .type('date')
  .type('float')
  .type('integer')
  .type('number')
  .type('boolean')
  .type('bitmask')
  .type('array');

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

## License

MIT