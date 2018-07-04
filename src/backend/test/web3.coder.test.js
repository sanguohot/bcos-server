let web3Utils = require('web3/lib/utils/utils');
let web3Coder = require('web3/lib/solidity/coder');
let str = "hello";
let en=web3Coder.encodeParam('bytes32', str);
let de=web3Coder.decodeParam('bytes32', en);
console.log(typeof en,en,en.length);
console.log(typeof de,de,de.length);
let hexStr = web3Utils.fromUtf8(str);
let buf1 = Buffer.from(hexStr.substr(2),"hex");
let buf2 = Buffer.from(str);
console.log(hexStr,typeof hexStr);
console.log("buf1 ===>",buf1,buf1.length,buf1.toString());
console.log("buf2 ===>",buf2,buf2.length);
console.log("buf2 to hex ===>",buf2.toString("hex"));
console.log(web3Utils.toUtf8(hexStr))