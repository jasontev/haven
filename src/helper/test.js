const stuff = require('./key')

// stuff.loadKey('url');

const result = stuff.loadKey('url')

// console.log(result);

console.log('Public: ' + result.public)

console.log('Private: ' + result.private)
