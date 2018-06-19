let fcode = require("./code");
function addUser(req, res) {
    console.info(req.body);
    if(!req.body || !req.body.idCartNo){
        return res.status(fcode.CODE_ERR_PARAM.code).json({
            code : fcode.CODE_ERR_PARAM.code,
            message : fcode.CODE_ERR_PARAM.message
        });
    }
    let ret = {};
    ret.code = 0;
    ret.message = fcode.CODE_SUCC.message;
    ret.pubkey = "02eefd14a6b15459e7abdb3644e41c113618ad0bb8d1ac4a5407f2815b9c8f17ed";
    ret.prikey = "2048913567dc9a04688429a01d56390edd7ae80c4beeb97cfc116c5f43bc7ec7";
    ret.address = "0x313986f44fe1c0cef4e501d8453a3719394b0798";
    res.json(ret);
}

function delUser(req, res) {
    console.info(req.params,req.body);
    if(!req.params || !req.params.accountAddress){
        return res.status(fcode.CODE_ERR_PARAM.code).json({
            code : fcode.CODE_ERR_PARAM.code,
            message : fcode.CODE_ERR_PARAM.message
        });
    }
    if(!req.body || !req.body.sign){
        return res.status(fcode.CODE_ERR_PARAM.code).json({
            code : fcode.CODE_ERR_PARAM.code,
            message : fcode.CODE_ERR_PARAM.message
        });
    }
    let ret = {};
    ret.code = 0;
    ret.message = fcode.CODE_SUCC.message;
    res.json(ret);
}

exports.addUser = addUser;
exports.delUser = delUser;