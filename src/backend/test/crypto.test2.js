const os = require("os");
const gprop = require('../etc/'+(os.platform()=="linux"?"config-linux":"config")).prop;
let fs = require('fs');
let crypto = require('../controllers/crypto');
const iconv = require('iconv-lite');
const jschardet = require("jschardet");
let fileStr = fs.readFileSync("E:/evan/文件上传的写法.txt");
let content = fileStr.toString("binary");
let encryptContent = crypto.encryptByVersion(content);
let decryptContent = crypto.decryptByVersion(encryptContent);
console.log("原始数据",jschardet.detect(fileStr),fileStr.length,content.length);
console.log("加密数据",encryptContent);
let encoding =jschardet.detect(decryptContent).encoding;
console.log("解密数据",encoding,"长度",decryptContent.length,iconv.decode(decryptContent,getEncodingForIconv(encoding)));

function getEncodingForIconv(encoding) {
    let encodingMap = {
        "UTF-8" : "utf8",
        "GB2312" : "gbk",
        "DEFAULT" : "binary"
    };
    if(!encoding || !encodingMap[encoding]){
        return encodingMap["DEFAULT"];
    }
    return encodingMap[encoding];
}
// if()
console.log(encoding,"解密",jschardet.detect(decryptContent));