let web3post = require("../web3lib/post");
let web3sync = require("../web3lib/web3sync");
let web3config = require("../web3lib/config");

let contractName = "FilesData";
let contractVersion = "v1";
let contractFunction = "addFileSigner";
let contractParams = [ 'e6c1a9d98072d35e7094c7db41ab9e16aaac3c5f3c182ec51771a840ac7df1de',
    '0xf38f094577daf0f08f315759d9da0e075572bc1d',
    'caffc3d0b288fbb8459f4fc6129e13650b505980b8f3e0db31d23587378c7ddc00bb5575eef706ad376206a07badb052d871676c88a83cf0047a9308551e4ea6' ];
// let ret = web3sync.callByNameService(contractName, contractFunction, contractVersion, contractParams);
// console.log(ret);

web3sync.sendRawTransactionByNameService(web3config.account, web3config.privKey,
    contractName, contractFunction, contractVersion, contractParams)
    .then(result => {
        console.log("succ", result, result.logs.length);
    }).catch(err => {
        console.error("fail", err);
    })