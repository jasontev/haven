<template>
  <div class="container" style="padding: 80px 50px" >
    <div v-if="!isExistingUser">
      <strong>{{ domain }} is requesting the following permissions:</strong>
      <ul>
        <li v-for="permission in permissions" :key="permission">{{permission}}</li>
      </ul>
    </div>
    <div v-else>
      <strong>Would you like to sign in to {{ domain }} with your existing account?</strong>
    </div>
    <button class="mt-5 btn btn-success btn-block" @click="confirm">Confirm</button><br><br>
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
        fingerprint: ''
      }
    },
    mounted () {
      loadKey(this.domain, (key) => {
        const fingerprint = key.get_pgp_fingerprint_str()
        this.fingerprint = fingerprint
        const accounts = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.haven', 'accounts.json')))
        this.isExistingUser = accounts.hasOwnProperty(this.domain)
        console.log(this.isUser)
      })
    },
    methods: {
      confirm (identityIdx) {
        loadEntry(identityIdx, this.domain, entry => {
          const fingerprint = entry.key.get_pgp_fingerprint_str()
          const timestamp = Date.now()
          kbpgp.box ({
            msg:        [fingerprint, timestamp].join(';'),
            sign_with:  entry.key
          }, (err, signature) => {
            if (err) {
              console.error(err)
            }
            entry.key.export_pgp_public({}, (err, res) => {
              ipcRenderer.sendSync('synchronous-message', {
                channel: 'authenticated',
                data: {
                  signature: signature,
                  pubkey: res
                }
              })
            })

            if(!this.isExistingUser) {
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
      },
      permissions () {
        return JSON.parse(this.getJsonFromUrl().permissions)
      }
    }
  }
</script>
