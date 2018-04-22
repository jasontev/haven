<template>
  <div class="container">
    <div class="jumbotron" style="margin-top: 12vh; padding: 100px 20px">
      <strong>{{ domain }} is requesting the following permissions:</strong>
      <ul>
        <li v-for="permission in permissions" :key="permission">{{permission}}</li>
      </ul>
      <button class="btn btn-success btn-block" @click="confirm">Confirm</button><br><br>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  import { loadKey } from '../../helper/key.js'
  const kbpgp = require('kbpgp')
  const {ipcRenderer} = require('electron')
  const fs = require('fs')
  const os = require('os')
  const path = require('path')

  export default {
    name: 'landing-page',
    data () {
      return {
        isExistingUser: false,
        permissions: []
      }
    },
    mounted () {
      loadKey(this.domain, (key) => {
        const fingerprint = key.get_pgp_fingerprint_str()
        const accounts = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.haven', 'accounts.json')))
        this.isExistingUser = accounts.hasOwnProperty(this.domain)
        if (!this.isExistingUser) {
          this.permissions = JSON.parse(this.getJsonFromUrl().permissions)
        }
        console.log(this.isUser)
      })
    },
    methods: {
      confirm () {
        loadKey(this.domain, key => {
          console.log(key)
          const fingerprint = key.get_pgp_fingerprint_str()
          const timestamp = Date.now()
          kbpgp.box ({
            msg:        [fingerprint, timestamp].join(';'),
            sign_with:  key
          }, (err, signature) => {
            if (err) {
              console.error(err)
            }
            ipcRenderer.sendSync('synchronous-message', {
              channel: 'authenticated',
              data: signature
            })

            // update accounts db
            if(!this.isExistingUser) {
              // mark account as existing
              var accounts = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.haven', 'accounts.json')))
              accounts[this.domain] = fingerprint
              fs.writeFileSync(path.join(os.homedir(), '.haven', 'accounts.json'), JSON.stringify(accounts))

              // send requested data
              const data = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.haven', 'data.json')))
              var permissionData = {}
              this.permissions.forEach(name => {
                permissionData[name] = data[name]
              })
              ipcRenderer.sendSync('synchronous-message', {
                channel: 'permissionData',
                data: permissionData
              })
            }
          });
        })
      },
      getJsonFromUrl () {
        var query = window.location.hash.split('/')[2].substr(1);
        var result = {};
        console.log(query)
        query.split(/[&?]/g).forEach(function(part) {
          console.log(part)
          var item = part.split("=")
          result[item[0]] = decodeURIComponent(item[1])
        });
        return result;
      }
    },
    computed: {
      domain () {
        return this.getJsonFromUrl().domain
      }
    }
  }
</script>
