let web3post = require("../web3lib/post");
let web3sync = require("../web3lib/web3sync");
let util = require("../controllers/util");
let web3config = require("../web3lib/config");

let contractName = "UsersController";
let contractVersion = "v2";
let contractFunction = "addUser";
let address = "0xa1c967d18ea2e7b1eabb0592476837d7ad6622ee";
let pubkey = "035f145efa3a1bd4d5baeb787782cbab1a0d62d807dfe75eab528942d6ddbbb9bf";
let idCartNo = '123456';
let detail = "just for 测试";
let time = new Date().getTime();
let contractParams = [
    address,
    util.stringToBytes32Array(pubkey, 4),
    util.stringToBytes32Array(idCartNo, 1),
    util.stringToBytes32Array(detail,8),
    time
];
// let ret = web3sync.callByNameService(contractName, contractFunction, contractVersion, contractParams);
console.log(contractParams);

web3sync.sendRawTransactionByNameService("0x9d477553d813abd80d11774bc862ad56859da775", "0375cce274fc900fbafab990a2fdd49805bd5a555ce7191712aa6e74b9d64bb9",
    contractName, contractFunction, contractVersion, contractParams)
    .then(result => {
        console.log("succ", result, result.logs.length);
    }).catch(err => {
        console.error("fail", err);
    })