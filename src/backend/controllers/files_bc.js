let web3post = require("../web3lib/post");
let web3sync = require("../web3lib/web3sync");
let async = require("async");
let util = require("./util");
let MAX_SIGN_SIZE = 3;

function getSignNumFromBlockChain(fileHash, cb) {
    getFileBasicFromBlockChain(fileHash, function (err, basic) {
        if(err){
            return cb(err);
        }
        if(!basic || !basic.fileSignSize){
            return cb(0, 0);
        }
        return cb(0, parseInt(basic.fileSignSize));
    })
}

function isAccountAddressExistOnBlockChain(fileHash, address, cb) {
    if(!address){
        return cb("参数错误");
    }
    let data = util.getDataForCns("FilesData", "v1", "isAccountAddressExist", [fileHash, address]);
    console.log("开始发送请求","isAccountAddressExist",[fileHash, address]);
    web3post.post(data.method,data.params).then(result => {
        if(!result || !result[0]){
            return cb(0, false);
        }
        cb(0, true);
    }).catch(err => {
        console.error(err);
        cb(err);
    })
}

function getFileBasicFromBlockChain(fileHash, cb) {
    if(!fileHash){
        return cb("参数错误");
    }
    let data = util.getDataForCns("FilesData", "v1", "getFileBasic", [fileHash]);
    console.log("开始发送请求","getFileBasic",[fileHash]);
    web3post.post(data.method,data.params).then(result => {
        if(!result || result[0]==0 || !result[1] || !result[2] || !result[3] || !result[4]){
            return cb(0, null);
        }
        cb(0, {
            ownerAddress : result[0],
            fileHash : result[1],
            filePath : result[2],
            fileSignSize : result[3],
            originalFileSize : result[4]
        });
    }).catch(err => {
        console.error(err);
        cb(err);
    })
}

function getFileSignerAddressListFromBlockChain(fileHash, fileSignSize, cb) {
    if(!fileHash || !fileSignSize){
        return cb("参数错误");
    }
    let count = 0;
    let list = [];
    async.whilst(
        function() { return count < fileSignSize; },
        function(cb) {
            let data = util.getDataForCns("FilesData", "v1", "getFileSignerAddressByIndex", [fileHash, count]);
            count++;
            web3post.post(data.method,data.params).then(result => {
                if(!result || !result[0]){
                    return cb("链上找不到签名地址");
                }
                list.push(result[0]);
                cb(0);
            }).catch(err => {
                cb(err);
            })
        },
        function (err, n) {
            // 5 seconds have passed, n = 5
            if(err){
                return cb(err);
            }
            cb(0, list);
        }
    );
}

function addSignToBlockChain(fileHash, address, sign, cb) {
    if(!fileHash || !sign || !address){
        return cb("参数错误");
    }
    async.waterfall([
        function(cb) {
            getFileBasicFromBlockChain(fileHash, cb);
        },
        function (basic, cb) {
            if(!basic){
                return cb("文件不存在，无法添加签名");
            }
            getFileSignerAddressListFromBlockChain(fileHash, basic.fileSignSize, cb);
        },
        function(signList, cb) {
            if(!signList || !signList.length){
                return cb("文件签名列表非法");
            }
            if(signList.length >= MAX_SIGN_SIZE){
                return cb("文件签名列表非法");
            }
            let isExist = false;
            console.log(signList)
            signList.some((value, index, array) => {
                if(address == value){
                    isExist = true;
                    return true;
                }
                return false;
            })
            if(isExist){
                return cb("文件已签名");
            }
            cb();
        },
        function (cb) {
            web3sync.sendRawTransactionByNameService(null, null, "FilesData", "addFileSigner", "v1", [fileHash, address, sign]).then(result => {
                // web3post.post(data.method,data.params).then(result => {
                console.log("交易成功",result);
                cb(0, result);
            }).catch(err => {
                console.error("交易失败", err);
                cb(err);
            })
        }
    ], function (err, result) {
        // result now equals 'done'
        if(err){
            return cb(err);
        }
        cb(0, result);
    });
}

function addFileToBlockChain(address, sign, fileHash, ipfsHash, fileSize, detail, cb) {
    if(!address || !sign || !fileHash || !ipfsHash || !fileSize){
        return cb(1);
    }

    async.waterfall([
        function(cb) {
            getFileBasicFromBlockChain(fileHash, cb);
        },
        function (basic, cb) {
            if(basic){
                return cb("文件已存在，无法重复添加");
            }
            web3sync.sendRawTransactionByNameService(null, null, "FilesData", "addFile", "v1", [address, sign, fileHash, ipfsHash, fileSize, detail]).then(result => {
                // web3post.post(data.method,data.params).then(result => {
                console.log("交易成功",result);
                cb(0, result);
            }).catch(err => {
                console.error("交易失败", err);
                cb(err);
            })
        }
    ], function (err, result) {
        // result now equals 'done'
        if(err){
            return cb(err);
        }
        cb(0, result);
    });
}

exports.getFileSignerAddressListFromBlockChain = getFileSignerAddressListFromBlockChain;
exports.getSignNumFromBlockChain = getSignNumFromBlockChain;
exports.addSignToBlockChain = addSignToBlockChain;
exports.addFileToBlockChain = addFileToBlockChain;
exports.getFileBasicFromBlockChain = getFileBasicFromBlockChain;
exports.isAccountAddressExistOnBlockChain = isAccountAddressExistOnBlockChain;