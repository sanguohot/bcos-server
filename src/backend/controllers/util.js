let fcode = require("./code");
// let web3Utils = require('web3/lib/utils/utils');
let web3Coder = require('web3/lib/solidity/coder');
function getDataForCns(userId, contractName, contractVersion, contractFunction, contractParams) {
    return {
        "jsonrpc":"2.0",
        "method":"eth_call",
        "params":[
            {
                "data":{"contract":contractName,"version":contractVersion,"func":contractFunction,"params":contractParams},
                "from" : userId
            },
            "latest"
        ],
        "id":74
    }
}
function getInvokeMethod(params, obj) {
    if(!obj && !params){
        return "";
    }
    if(!obj){
        obj = params[0].data;
    }

    return obj.contract+":"+obj.version+"."+obj.func;
}

function getInvokeParams(params, obj) {
    if(!obj && !params){
        return "";
    }
    if(!obj){
        obj = params[0].data;
    }

    return obj.params;
}
function isValidAddress(address) {
    if(!address || address.length!=42){
        return false;
    }
    if(address.indexOf("0x")<0){
        return false;
    }
    return true;
}

function resUtilError(res, msg) {
    res.status(200).json({
        code : fcode.CODE_ERR_PARAM.code,
        message : msg || fcode.CODE_ERR_PARAM.message
    });
}
function isVailidSign(sign, cb) {
    if(!sign){
        return cb("缺少签名参数");
    }
    if(sign.length != 128){
        return cb("签名长度错误");
    }
    cb();
}
// 注意如果是发送往bcos的字节数组，需要用utf8编码
function stringToBytes32Array(str, len, encoding) {
    if(!len || isNaN(len)){
        return null;
    }
    if(!encoding){
        encoding = "utf8";
    }
    let strBuf = Buffer.from(str, encoding);
    len = parseInt(len);
    if(strBuf.length > 32*len){
        return null;
    }
    if(len == 1){
        return strBuf.toString(encoding);
        // return web3Coder.encodeParam('bytes32', str);
    }
    // console.log(strBuf,strBuf.length);
    let bytes32Array = [];
    for(let i=0; i<len; i++){
        let newBuf = strBuf.slice(i*32, i*32+32);
        // console.log(newBuf,newBuf.length);
        if(newBuf.length == 0){
            bytes32Array.push(new Buffer(1).toString());
            // bytes32Array.push(web3Coder.encodeParam('bytes32', ""));
        }else {
            bytes32Array.push(newBuf.toString(encoding));
            // bytes32Array.push(web3Coder.encodeParam('bytes32', newBuf.toString(encoding)));
        }
    }
    return bytes32Array;
}

function bytes32ArrayToString(bytes32Array, encoding) {
    if(!bytes32Array || !bytes32Array.length){
        return null;
    }
    if(!encoding){
        encoding = "utf8";
    }
    if(bytes32Array instanceof Array){
        let bufArray = [];
        bytes32Array.forEach((value, index, array) => {
            let newValue = value.replace(/\0/g, '');
            if(newValue){
                let newBuffer = Buffer.from(newValue, encoding);
                // console.log(newBuffer,newBuffer.length)
                if(newBuffer.length){
                    bufArray.push(newBuffer);
                }
            }
        });
        return Buffer.concat(bufArray).toString(encoding);
    }else if(typeof bytes32Array === "string"){
        let newValue = bytes32Array.replace(/\0/g, '');
        if(newValue){
            let newBuffer = Buffer.from(newValue, encoding);
            return  newBuffer.toString(encoding);
        }
        return null;
    }
    return null;
}

exports.getDataForCns = getDataForCns;
exports.resUtilError = resUtilError;
exports.isValidAddress = isValidAddress;
exports.isVailidSign = isVailidSign;
exports.getInvokeMethod = getInvokeMethod;
exports.getInvokeParams = getInvokeParams;
exports.stringToBytes32Array = stringToBytes32Array;
exports.bytes32ArrayToString = bytes32ArrayToString;

// let bytes32Array = stringToBytes32Array("",8);
// console.log(bytes32Array);
// console.log(bytes32ArrayToString(bytes32Array));
// let bytes32Array = stringToBytes32Array("03717d73594edb257d98dce101d39ce5f393b0fe1e40515a8159425d297c2f7f",2, "utf8");
// 03717d73594edb257d98dce101d39ce5f393b0fe1e40515a8159425d297c2f7f
// 03717d73594edb257d98dce101d39ce5f393b0fe1e40515a8159425d297c2f7f
// 03717d73594edb257d98dce101d39ce5f393b0fe1e40515a8159425d297c2f7f
// console.log(bytes32Array);
// console.log(bytes32ArrayToString(bytes32Array, "hex"));
// console.log("0x03717d73594edb257d98dce101d39c".length);