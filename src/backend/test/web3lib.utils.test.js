let utils = require("../web3lib/utils");
let prikey = "bcec428d5205abe0f0cc8a734083908d9eb8563e31f943d760786edf42ad67dd";
let prikeyBuffer = Buffer.from(prikey, "hex");
console.log(prikeyBuffer.length, prikeyBuffer)
let pubkey = utils.privateToPublic(prikey).toString("hex");
let address = utils.privateToAddress(prikey).toString("hex");
console.log(prikey)
console.log(pubkey)
console.log(address)