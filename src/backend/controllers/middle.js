let fcode = require("./code");
function addressCheck(req, res, next) {
    console.log(req.headers.address);
    if(!req.headers || !req.headers.address){
        return res.status(fcode.CODE_ERR_PARAM.code).json({
            code : fcode.CODE_ERR_PARAM.code,
            message : fcode.CODE_ERR_PARAM.message
        });
    }
    next();
}

exports.addressCheck = addressCheck;