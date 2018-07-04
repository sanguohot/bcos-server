let async = require("async");
let fcode = require("./code");
let user_bc = require("./users_bc");
let files_bc = require("./files_bc");
let wallet = require("./wallet");
let minio = require("./minio");
let crypto = require("./crypto");
let util = require("./util");
function addressCheck(req, res, next) {
    if(!req.headers && !req.params){
        return util.resUtilError(res);
    }
    let address = req.headers.address || req.params.accountAddress;
    if(!address){
        return util.resUtilError(res, "缺少账户地址");
    }
    if(!util.isValidAddress(address)){
        return util.resUtilError(res, "账户地址非法");
    }
    // 根据地址获取公钥 可能是异步的

    async.waterfall([
        function(cb) {
            minio.getInMinio(null, "account-"+address, cb);
        },
        function(minioObj, cb) {
            let prikey = crypto.decryptByVersion(minioObj.prikey);
            if(!prikey){
                return cb("解密私钥失败");
            }
            let walletObj = wallet.createWallet(prikey);
            if(walletObj.addressCompressedHex != address){
                return cb("私钥与地址不匹配");
            }
            req.headers.userId = walletObj.addressHex;
            req.headers.prikey = prikey;
            req.headers.pubkey = walletObj.pubkeyCompressedHex;
            cb();
        },
        function(cb) {
            user_bc.getPubkeyFromAddress(req.headers.userId,(err, pubkey) => {
                if(err){
                    return cb(err);
                }
                req.headers.pubkey = pubkey;
                if(!pubkey || pubkey!=req.headers.pubkey){
                    return cb("链上公钥非法");
                }
                cb();
            });
        }
    ], function (err, result) {
        // result now equals 'done'
        if(err){
            console.error(err.message || err);
            return util.resUtilError(res, err.message || err);
        }
        next();
    });
}

function fileHashCheck(req, res, next) {
    if(!req.params || !req.params.fileHash){
        return util.resUtilError(res, "缺少文件摘要");
    }
    if(req.params.fileHash.length != 64){
        return util.resUtilError(res, "文件摘要长度错误");
    }
    // 根据文件hash获取签名者数量 可能是异步的
    files_bc.getSignNumFromBlockChain(req.headers.userId, req.params.fileHash, function (err, fileSignSize) {
        if(err){
            return util.resUtilError(res, err.message || err);
        }
        if(!fileSignSize){
            return util.resUtilError(res, "链上未找到文件");
        }
        req.headers.fileSignSize = fileSignSize;
        next();
    });
}

function signCheck(req, res, next) {
    let sign = req.body.sign || req.query.sign;
    util.isVailidSign(sign, function (err) {
        if(err){
            return util.resUtilError(res, err.message || err);
        }
        next();
    })
}
exports.addressCheck = addressCheck;
exports.fileHashCheck = fileHashCheck;
exports.signCheck = signCheck;