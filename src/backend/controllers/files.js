let multer = require("multer");
let wallet = require("./wallet");
let storage = multer.memoryStorage();
let fcode = require("./code");

let upload = multer({
    storage: storage,
    limits: {
        fields: 5,
        files: 1,
        fileSize : 1024
    }
}).single("file");

function uploadFiles(req, res) {
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            return res.status(fcode.CODE_ERR_PARAM.code).json({
                code : fcode.CODE_ERR_PARAM.code,
                message : fcode.CODE_ERR_PARAM.message
            });
        }
        if(!req.file || !req.file.size || !req.file.buffer || !req.file.buffer.length){
            return res.status(fcode.CODE_ERR_PARAM.code).json({
                code : fcode.CODE_ERR_PARAM.code,
                message : fcode.CODE_ERR_PARAM.message
            });
        }
        console.log(req.file,req.body);
        if(!req.body || !req.body.sign){
            return res.status(fcode.CODE_ERR_PARAM.code).json({
                code : fcode.CODE_ERR_PARAM.code,
                message : fcode.CODE_ERR_PARAM.message
            });
        }
        // Everything went fine
        let fileHash = wallet.rlphash(req.file.buffer).toString("hex");
        console.log(fileHash,fileHash.length);
        let ret = {};
        ret.fileHash = fileHash;
        ret.code = 0;
        ret.message = fcode.CODE_SUCC.message;
        res.json(ret);
    })
}

function downloadFile(req, res) {
    console.info(req.params,req.query);
    if(!req.params || !req.params.fileHash){
        return res.status(fcode.CODE_ERR_PARAM.code).json({
            code : fcode.CODE_ERR_PARAM.code,
            message : fcode.CODE_ERR_PARAM.message
        });
    }
    if(!req.query || !req.query.sign){
        return res.status(fcode.CODE_ERR_PARAM.code).json({
            code : fcode.CODE_ERR_PARAM.code,
            message : fcode.CODE_ERR_PARAM.message
        });
    }
    res.download("e:/evan/test.txt");
}

function addSign(req, res) {
    console.info(req.params,req.body);
    if(!req.params || !req.params.fileHash){
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

function getSignList(req, res) {
    console.info(req.params,req.query);
    if(!req.params || !req.params.fileHash){
        return res.status(fcode.CODE_ERR_PARAM.code).json({
            code : fcode.CODE_ERR_PARAM.code,
            message : fcode.CODE_ERR_PARAM.message
        });
    }
    if(!req.query || !req.query.sign){
        return res.status(fcode.CODE_ERR_PARAM.code).json({
            code : fcode.CODE_ERR_PARAM.code,
            message : fcode.CODE_ERR_PARAM.message
        });
    }
    let ret = {};
    ret.signers = ["0x313986f44fe1c0cef4e501d8453a3719394b0798","0x9644e0a0e15fe923f8bbe9c483d3eab3e8f3f6ca"];
    ret.code = 0;
    ret.message = fcode.CODE_SUCC.message;
    res.json(ret);
}
exports.uploadFiles = uploadFiles;
exports.downloadFile = downloadFile;
exports.addSign = addSign;
exports.getSignList = getSignList;