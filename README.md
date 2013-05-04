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

## API

```js
var adapter = require('tower-adapter');

var mongodb = adapter('mongodb')
  .type('string')
  .type('text')
  .type('date')
  .type('float')
  .type('integer')
  .type('number')
  .type('boolean')
  .type('bitmask')
  .type('array');
```

## License

MIT