const exporter = require('./exporter');

const [wordsKey, encryptedText] = exporter.exportData();

console.log(wordsKey);
