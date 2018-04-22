/* eslint-disable */

const os = require('os')
const fs = require('fs')
const aesjs = require('aes-js')
const getRandomValues = require('get-random-values')

const wordlist = String(fs.readFileSync('./eff-long.txt')).split('\n')

const workingDir = os.homedir() + '/.haven'

exports.exportData = () => {
  let key = new Uint8Array(16);
  key = Array(getRandomValues(key));

  const wordsKey = key.map(byte => {
    return wordlist[byte]
  })
  console.log(wordsKey)

  const dataStr = String(fs.readFileSync(`${workingDir}/data.json`))
  const dataBytes = aesjs.utils.utf8.toBytes(dataStr)

  const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))
  const encryptedBytes = aesCtr.encrypt(dataBytes)

  const encryptedText = aesjs.utils.hex.fromBytes(encryptedBytes)

  return [wordsKey, encryptedText]
}

exports.importData = (wordsKey, data) => {
  var key = wordsKey.map(word => {
    wordlist.indexOf(word)
  })
}
