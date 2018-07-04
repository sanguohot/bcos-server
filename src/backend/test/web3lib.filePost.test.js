// let web3sync = require("../web3lib/web3sync");
let web3post = require("../web3lib/post");
let util = require("../controllers/util");
let crypto = require("../controllers/crypto");

let contractName = "FilesController";
let contractVersion = "v2";
let contractFunction = "getFileSignDataByIndex";
let fileIdBytes32Array = util.stringToBytes32Array(crypto.md5Encrypt("77bdba1f57804db3b401dcd8a0b6594754fda0a53e751e8e914c9d0b93bac814"),1);
console.log(fileIdBytes32Array, fileIdBytes32Array.length)
let contractParams = [fileIdBytes32Array,1];
let userId = "0xe762d20db1effc73a388d0735fb8a2e0c3e333af";
let data = util.getDataForCns(userId, contractName, contractVersion, contractFunction, contractParams);

web3post.post(data.method,data.params).then(result => {
    console.log("request succ", result.length, typeof result, result, result[0]==0);
    let resultItem = util.bytes32ArrayToString(result[0]);
    console.log(resultItem, resultItem.length);
}).catch(err => {
    console.error("request error", err);
})

process.on('uncaughtException', (err) => {
    console.error(`Caught exception: ${err}\n`);
});
