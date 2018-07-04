const crypto = require("../controllers/crypto");
const fs = require("fs");
let msg = fs.readFileSync("E:/evan/test.txt", "binary");
console.log(crypto.md5Encrypt("hello"));