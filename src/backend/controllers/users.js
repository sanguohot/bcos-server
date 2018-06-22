const gprop = require('../etc/config').prop;
let fcode = require("./code");
let users_bc = require("./users_bc");
let util = require("./util");
let wallet = require("./wallet");
let fs = require("fs");
let fse = require("fs-extra");
let crypto = require("./crypto");

function addUser(req, res) {
    console.info(req.body);
    if(!req.body || !req.body.idCartNo){
        return util.resUtilError(res);
    }
    let walletObj = wallet.createWallet();
    // 注册用户到链上
    users_bc.addUserToBlockChain(walletObj.addressHex, walletObj.pubkeyHex, req.body.idCartNo, req.body.desc, (err, userId) => {
        if(err){
            return util.resUtilError(res);
        }

        let ret = {};
        ret.code = 0;
        ret.message = fcode.CODE_SUCC.message;
        ret.pubkey = walletObj.pubkeyHex;
        ret.prikey = walletObj.prikeyHex;
        ret.address = walletObj.addressHex;
        res.json(ret);
    });

    //保存账号信息到本地，加密保存
    walletObj.body = req.body;
    let filePath = gprop.server_path+'/backup/'+walletObj.addressHex;
    console.log(filePath)
    fse.ensureFileSync(filePath);
    let encryptData = crypto.encryptByVersion(JSON.stringify(walletObj));
    fs.writeFile(filePath, encryptData, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}

function delUser(req, res) {
    console.info(req.params,req.body);
    if(!req.body || !req.body.sign){
        return util.resUtilError(res);
    }
    let address = req.headers.address || req.params.accountAddress;
    // 校验签名 可能是异步的 考虑async
    let isOk = wallet.verify(address, req.body.sign, req.headers.pubkey);
    if(!isOk){
        return util.resUtilError(res, "签名校验失败！");
    }
    users_bc.delUserFromBlockChain(address, (err) => {
        if(err){
            console.error(err);
            return util.resUtilError(res);
        }
        let srcPath = gprop.server_path+'/backup/'+address;
        let dstPath = gprop.server_path+'/backup/'+address+"-deleted";
        fse.move(srcPath, dstPath, { overwrite: true }, err => {
            if (err) return console.error(err)
            console.log(srcPath,'move to',dstPath);
        })
        let ret = {};
        ret.code = 0;
        ret.message = fcode.CODE_SUCC.message;
        res.json(ret);
    })
}

exports.addUser = addUser;
exports.delUser = delUser;