# indexJS

IndexJS will look in a directory you specify and expose all JS and JSON files under their filename as key. It will do so recursively. If a nested directory has an index.js file, this will used to expose that specific directory.

## Usage

```javascript
var index = require('indexjs');
module.exports = index(__dirname);
```
