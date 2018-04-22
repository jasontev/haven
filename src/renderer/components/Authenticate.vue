<template>
  <div>
    <button @click="confirm">Confirm</button><br><br>
    {{ permissions }}
  </div>
</template>

<script>
  /* eslint-disable */
  import { loadKey } from '../../helper/key.js'
  const kbpgp = require('kbpgp')
  const {ipcRenderer} = require('electron')

  export default {
    name: 'landing-page',
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
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
            ipcRenderer.sendSync('synchronous-message', {
              channel: 'authenticated',
              data: signature
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
      isNewUser () {
        loadKey(this.domain, function(key) {
          const fingerprint = key.get_pgp_fingerprint_str()
        })
      },
      domain () {
        return this.getJsonFromUrl().domain
      },
      permissions () {
        return JSON.parse(this.getJsonFromUrl().permissions)
      }
    }
  }
</script>
