let web3post = require("../web3lib/post");
let web3sync = require("../web3lib/web3sync");
let async = require("async");
let util = require("./util");
let crypto = require("./crypto");
let MAX_SIGN_SIZE = 3;

function getSignNumFromBlockChain(userId, fileHash, cb) {
    getFileBasicFromBlockChain(userId, fileHash, function (err, basic) {
        if(err){
            return cb(err);
        }
        if(!basic || !basic.fileSignSize){
            return cb(0, 0);
        }
        return cb(0, parseInt(basic.fileSignSize));
    })
}

function isAccountAddressExistOnBlockChain(fileHash, userId, cb) {
    if(!userId){
        return cb("参数错误");
    }
    let fileIdBytes32Array = util.stringToBytes32Array(crypto.md5Encrypt(fileHash),1);
    if(!fileIdBytes32Array){
        return cb("参数错误");
    }
    let data = util.getDataForCns(userId, "FilesController", "v2", "isUserIdExist", [fileIdBytes32Array]);
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

function getFileBasicFromBlockChain(userId, fileHash, cb) {
    if(!fileHash || !userId){
        return cb("参数错误");
    }
    let fileIdBytes32Array = util.stringToBytes32Array(crypto.md5Encrypt(fileHash),1);
    if(!fileIdBytes32Array){
        return cb("参数错误");
    }
    let data = util.getDataForCns(userId, "FilesController", "v2", "getFileBasic", [fileIdBytes32Array]);
    web3post.post(data.method,data.params).then(result => {
        if(!result || result[0]==0 || !result[1] || !result[2] || !result[3] || !result[4]){
            return cb(0, null);
        }
        cb(0, {
            ownerAddress : result[0],
            fileHash : util.bytes32ArrayToString(result[1]),
            ipfsHash : util.bytes32ArrayToString(result[2]),
            fileSignSize : result[3],
            time : result[4]
        });
    }).catch(err => {
        console.error(err);
        cb(err);
    })
}

function getFileSignerAddressListFromBlockChain(userId, fileHash, fileSignSize, cb) {
    if(!userId || !fileHash || !fileSignSize){
        return cb("参数错误");
    }
    let fileIdBytes32Array = util.stringToBytes32Array(crypto.md5Encrypt(fileHash),1);
    if(!fileIdBytes32Array){
        return cb("参数错误");
    }
    let count = 0;
    let list = [];
    async.whilst(
        function() { return count < fileSignSize; },
        function(cb) {
            let data = util.getDataForCns(userId, "FilesController", "v2", "getFileSignerAddressByIndex", [
                fileIdBytes32Array,
                count
            ]);
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

function addSignToBlockChain(userId, prikey, fileHash, sign, cb) {
    if(!userId || !prikey || !fileHash || !sign){
        return cb("参数错误");
    }
    let signBytes32Array = util.stringToBytes32Array(sign, 4);
    let fileIdBytes32Array = util.stringToBytes32Array(crypto.md5Encrypt(fileHash),1);
    if(!signBytes32Array || !fileIdBytes32Array){
        return cb("参数错误");
    }
    async.waterfall([
        function(cb) {
            getFileBasicFromBlockChain(userId, fileHash, cb);
        },
        function (basic, cb) {
            if(!basic){
                return cb("文件不存在，无法添加签名");
            }
            getFileSignerAddressListFromBlockChain(userId, fileHash, basic.fileSignSize, cb);
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
                if(userId == value){
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
            web3sync.sendRawTransactionByNameService(userId, prikey, "FilesController", "addFileSigner", "v2", [
                fileIdBytes32Array,
                signBytes32Array
            ]).then(result => {
                // web3post.post(data.method,data.params).then(result => {
                cb(0, result);
            }).catch(err => {
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

function addFileToBlockChain(userId, prikey, sign, fileHash, ipfsHash, detail, cb) {
    if(!userId || !prikey || !sign || !fileHash || !ipfsHash){
        return cb("参数错误");
    }
    let signBytes32Array = util.stringToBytes32Array(sign, 4);
    let fileHashBytes32Array = util.stringToBytes32Array(fileHash, 2);
    let ipfsHashBytes32Array = util.stringToBytes32Array(ipfsHash, 2);
    let detailBytes32Array = util.stringToBytes32Array(detail, 4);
    let fileIdBytes32Array = util.stringToBytes32Array(crypto.md5Encrypt(fileHash),1);
    if(!signBytes32Array || !fileHashBytes32Array || !ipfsHashBytes32Array || !detailBytes32Array || !fileIdBytes32Array){
        return cb("参数错误");
    }
    async.waterfall([
        function(cb) {
            getFileBasicFromBlockChain(userId, fileHash, cb);
        },
        function (basic, cb) {
            if(basic){
                return cb("文件已存在，无法重复添加");
            }
            web3sync.sendRawTransactionByNameService(userId, prikey, "FilesController", "addFile", "v2", [
                fileIdBytes32Array,
                signBytes32Array,
                fileHashBytes32Array,
                ipfsHashBytes32Array,
                detailBytes32Array,
                new Date().getTime()
            ]).then(result => {
                // web3post.post(data.method,data.params).then(result => {
                cb(0, result);
            }).catch(err => {
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