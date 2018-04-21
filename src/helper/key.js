const kbpgp = require('kbpgp');
const fs = require('fs');

const file = '~/Documents/.haven/keys.json';
const dir = '~/Documents/.haven'

/**
 * Will check if the key exists. If it does not, it will generate a new key. If it does, it will return the previously generated key.
 */
exports.loadKey = (url) => {
    const result = {
        public: null,
        private: null
    }

    if (!fs.existsSync(__dirname + 'keys.txt')) {
        console.log('Dir does not exist')
        // fs.mkdirSync(dir);
        kbpgp.KeyManager.generate_rsa({ userid: "Bo Jackson <user@example.com>" }, function (err, charlie) {
            charlie.sign({}, function (err) {
                charlie.export_pgp_private({
                    passphrase: 'booyeah!'
                }, function (err, pgp_private) {
                    // console.log("private key: ", pgp_private);
                    fs.writeFileSync(__dirname + "keys.txt", pgp_private + "/////////", 'utf-8', function (err) {
                        if (err) {
                            console.log(err);
                        }

                        console.log("The file was saved!");
                    });
                });
                charlie.export_pgp_public({}, function (err, pgp_public) {
                    // console.log("public key: ", pgp_public);
                    fs.appendFileSync(__dirname + "keys.txt", pgp_public, 'utf-8', function (err) {
                        if (err) {
                            console.log(err);
                        }

                        console.log("The file was saved!");
                    });
                });
            });
        });
    } else {
        let data = String(fs.readFileSync(__dirname + 'keys.txt'));
        data = data.split('/////////');

        // console.log(data);
        result.private = data[0];
        result.public = data[1];
        
    }

    // console.log('Result', result);

    return result;

}

