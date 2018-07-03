let web3post = require("../web3lib/post");
let web3sync = require("../web3lib/web3sync");
let web3config = require("../web3lib/config");

let contractName = "FilesPureData";
let contractVersion = "v2";
let contractFunction = "setInvoker";
let contractParams = ['0x15c273ab31641b188ea55631baba39257613a82b'];
// let ret = web3sync.callByNameService(contractName, contractFunction, contractVersion, contractParams);
// console.log(ret);

web3sync.sendRawTransactionByNameService(web3config.account, web3config.privKey,
    contractName, contractFunction, contractVersion, contractParams)
    .then(result => {
        console.log("succ", result, result.logs.length);
    }).catch(err => {
    console.error("fail", err);
})