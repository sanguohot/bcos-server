let web3post = require("../web3lib/post");
let web3sync = require("../web3lib/web3sync");
let web3config = require("../web3lib/config");

let contractName = "UsersController";
let contractVersion = "v2";
let contractFunction = "getUserIdByIdCartNo";
let contractParams = [ '450721198801233412'];
let ret = web3sync.callByNameService(contractName, contractFunction, contractVersion, contractParams);
console.log(ret,ret[0]==0);