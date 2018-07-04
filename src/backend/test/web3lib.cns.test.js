let web3post = require("../web3lib/post");
let web3sync = require("../web3lib/web3sync");
let web3config = require("../web3lib/config");
let util = require("../controllers/util");

let contractName = "UsersController";
let contractVersion = "v2";
let contractFunction = "getUserBasic";
let idCartNo = "450721198801233412";
console.log(Buffer.from(idCartNo,"utf8").length,Buffer.from(idCartNo,"utf8").toString("hex"))
let contractParams = [ ];
let ret = callByNameService(contractName, contractFunction, contractVersion, contractParams, "0x64fa644d2a694681bd6addd6c5e36cccd8dcdde3");
console.log(ret,ret[0]==0);
console.log(util.bytes32ArrayToString(ret[1], "hex"))

//通过name服务调用call函数
function callByNameService(contract, func, version, params ,from) {

    var namecallparams = {
        "contract": contract,
        "func": func,
        "version": version,
        "params": params
    };

    var strnamecallparams = JSON.stringify(namecallparams);
    //console.log("===>> namecall params = " + strnamecallparams);

    var postdata = {
        data: namecallparams,
        to: "",
        from: from
    };

    var call_result = web3.eth.call(postdata);
    // console.log(call_result)
    return JSON.parse(call_result);
}