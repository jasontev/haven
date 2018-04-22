<template>
  <div>
    <div class="bg-info text-light p-1 text-center">
      My identities
    </div>

    <div class="card m-2" v-for="(identity, key) in identities" :key="key">
      <div class="card-header">{{ identity.identity_name }}</div>
      <div class="card-body">
        Connected sites:
        <ul>
          <li v-for="(site, key) in identity.sites" :key="key">{{ key }}<br>
            <div>{{ site.data_shared }}</div>
          </li>
        </ul>
      </div>
    </div>
    <button @click="importData()">Import</button>
    <button @click="exportData()">Export</button>

    <p v-if="words">
      Your decryption words are: <strong>{{ words }}</strong> - the encrypted backup file has been placed on your desktop
      In order to decrypt you must save these words into a file called 'words.txt' on the desktop of the computer you want to share Haven with.
    </p>
    <p v-if="decrypted">
      Your encrypted txt file was decrypted and placed into .haven/data.json. Please restart the application to apply changes.
    </p>
  </div>
</template>

<script>
  const fs = require('fs')
  const os = require('os')
  const path = require('path')
  const getRandomValues = require('get-random-values')
  const aesjs = require('aes-js')
  const wordlist = String(fs.readFileSync(os.homedir() + '/.haven/eff-long.txt')).split('\n')
  // const exporter = require('../../helper/exporter')
  // const {ipcRenderer} = require('electron')
  export default {
    name: 'landing-page',
    data () {
      return {
        identities: [],
        words: '',
        decrypted: false
      }
    },
    mounted () {
      const havenDir = path.join(os.homedir(), '.haven') + ''
      const dataFile = path.join(havenDir, 'data.json') + ''

      const data = JSON.parse(fs.readFileSync(dataFile).toString())

      this.identities = data
    },
    methods: {
      importData () {
        const wordsKey = String(fs.readFileSync(os.homedir() + '/Desktop/words.txt')).split(' ')
        const data = String(fs.readFileSync(os.homedir() + '/Desktop/encryptedText.txt'))
        const key = []
        wordsKey.forEach(value => {
          key.push(wordlist.indexOf(value))
        })
        const dataBytes = aesjs.utils.hex.toBytes(data)
        const Ctr = aesjs.ModeOfOperation.ctr
        const aesCtr = new Ctr(key, new aesjs.Counter(5))
        const decryptedBytes = aesCtr.decrypt(dataBytes)
        const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)

        fs.writeFileSync(os.homedir() + '/.haven/data.json', decryptedText)
        this.decrypted = true
      },
      exportData () {
        console.log('hello')
        // fs.createReadStream(path.join(os.homedir(), '.haven', 'data.json')).pipe(fs.createWriteStream(path.join(os.homedir(), 'Desktop', 'havin-data.json')))
        // console.log(exporter.exportData())
        const workingDir = path.join(os.homedir(), '/.haven') + ''
        const key = new Uint8Array(16)
        getRandomValues(key)
        console.log(key)

        const wordsKey = []

        for (let value in key) {
          wordsKey.push(wordlist[key[value]])
        }

        console.log(key)
        console.log(wordsKey)

        const dataStr = String(fs.readFileSync(`${workingDir}/data.json`))
        const dataBytes = aesjs.utils.utf8.toBytes(dataStr)
        const Ctr = aesjs.ModeOfOperation.ctr
        const aesCtr = new Ctr(key, new aesjs.Counter(5))
        const encryptedBytes = aesCtr.encrypt(dataBytes)

        const encryptedText = aesjs.utils.hex.fromBytes(encryptedBytes)

        this.words = wordsKey.join(' ')

        fs.writeFileSync(os.homedir() + '/Desktop/encryptedText.txt', encryptedText)

        return [wordsKey, encryptedText]
      }
    }
  }
</script>