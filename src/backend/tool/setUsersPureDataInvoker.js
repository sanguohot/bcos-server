let web3post = require("../web3lib/post");
let web3sync = require("../web3lib/web3sync");
let web3config = require("../web3lib/config");

let contractName = "UsersPureData";
let contractVersion = "v2";
let contractFunction = "setInvoker";
let contractParams = ['0x517e34f22e17d9f53408a5ef0462b0707fc4d42b'];
// let ret = web3sync.callByNameService(contractName, contractFunction, contractVersion, contractParams);
// console.log(ret);

web3sync.sendRawTransactionByNameService(web3config.account, web3config.privKey,
    contractName, contractFunction, contractVersion, contractParams)
    .then(result => {
        console.log("succ", result, result.logs.length);
    }).catch(err => {
    console.error("fail", err);
})