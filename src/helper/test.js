const exporter = require('./exporter');

const [wordsKey, encryptedText] = exporter.exportData();

// console.log(wordsKey);

// console.log(encryptedText);

console.log(exporter.importData(wordsKey, encryptedText))
