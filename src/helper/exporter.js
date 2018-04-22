const os = require('os');
const fs = require('fs');
const aesjs = require('aes-js');

const wordlist = String(fs.readFileSync('./eff-long.txt')).split('\n');

const workingDir = os.homedir() + '/.haven';

module.exports = () => {
    const key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
    

    console.log(key);

    const dataStr = String(fs.readFileSync(`${workingDir}/data.json`));
    const dataBytes = aesjs.utils.utf8.toBytes(dataStr);

    const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    const encryptedBytes = aesCtr.encrypt(dataBytes);

    const encryptedText = aesjs.utils.utf8.fromBytes(encryptedBytes);

    console.log(encryptedText);

}