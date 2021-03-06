/* eslint-disable */

const os = require('os')
const fs = require('fs')
const aesjs = require('aes-js')
const getRandomValues = require('get-random-values')

const wordlist = String(fs.readFileSync('./eff-long.txt')).split('\n')

const workingDir = os.homedir() + '/.haven'

exports.exportData = () => {
  var key = new Uint8Array(16);
  getRandomValues(key);
  console.log(key)

  var wordsKey = []
  var val = 0;

  for(let value in key) {
    wordsKey.push(wordlist[key[value]])
  }

  console.log(key)
  console.log(wordsKey)

  const dataStr = String(fs.readFileSync(`${workingDir}/data.json`))
  const dataBytes = aesjs.utils.utf8.toBytes(dataStr)
  const Ctr = aesjs.ModeOfOperation.ctr;
  const aesCtr = new Ctr(key, new aesjs.Counter(5))
  const encryptedBytes = aesCtr.encrypt(dataBytes)

  const encryptedText = aesjs.utils.hex.fromBytes(encryptedBytes)

  return [wordsKey, encryptedText]
}

exports.importData = (wordsKey, data) => {
  const key = [];

  wordsKey.forEach(value => {
    key.push(wordlist.indexOf(value));
  })
  const dataBytes = aesjs.utils.hex.toBytes(data);
  const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  const decryptedBytes = aesCtr.decrypt(dataBytes);
  const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

  return decryptedText;
}
