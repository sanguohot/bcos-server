let crypto = require('crypto');

/**
 * 加密方法
 * @param key 加密key
 * @param iv       向量
 * @param data     需要加密的数据
 * @returns string
 */
let encrypt = function (key, iv, data) {
    let cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let crypted = cipher.update(data, 'utf8', 'binary');
    crypted += cipher.final('binary');
    crypted = new Buffer(crypted, 'binary').toString('base64');
    return crypted;
};

/**
 * 解密方法
 * @param key      解密的key
 * @param iv       向量
 * @param crypted  密文
 * @returns string
 */
let decrypt = function (key, iv, crypted) {
    crypted = new Buffer(crypted, 'base64').toString('binary');
    let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decoded = decipher.update(crypted, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
};
let KEY_IV_MAP = {
    "v1" : {key : "64106cdab5c8f831", iv : "2378956021298450"},
    "v2" : {key : "751f621ea5c8f930", iv : "2624750004598718"}
};
function getDefaultKey() {
    return KEY_IV_MAP["v1"].key;
}

function getDefaultIv() {
    return KEY_IV_MAP["v1"].iv;
}

function actionByVersion(action, data, version) {
    if(!data){
        return "";
    }

    let key = null;
    let iv = null;
    if(!KEY_IV_MAP[version]){
        key = getDefaultKey();
        iv = getDefaultIv();
    }else {
        key = KEY_IV_MAP[version].key;
        iv = KEY_IV_MAP[version].iv;
    }
    if(action == "encrypt"){
        return encrypt(key, iv, data);
    }else {
        return decrypt(key, iv, data);
    }
}

function encryptByVersion(data, version) {
    return actionByVersion("encrypt", data, version);
}
function decryptByVersion(data, version) {
    return actionByVersion("decrypt", data, version);
}
exports.decrypt = decrypt;
exports.encrypt = encrypt;
exports.getDefaultKey = getDefaultKey;
exports.getDefaultIv = getDefaultIv;
exports.encryptByVersion = encryptByVersion;
exports.decryptByVersion = decryptByVersion;

// let key = '751f621ea5c8f930';
// console.log('加密的key:', key.toString('hex'));
// let iv = '2624750004598718';
// console.log('加密的iv:', iv);
// let data = "Hello, nodejs. 演示aes-128-cbc加密和解密";
// console.log("需要加密的数据:", data);
// let crypted = encrypt(key, iv, data);
// console.log("数据加密后:", crypted);
// let dec = decrypt(key, iv, crypted);
// console.log("数据解密后:", dec);