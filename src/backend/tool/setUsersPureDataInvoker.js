let web3post = require("../web3lib/post");
let web3sync = require("../web3lib/web3sync");
let web3config = require("../web3lib/config");

let contractName = "UsersPureData";
let contractVersion = "v2";
let contractFunction = "setInvoker";
let contractParams = ['0xc32a4c7d7c154cdf6041d3fc31321eee0cad9a16'];
// let ret = web3sync.callByNameService(contractName, contractFunction, contractVersion, contractParams);
// console.log(ret);

web3sync.sendRawTransactionByNameService(web3config.account, web3config.privKey,
    contractName, contractFunction, contractVersion, contractParams)
    .then(result => {
        console.log("succ", result, result.logs.length);
    }).catch(err => {
    console.error("fail", err);
})