let web3post = require("../web3lib/post");
let web3sync = require("../web3lib/web3sync");
let web3config = require("../web3lib/config");

let contractName = "UsersData";
let contractVersion = "v1";
let contractFunction = "getAddressByIdCartNo";
let contractParams = [ '450721198801233412'];
let ret = web3sync.callByNameService(contractName, contractFunction, contractVersion, contractParams);
console.log(ret,ret[0]==0);