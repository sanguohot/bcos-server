let web3post = require("../web3lib/post");
let web3sync = require("../web3lib/web3sync");
let async = require("async");
let util = require("./util");

function getUserBasicFromAddress(address, cb) {
    let data = util.getDataForCns("UsersData", "v1", "getUserBasic", [address]);
    web3post.post(data.method,data.params).then(result => {
        if(!result || result[0]==0 || !result[1] || !result[2]){
            return cb(0, null);
        }
        cb(0, {
            address: result[0],
            pubkey: result[1],
            idCartNo: result[2]
        });
    }).catch(err => {
        cb(err);
    })
}

function getAddressByIdCartNoOnBlockChain(idCartNo, cb) {
    let data = util.getDataForCns("UsersData", "v1", "getAddressByIdCartNo", [idCartNo]);
    web3post.post(data.method,data.params).then(result => {
        if(!result || result[0]==0){
            return cb(0, null);
        }
        cb(0, result[0]);
    }).catch(err => {
        cb(err);
    })
}

function getPubkeyFromAddress(address, cb) {
    getUserBasicFromAddress(address, function (err, basic) {
        if(err){
            return cb(err);
        }
        if(!basic){
            return cb("找不到用户");
        }
        return cb(0, basic.pubkey);
    })
}

function addUserToBlockChain(address, pubkey, idCartNo, desc, cb){
    // let data = util.getDataForCns("UsersData", "v1", "addUser", [address, pubkey, idCartNo, desc]);
    // console.log(address, pubkey, idCartNo, desc)
    // console.log(data.params[0]);
    async.waterfall([
        function(cb) {
            getUserBasicFromAddress(address, cb);
        },
        function(basic, cb) {
            if(basic){
                return cb("用户已存在，无法重复添加");
            }
            getAddressByIdCartNoOnBlockChain(idCartNo, cb);
        },
        function(address02, cb) {
            if(address02){
                return cb(idCartNo+"已存在，无法重复添加");
            }
            web3sync.sendRawTransactionByNameService(null, null, "UsersData", "addUser", "v1", [address, pubkey, idCartNo, desc]).then(result => {
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

function delUserFromBlockChain(address, cb){
    // 前面中间件已经检查了用户是否存在，到了这里用户必然存在
    web3sync.sendRawTransactionByNameService(null, null, "UsersData", "delUser", "v1", [address]).then(result => {
        // web3post.post(data.method,data.params).then(result => {
        cb(0, result);
    }).catch(err => {
        cb(err);
    })
}

exports.getPubkeyFromAddress = getPubkeyFromAddress;
exports.addUserToBlockChain = addUserToBlockChain;
exports.delUserFromBlockChain = delUserFromBlockChain;
exports.getUserBasicFromAddress = getUserBasicFromAddress;