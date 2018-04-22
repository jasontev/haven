/* eslint-disable */

const kbpgp = require('kbpgp')
const fs = require('fs')
const path = require('path')
const os = require('os')
var mkdirp = require('mkdirp');

const havenDir = path.join(os.homedir(), '.haven') + ''
const dataFile = path.join(havenDir, 'data.json') + ''

export function loadEntryRaw (identityIdx, domain, callback) {
  // setup files if they don't exist
  console.log(havenDir)
  if(!fs.existsSync(havenDir)) {
    mkdirp.sync()
    fs.writeFileSync(keyFile, '{}');
  }

  const data = JSON.parse(fs.readFileSync(keyFile).toString())
  if (!data[identityIdx].hasOwnProperty(domain)) {
    kbpgp.KeyManager.generate_ecc({ userid: `Haven Key <${domain}>` }, function(err, key) {
      if (err) {
        console.error(err)
        return
      }
      key.sign({}, function(err) {
        if (err) {
          console.error(err)
          return
        }
        key.export_pgp_private({ passphrase: '' }, function (err, pgpKey) {
          if (err) {
            console.error(err)
            return
          }
          data[identityIdx][domain] = {
            key: pgpKey,
            data_shared: []
          }
          fs.writeFileSync(keyFile, JSON.stringify(keys))
          callback(data[identityIdx][domain])
        })
      });
   });
  } else {
    // return key
    callback(data[identityIdx][domain])
  }
}

export function loadEntry (domain, callback) {
  loadEntryRaw(domain, function(rawEntry) {
    kbpgp.KeyManager.import_from_armored_pgp({
      armored: rawEntry.key
    }, function(err, key) {
      if (!err) {
        key.unlock_pgp({
          passphrase: ''
        }, function(err) {
          if (err) {
            console.error(err)
            return
          }
          callback({
            key: key,
            data_shared: rawEntry.dataFile
          })
        });
      }
    });
  })
}
