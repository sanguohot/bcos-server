const os = require("os");
const gprop = require('../etc/'+(os.platform()=="linux"?"config-linux":"config")).prop;
let fs = require('fs');
let crypto = require('../controllers/crypto');
let encryptContent = fs.readFileSync(gprop.server_path+"/backup/0xe381f393b0087c9622fd26d838e172178a1faf99").toString();
let decryptContent = crypto.decryptByVersion(encryptContent);
console.log("加密报文",encryptContent);
console.log("解密报文",decryptContent);
process.on('uncaughtException', (err) => {
    console.error(`Caught exception: ${err}\n`);
});