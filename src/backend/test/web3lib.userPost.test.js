// let web3sync = require("../web3lib/web3sync");
let web3post = require("../web3lib/post");
let util = require("../controllers/util");

let contractName = "UsersController";
let contractVersion = "v2";
let contractFunction = "getUserBasic";
let contractParams = [];
let userId = "0xe762d20db1effc73a388d0735fb8a2e0c3e333af";
let data = util.getDataForCns(userId, contractName, contractVersion, contractFunction, contractParams);

web3post.post(data.method,data.params).then(result => {
    console.log("request succ", result.length, typeof result, result, result[0]==0);
    let resultItem = util.bytes32ArrayToString(result[2]);
    console.log(resultItem, resultItem.length);
}).catch(err => {
    console.error("request error", err);
})

process.on('uncaughtException', (err) => {
    console.error(`Caught exception: ${err}\n`);
});
