/* eslint-disable */

const os = require('os')
const fs = require('fs')
const aesjs = require('aes-js')
const getRandomValues = require('get-random-values')

const wordlist = String(fs.readFileSync('./eff-long.txt')).split('\n')

const workingDir = os.homedir() + '/.haven'

export function exportData () {
  var key = new Uint8Array(16);
  window.crypto.getRandomValues(key);
  console.log(key)

  var wordsKey = []
  var val = 0;
  for(var i = 0; i < key.length; i++) {
    val = val << 8
    val += key[i]

    if (val > (1 << 12)) {
      const idx = val % (1 << 12)
      wordsKey.push(wordlist[idx])
      val -= idx
      val = val >> 12
    }
  }
  wordsKey.push(wordlist[val])
  wordsKey = wordsKey.join(' ')

  (function() {
    var val = 0
    var key = []
    wordsKey.split(' ').forEach(word => {
      const idx = wordlist.indexOf(word)
      val = val << 12
      val += idx

      if (val > (1 << 8)) {
        const byte = val % (1 << 8)
        key.push(byte)
        val -= byte
        val = val >> 8
      }
    })
    console.log(key)
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
