const secp256k1 = require("secp256k1/elliptic");
const createKeccakHash = require("keccak");
const crypto = require('crypto');
const rlp = require('rlp');
// 地址转换
function toChecksumAddress(address) {
    address = address.toLowerCase().replace('0x', '');
    let hash = createKeccakHash('keccak256').update(address).digest('hex');
    let ret = '0x';
    for (let i = 0; i < address.length; i++) {
        if (parseInt(hash[i], 16) >= 8) {
            ret += address[i].toLowerCase();
        } else {
            ret += address[i];
        }
    }
    return ret;
}
function createWallet(key) {
    // 生成私钥
    let privateKey = key ? Buffer.from(key,"hex"):crypto.randomBytes(32);
    // 生成公钥
    let publicKey = secp256k1.publicKeyCreate(privateKey, false).slice(1);//不压缩
    let publicKeyCompressed = secp256k1.publicKeyCreate(privateKey);//压缩
    // 生成地址
    let address = createKeccakHash("keccak256").update(publicKey).digest().slice(-20);
    let normAddress = toChecksumAddress(address.toString('hex'));
    // 生成地址02
    let addressCompressed = createKeccakHash("keccak256").update(publicKeyCompressed).digest().slice(-20);
    let normAddressCompressed = toChecksumAddress(addressCompressed.toString('hex'));
    return {
        prikeyHex: privateKey.toString("hex"),
        pubkeyHex: publicKey.toString("hex"),
        addressHex: normAddress,
        pubkeyCompressedHex: publicKeyCompressed.toString("hex"),
        addressCompressedHex: normAddressCompressed
    }
}

function sha3(data) {
    return createKeccakHash("keccak256").update(data).digest();
}

function rlphash(a) {
    return sha3(rlp.encode(a))
}

function sign(msg,prikey) {
    msg = Buffer.from(msg);
    let sigObj = secp256k1.sign(rlphash(msg), Buffer.from(prikey,"hex"));
    return sigObj.signature.toString("hex");
}

function verify(msg,sign,pubkey) {
    msg = Buffer.from(msg);
    return secp256k1.verify(rlphash(msg), Buffer.from(sign,"hex"), Buffer.from(pubkey,"hex"));
}

function verifyRlpHashBuffer(msgBuffer,sign,pubkey) {
    return secp256k1.verify(msgBuffer, Buffer.from(sign,"hex"), Buffer.from(pubkey,"hex"));
}

exports.createWallet = createWallet;
exports.sign = sign;
exports.verify = verify;
exports.verifyRlpHashBuffer = verifyRlpHashBuffer;
exports.rlphash = rlphash;