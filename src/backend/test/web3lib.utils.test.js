let utils = require("../web3lib/utils");
let wallet = require("../controllers/wallet");
let prikey = "736d0f8b7156dc02b163ebc954c94e561982383b85aa6d9ade023534845bd78d";
let prikeyBuffer = Buffer.from(prikey, "hex");
console.log(prikeyBuffer.length, prikeyBuffer)
let pubkey = utils.privateToPublic(prikey).toString("hex");
let address = utils.privateToAddress(prikey).toString("hex");
console.log(prikey);
console.log(pubkey);
console.log(address);

let msg = "hello world";
let walletObj = wallet.createWallet(prikey);
let sign = wallet.sign(msg,prikey);
// let isOk = wallet.verify(msg,sign,pubkey);
// let isOk02 = wallet.verify(msg,sign,walletObj.pubkeyHex);

console.log(walletObj, walletObj.addressHex.length);