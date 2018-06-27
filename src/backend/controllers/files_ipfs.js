let ipfsAPI = require('ipfs-api');
let crypto = require('../controllers/crypto');
// connect to ipfs daemon API server
let ipfs = ipfsAPI('10.6.250.50', '5001', {protocol: 'http'});

function addFileToIpfs(file, cb) {
    if(!file || !file.buffer || !file.size || !file.buffer.length){
        console.error(file);
        return cb(1);
    }
    let content = file.buffer.toString("binary");
    let fileName = file.originalname;
    if(fileName.indexOf("/")>=0){
        console.error(fileName);
        return cb(1);
    }
    let encryptContent = Buffer.from(crypto.encryptByVersion(content));
    if(!encryptContent){
        console.error("加密发生错误");
        return cb(1);
    }
    console.log("加密后的数据", encryptContent);
    ipfs.files.add({
        path : fileName,
        content:encryptContent
    }, (err, files) => {
        if (err) {
            console.error(err);
            return cb(err);
        }
        console.log(files);
        if(!files || files.length!=1 || !files[0] || !files[0].hash){
           console.error(files);
           return cb(1);
        }
        return cb(0, files[0].hash);
    });
}

function getFileFromIpfs(ipfsHash, cb) {
    if(!ipfsHash){
        console.error("ipfsHash不存在");
        return cb(1);
    }
    ipfs.files.get(ipfsHash, (err, files) => {
        if (err) {
            return console.error(err)
        }
        console.log(files);
        if(!files || files.length!=1 || !files[0] || !files[0].content){
            return console.error(files);
        }
        let encryptContent = files[0].content.toString();
        console.log("获得加密的数据", encryptContent);
        let decryptContent = null;
        try {
            decryptContent = crypto.decryptByVersion(encryptContent);
            // console.log("获得解密的数据", decryptContent);
            return cb(0, decryptContent);
        }catch (e){
            console.error(e);
            console.log("解密失败直接返回原文")
            return cb(0, encryptContent);
        }
        // return cb(0, decryptContent);
    });
}


exports.addFileToIpfs = addFileToIpfs;
exports.getFileFromIpfs = getFileFromIpfs;

// getFileFromIpfs("QmS1PB5wDpGiyeFhgr1RfxKCUL92dhdfmmVEzfSiMY3kNn", function (err,ret) {
//     console.log(err, ret)
// })