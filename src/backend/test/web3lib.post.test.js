// let web3sync = require("../web3lib/web3sync");
let web3post = require("../web3lib/post");

let contractName = "FilesData";
let contractVersion = "v1";
let contractFunction = "getFileBasic";
let contractParams = ["77bdba1f57804db3b401dcd8a0b6594754fda0a53e751e8e914c9d0b93bac814"];
let data = getDataForCns(contractName, contractVersion, contractFunction, contractParams);

function getDataForCns(contractName, contractVersion, contractFunction, contractParams) {
    return {
        "jsonrpc":"2.0",
        "method":"eth_call",
        "params":[{"data":{"contract":contractName,"version":contractVersion,"func":contractFunction,"params":contractParams}},"latest"],
        "id":74
    }
}
web3post.post(data.method,data.params).then(result => {
    console.log("request succ", result.length, typeof result, result, result[0]==0);
}).catch(err => {
    console.error("request error", err);
})

process.on('uncaughtException', (err) => {
    console.error(`Caught exception: ${err}\n`);
});
