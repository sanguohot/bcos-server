let web3post = require("../web3lib/post");
let web3sync = require("../web3lib/web3sync");
let util = require("../controllers/util");
let web3config = require("../web3lib/config");

let contractName = "UsersController";
let contractVersion = "v2";
let contractFunction = "delUser";
let contractParams = [

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