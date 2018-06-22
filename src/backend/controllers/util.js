let fcode = require("./code");
function getDataForCns(contractName, contractVersion, contractFunction, contractParams) {
    return {
        "jsonrpc":"2.0",
        "method":"eth_call",
        "params":[{"data":{"contract":contractName,"version":contractVersion,"func":contractFunction,"params":contractParams}},"latest"],
        "id":1
    }
}

function resUtilError(res, msg) {
    res.status(fcode.CODE_ERR_PARAM.code).json({
        code : fcode.CODE_ERR_PARAM.code,
        message : msg || fcode.CODE_ERR_PARAM.message
    });
}
exports.getDataForCns = getDataForCns;
exports.resUtilError = resUtilError;