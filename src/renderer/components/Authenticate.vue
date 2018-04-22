<template>
  <div>
    <div class="bg-info text-light p-1 text-center">
      Secure authentication by Haven Auth
    </div>
    <div class="container pt-3 bg-light">
      <div class="card bg-light border p-3">
        <div v-if="true">
          <strong><code>{{ domain }}</code> is requesting the following permissions:</strong>
          <ul>
            <li v-for="permission in permissions" :key="permission">{{permission}}</li>
          </ul>
        </div>
        <div v-else>
          <strong>Would you like to sign in to {{ domain }} with your existing account?</strong>
        </div>
      </div>
      <div class="mt-3">
        <div class="mb-1"><strong>Select which identity you would like to authenticate with:</strong></div>
        <button v-for="(identity, index) in identities" :key="index" class="btn btn-default btn-block" @click="confirm(index)">{{ identity.identity_name }}</button><br><br>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  import { loadEntry } from '../../helper/key.js'
  const kbpgp = require('kbpgp')
  const {ipcRenderer} = require('electron')
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
    // data () {
    //   return {
    //     fingerprint: ''
    //   }
    // },
    // mounted () {
    //   loadKey(this.domain, (key) => {
    //     const fingerprint = key.get_pgp_fingerprint_str()
    //     this.fingerprint = fingerprint
    //     const accounts = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.haven', 'accounts.json')))
    //     this.isExistingUser = accounts.hasOwnProperty(this.domain)
    //   })
    // },
    mounted () {
      const havenDir = path.join(os.homedir(), '.haven') + ''
      const dataFile = path.join(havenDir, 'data.json') + ''

      const data = JSON.parse(fs.readFileSync(dataFile).toString())

      this.identities = data
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
              const data = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.haven', 'data.json')))[identityIdx].data
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
