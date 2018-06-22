let web3post = require("../web3lib/post");
let web3sync = require("../web3lib/web3sync");
let web3config = require("../web3lib/config");

let contractName = "FilesData";
let contractVersion = "v1";
let contractFunction = "isAccountAddressExist";
let contractParams = [ 'e6c1a9d98072d35e7094c7db41ab9e16aaac3c5f3c182ec51771a840ac7df1de', "0xf38f094577daf0f08f315759d9da0e075572bc1d"];
let ret = web3sync.callByNameService(contractName, contractFunction, contractVersion, contractParams);
console.log(ret);