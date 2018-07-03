// let web3post = require("../web3lib/post");
let web3sync = require("../web3lib/web3sync");
let web3config = require("../web3lib/config");

let contractName = "FilesData";
let contractVersion = "v1";
let contractFunction = "addFileSigner";
let contractParams = [ '77bdba1f57804db3b401dcd8a0b6594754fda0a53e751e8e914c9d0b93bac814',
    '0x84286e363ccf185f0689100175d5b0ab5cad53f1',
    'db3de583080bab2142f68e69ee635374c7eb3d6c54c51d1ef7aef26983114caf1a56f994feb4303359d6d8c15d48a8879886a2370b5794c81dcf652075f74a13' ];
// let ret = web3sync.callByNameService(contractName, contractFunction, contractVersion, contractParams);
// console.log(ret);

web3sync.sendRawTransactionByNameService(web3config.account, web3config.privKey,
    contractName, contractFunction, contractVersion, contractParams)
    .then(result => {
        console.log("succ", result, result.logs.length);
    }).catch(err => {
        console.error("fail", err);
    })