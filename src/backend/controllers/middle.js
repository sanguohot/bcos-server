let fcode = require("./code");
let user_bc = require("./users_bc");
let files_bc = require("./files_bc");
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
    user_bc.getPubkeyFromAddress(address,(err, pubkey) => {
        if(err || !pubkey){
            return util.resUtilError(res, err.message || err);
        }
        req.headers.pubkey = pubkey;
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
    files_bc.getSignNumFromBlockChain(req.params.fileHash, function (err, fileSignSize) {
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