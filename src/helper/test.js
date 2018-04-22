const exporter = require('./exporter')
const fs = require('fs');

const [wordsKey, encryptedText] = exporter.exportData()

// console.log(wordsKey);

console.log(encryptedText);

fs.writeFileSync('./encryptedText.txt', encryptedText);



// console.log(exporter.importData(wordsKey, encryptedText))
