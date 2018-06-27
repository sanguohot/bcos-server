let fcode = require("./code");
function getDataForCns(contractName, contractVersion, contractFunction, contractParams) {
    return {
        "jsonrpc":"2.0",
        "method":"eth_call",
        "params":[{"data":{"contract":contractName,"version":contractVersion,"func":contractFunction,"params":contractParams}},"latest"],
        "id":1
    }
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

exports.getDataForCns = getDataForCns;
exports.resUtilError = resUtilError;
exports.isValidAddress = isValidAddress;