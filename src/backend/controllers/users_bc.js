let web3post = require("../web3lib/post");
let web3sync = require("../web3lib/web3sync");
let async = require("async");
let util = require("./util");

function getUserBasicFromAddress(userId, cb) {
    let data = util.getDataForCns(userId, "UsersController", "v2", "getUserBasic", []);
    web3post.post(data.method,data.params).then(result => {
        if(!result || result[0]==0 || !result[1] || !result[2]){
            return cb(0, null);
        }
        cb(0, {
            address: result[0],
            pubkey: util.bytes32ArrayToString(result[1]),
            idCartNo: util.bytes32ArrayToString(result[2])
        });
    }).catch(err => {
        cb(err);
    })
}

function getAddressByIdCartNoOnBlockChain(userId, idCartNo, cb) {
    let idCartNoBytes32Array = util.stringToBytes32Array(idCartNo, 1);
    if(!idCartNoBytes32Array){
        return cb("参数错误");
    }
    let data = util.getDataForCns(userId, "UsersController", "v2", "getUserIdByIdCartNo", [
        idCartNoBytes32Array
    ]);
    web3post.post(data.method,data.params).then(result => {
        if(!result || result[0]==0){
            return cb(0, null);
        }
        cb(0, result[0]);
    }).catch(err => {
        cb(err);
    })
}

function getPubkeyFromAddress(userId, cb) {
    getUserBasicFromAddress(userId, function (err, basic) {
        if(err){
            return cb(err);
        }
        if(!basic){
            return cb("找不到用户");
        }
        return cb(0, basic.pubkey);
    })
}

function addUserToBlockChain(userId, address, prikey, pubkey, idCartNo, desc, cb){
    let pubkeyBytes32Array = util.stringToBytes32Array(pubkey, 4);
    let idCartNoBytes32Array = util.stringToBytes32Array(idCartNo, 1);
    let descBytes32Array = util.stringToBytes32Array(desc, 8);
    if(!pubkeyBytes32Array || !idCartNoBytes32Array || !descBytes32Array){
        return cb("参数错误");
    }
    async.waterfall([
        function(cb) {
            getUserBasicFromAddress(userId, cb);
        },
        function(basic, cb) {
            if(basic){
                return cb("用户已存在，无法重复添加");
            }
            getAddressByIdCartNoOnBlockChain(userId, idCartNo, cb);
        },
        function(address02, cb) {
            if(address02){
                return cb(idCartNo+"已存在，无法重复添加");
            }
            web3sync.sendRawTransactionByNameService(userId, prikey, "UsersController", "addUser", "v2",
                [
                    address,
                    pubkeyBytes32Array,
                    idCartNoBytes32Array,
                    descBytes32Array,
                    new Date().getTime()
                ]
            ).then(result => {
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

function delUserFromBlockChain(userId, prikey, cb){
    // 前面中间件已经检查了用户是否存在，到了这里用户必然存在
    web3sync.sendRawTransactionByNameService(userId, prikey, "UsersController", "delUser", "v2", []).then(result => {
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
