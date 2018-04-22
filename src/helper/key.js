/* eslint-disable */

const kbpgp = require('kbpgp')
const fs = require('fs')
const path = require('path')
const os = require('os')
var mkdirp = require('mkdirp');

const havenDir = path.join(os.homedir(), '.haven') + ''
const keyFile = path.join(havenDir, 'keys.json') + ''

export function loadPgpKey (domain, callback) {
  // setup files if they don't exist
  console.log(havenDir)
  if(!fs.existsSync(havenDir)) {
    mkdirp.sync()
    fs.writeFileSync(keyFile, '{}');
  }

  const keys = JSON.parse(fs.readFileSync(keyFile).toString())
  if (!keys.hasOwnProperty(domain)) {
    // generate, save, and return key
    var my_asp = new kbpgp.ASP({
      progress_hook: function(o) {
        console.log("I was called with progress!", o);
      }
    });
    
    kbpgp.KeyManager.generate_ecc({ asp: my_asp, userid: 'Haven Key' }, function(err, key) {
      if (err) {
        console.error(err)
        return
      }
      key.sign({}, function(err) {
        if (err) {
          console.error(err)
          return
        }
        key.export_pgp_private({ passphrase: '' }, function (err, data) {
          if (err) {
            console.error(err)
            return
          }
          keys[domain] = data
          fs.writeFileSync(keyFile, JSON.stringify(keys))
          callback(data)
        })
      });
   });
  } else {
    // return key
    callback(keys[domain])
  }
}

export function loadKey (domain, callback) {
  loadPgpKey(domain, function(pgpKey) {
    kbpgp.KeyManager.import_from_armored_pgp({
      armored: pgpKey
    }, function(err, key) {
      if (!err) {
        key.unlock_pgp({
          passphrase: ''
        }, function(err) {
          if (err) {
            console.error(err)
            return
          }
          callback(key)
        });
      }
    });
  })
}
