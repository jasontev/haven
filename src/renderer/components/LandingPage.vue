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
          <li v-for="(site, key) in identity.sites" :key="key">{{ key }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  const fs = require('fs')
  const os = require('os')
  const path = require('path')
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
    }
  }
</script>