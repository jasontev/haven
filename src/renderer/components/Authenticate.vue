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

  export default {
    name: 'landing-page',
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      confirm () {
        loadKey(this.domain, function(key) {
          console.log(key)
          kbpgp.box ({
            msg:        "Here is my manifesto",
            sign_with:  key
          }, function(err, result_string, result_buffer) {
            if (err) {
              console.error(err)
            }
            console.log(result_string);
          });
        })
        // var key = loadKey(this.domain).private
        // kbpgp.box ({
        //   msg:        "Here is my manifesto",
        //   sign_with:  key
        // }, function(err, result_string, result_buffer) {
        //   console.log(err, result_string, result_buffer);
        // });
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
