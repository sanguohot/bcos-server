const os = require("os");
const gprop = require('../etc/'+(os.platform()=="linux"?"config-linux":"config")).prop;
let fs = require('fs');
const fileType = require('file-type');
let crypto = require('../controllers/crypto');
const iconv = require('iconv-lite');
const jschardet = require("jschardet");
let helloStr = "hello";
let helloBuf = Buffer.from(helloStr);
console.log(fileType(helloBuf))
let fileBuf = fs.readFileSync("E:/evan/文件上传的写法.txt");
let content = fileBuf.toString("binary");
let encryptContent = crypto.encryptByVersion(content);
let decryptContent = crypto.decryptByVersion(encryptContent);
console.log("原始数据",fileBuf, jschardet.detect(fileBuf),fileBuf.length,content.length, fileType(fileBuf));
console.log(Buffer.from(content, "binary"));
console.log("加密数据",encryptContent);
let encoding =jschardet.detect(decryptContent).encoding;
console.log("解密数据",encoding,"长度",decryptContent.length, fileType(Buffer.from(decryptContent, "binary")))
// console.log("解密数据",encoding,"长度",decryptContent.length,iconv.decode(decryptContent,getEncodingForIconv(encoding)));

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