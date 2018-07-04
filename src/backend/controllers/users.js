const gprop = require('../etc/config').prop;
let fcode = require("./code");
let users_bc = require("./users_bc");
let util = require("./util");
let wallet = require("./wallet");
let fs = require("fs");
let minio = require("./minio");
let fse = require("fs-extra");
let crypto = require("./crypto");

function addUser(req, res) {
    console.info(req.body);
    if(!req.body || !req.body.idCartNo){
        return util.resUtilError(res);
    }
    if(req.body.desc && req.body.desc.length>255){
        return util.resUtilError(res, "描述字段过长");
    }
    let walletObj = wallet.createWallet();
    // 注册用户到链上
    users_bc.addUserToBlockChain(walletObj.addressHex, walletObj.addressCompressedHex, walletObj.prikeyHex, walletObj.pubkeyCompressedHex, req.body.idCartNo, req.body.desc, (err, result) => {
        if(err){
            return util.resUtilError(res, err.message || err);
        }

        let key = "account-"+walletObj.addressCompressedHex;
        let value = {
            // 备份链上唯一的数据
            "idCartNo":req.body.idCartNo,
            // 备份链上不存在的数据
            "prikey":walletObj.prikeyHex,
            "address":walletObj.addressHex,
            // 备份链上交易hash
            "transactionHash":result.transactionHash,
            // 备份链上区块hash
            "blockHash":result.blockHash
        };
        // 加密敏感信息
        value.idCartNo = crypto.encryptByVersion(value.idCartNo);
        value.prikey = crypto.encryptByVersion(value.prikey);
        value.address = crypto.encryptByVersion(value.address);
        value = JSON.stringify(value);
        minio.saveToMinio(null, key, value, function (err, result) {});
        // 返回响应
        let ret = {};
        ret.code = 0;
        ret.message = fcode.CODE_SUCC.message;
        ret.pubkey = walletObj.pubkeyCompressedHex;
        ret.prikey = walletObj.prikeyHex;
        ret.address = walletObj.addressCompressedHex;
        ret.transactionHash = result.transactionHash;
        ret.blockHash = result.blockHash;
        res.json(ret);
    });

    //保存账号信息到本地，加密保存
    // walletObj.body = req.body;
    // let filePath = gprop.server_path+'/backup/'+walletObj.addressCompressedHex;
    // console.log(filePath)
    // fse.ensureFileSync(filePath);
    // let encryptData = crypto.encryptByVersion(JSON.stringify(walletObj));
    // fs.writeFile(filePath, encryptData, (err) => {
    //     if (err) throw err;
    //     console.log(filePath, 'The file has been saved!');
    // });
}

function delUser(req, res) {
    console.info(req.params,req.body);
    let sign = req.body.sign || req.query.sign;
    let address = req.headers.address || req.params.accountAddress;
    // 校验签名
    let isOk = wallet.verify(address, sign, req.headers.pubkey);
    if(!isOk){
        return util.resUtilError(res, "签名校验失败！");
    }
    users_bc.delUserFromBlockChain(req.headers.userId, req.headers.prikey, (err, result) => {
        if(err){
            console.error(err);
            return util.resUtilError(res, err.message || err);
        }
        // let srcPath = gprop.server_path+'/backup/'+address;
        // let dstPath = gprop.server_path+'/backup/'+address+"-deleted";
        // fse.move(srcPath, dstPath, { overwrite: true }, err => {
        //     if (err) return console.error(err)
        //     console.log(srcPath,'move to',dstPath);
        // })
        // 返回响应
        let ret = {};
        ret.code = 0;
        ret.message = fcode.CODE_SUCC.message;
        ret.transactionHash = result.transactionHash;
        ret.blockHash = result.blockHash;
        res.json(ret);
    })
}

exports.addUser = addUser;
exports.delUser = delUser;