const os = require("os");
const gprop = require('../etc/'+(os.platform()=="linux"?"config-linux":"config")).prop;
let fs = require('fs');
let crypto = require('../controllers/crypto');
let encryptContent = fs.readFileSync(gprop.server_path+"/backup/0x5b0eacf21b64ca24fd8aed0e0c4e027b6fb10a54").toString();
let decryptContent = crypto.decryptByVersion(encryptContent);
console.log("加密报文",encryptContent);
console.log("解密报文",decryptContent);
process.on('uncaughtException', (err) => {
    console.error(`Caught exception: ${err}\n`);
});