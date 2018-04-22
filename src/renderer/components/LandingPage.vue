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
          <li v-for="(site, key) in identity.sites" :key="key">{{ key }}<br><div>{{ site.data_shared }}</div></li>
        </ul>
      </div>
    </div>
    <button @click="importData()">Import</button>
    <button @click="exportData()">Export</button>
  </div>
</template>

<script>
  const fs = require('fs')
  const os = require('os')
  const path = require('path')
  // const {ipcRenderer} = require('electron')
  export default {
    name: 'landing-page',
    data () {
      return {
        identities: []
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
        // fs.createReadStream(path.join(os.homedir(), '.haven', 'data.json')).pipe(fs.createWriteStream(path.join(os.homedir(), 'Desktop', 'havin-data.json')))
      },
      exportData () {
        // fs.createReadStream(path.join(os.homedir(), '.haven', 'data.json')).pipe(fs.createWriteStream(path.join(os.homedir(), 'Desktop', 'havin-data.json')))
      }
    }
  }
</script>
