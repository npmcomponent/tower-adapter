# Tower Adapter

**< 1kb** minified and gzipped.

## Installation

node.js:

```
npm install tower-adapter
```

browser:

```
component install tower/adapter
```

## API

No docs yet, come back later.

``` javascript
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

## Running tests

```
mocha
```

## License

MIT