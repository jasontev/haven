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
        isUser: false
      }
    },
    mounted () {
      loadKey(this.domain, (key) => {
        const fingerprint = key.get_pgp_fingerprint_str()
        const accounts = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.haven', 'accounts.json')))
        this.isUser = accounts.hasOwnProperty(fingerprint)
        console.log(this.isUser)
      })
    },
    methods: {
      confirm () {
        loadKey(this.domain, function(key) {
          console.log(key)
          const fingerprint = key.get_pgp_fingerprint_str()
          const timestamp = Date.now()
          kbpgp.box ({
            msg:        [fingerprint, timestamp].join(';'),
            sign_with:  key
          }, function(err, signature) {
            if (err) {
              console.error(err)
            }
            key.export_pgp_public({}, (err, res) => {
              ipcRenderer.sendSync('synchronous-message', {
                channel: 'authenticated',
                data: {
                  signature: signature,
                  pubkey: res
                }
              })
            })
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
