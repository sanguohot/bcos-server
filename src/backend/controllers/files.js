const os = require("os");
const gprop = require('../etc/'+(os.platform()=="linux"?"config-linux":"config")).prop;
let multer = require("multer");
let stream = require("stream");
let async = require("async");
let wallet = require("./wallet");
let fileType = require('file-type');
let storage = multer.memoryStorage();
let fcode = require("./code");
let util = require("./util");
let files_bc = require("./files_bc");
let files_ipfs = require("./files_ipfs");
const jschardet = require("jschardet");
const MAX_SIGN_SIZE = 3;

let upload = multer({
    storage: storage,
    limits: {
        fields: 5,
        files: 1,
        fileSize : 5 * 1024 * 1024
    }
}).single("file");

function uploadFiles(req, res) {
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            return util.resUtilError(res, err.message || err);
        }
        if(!req.file || !req.file.size || !req.file.buffer || !req.file.buffer.length){
            return util.resUtilError(res, "未发现文件");
        }
        console.log(req.file,req.body);
        if(req.body.desc && req.body.desc.length>127){
            return util.resUtilError(res, "描述字段过长");
        }
        // Everything went fine
        let fileHashBuffer = wallet.rlphash(req.file.buffer);
        let fileHashHex = fileHashBuffer.toString("hex");
        console.log(fileHashHex,fileHashHex.length);
        let sign = req.body.sign || req.query.sign;
        async.waterfall([
            function(cb) {
                util.isVailidSign(sign, cb);
            },
            function(cb) {
                let isOk = wallet.verifyRlpHashBuffer(fileHashBuffer, sign, req.headers.pubkey);
                if(!isOk){
                    return cb("签名校验失败");
                }
                cb();
            },
            function(cb) {
                files_ipfs.addFileToIpfs(req.file, cb);
            },
            function(ipfsHash, cb) {
                files_bc.addFileToBlockChain(req.headers.address, sign, fileHashHex, ipfsHash, req.file.size, req.body.desc, cb);
            }
        ], function (err, result) {
            // result now equals 'done'
            if(err){
                return util.resUtilError(res, err.message || err);
            }
            let ret = {};
            ret.fileHash = fileHashHex;
            ret.code = 0;
            ret.message = fcode.CODE_SUCC.message;
            res.json(ret);
        });
    })
}

function downloadFile(req, res) {
    console.info(req.params,req.query);
    let sign = req.body.sign || req.query.sign;
    // 可能是异步的 考虑async
    let isOk = wallet.verify(req.params.fileHash, sign, req.headers.pubkey);
    if(!isOk){
        return util.resUtilError(res, "签名校验失败");
    }
    async.waterfall([
        function(cb) {
            files_bc.getFileBasicFromBlockChain(req.params.fileHash, cb);
        },
        function(fileObj, cb) {
            files_ipfs.getFileFromIpfs(fileObj.filePath, cb);
        }
    ], function (err, fileContent) {
        // result now equals 'done'
        if(err){
            return util.resUtilError(res, err.message || err);
        }
        let encoding =jschardet.detect(fileContent).encoding;
        console.log("数据编码", encoding);
        console.log("数据长度", fileContent.length);
        let fileBuffer = Buffer.from(fileContent, "binary");
        let charset = encoding;
        let type = fileType(fileBuffer);
        console.info(req.params.fileHash, "文件类型为", type);
        let fileName = req.params.fileHash;
        // let contentType = "text/plain";
        // 默认设置为二进制流
        let contentType = "application/octet-stream";
        if(type){
            if(type.ext){
                fileName = req.params.fileHash+"."+type.ext;
            }
            // 也许是已知的格式，比如说图片
            if(type.mime){
                contentType = type.mime;
            }
        }

        let readStream = new stream.PassThrough();
        readStream.end(fileBuffer);
        res.set('Content-disposition', 'attachment; filename=' + fileName);
        res.set('Content-Type', contentType+";Charset="+charset);
        res.set('Content-Length', fileBuffer.length);
        readStream.pipe(res);
    });
}

function addSign(req, res) {
    console.info(req.params,req.body);
    let sign = req.body.sign || req.query.sign;

    let isOk = wallet.verify(req.params.fileHash, sign, req.headers.pubkey);
    if(!isOk){
        return util.resUtilError(res, "签名校验失败");
    }

    if(req.headers.fileSignSize<=0 || req.headers.fileSignSize>=MAX_SIGN_SIZE){
        return util.resUtilError(res);
    }
    // 发送签名上链
    files_bc.addSignToBlockChain(req.params.fileHash, req.headers.address, sign, (err) => {
        if(err){
            return util.resUtilError(res, err.message || err);
        }
        let ret = {};
        ret.code = 0;
        ret.message = fcode.CODE_SUCC.message;
        res.json(ret);
    });
}

function getSignList(req, res) {
    console.info(req.params,req.query);
    let sign = req.body.sign || req.query.sign;
    let isOk = wallet.verify(req.params.fileHash, sign, req.headers.pubkey);
    if(!isOk){
        return util.resUtilError(res, "签名校验失败");
    }
    async.waterfall([
        function(cb) {
            files_bc.isAccountAddressExistOnBlockChain(req.params.fileHash, req.headers.address, cb);
        },
        function (isExist, cb) {
            if(!isExist){
                console.warn("非文件所有者签名者访问签名列表", req.headers.address, "===>", req.params.fileHash);
                // 这里因为业务有需求先放开限制
                // return cb("非文件所有者或者签名者无法访问");
            }
            // 这里从区块链上循环获取签名地址，最大循环数量为req.headers.fileSignSize
            files_bc.getFileSignerAddressListFromBlockChain(req.params.fileHash, req.headers.fileSignSize, (err, list) => {
                if(err){
                    return util.resUtilError(res, err.message || err);
                }
                cb(0, list);
            })
        }
    ], function (err, list) {
        // result now equals 'done'
        if(err){
            return util.resUtilError(res, err.message || err);
        }
        let ret = {};
        ret.signers = list;
        ret.code = 0;
        ret.message = fcode.CODE_SUCC.message;
        res.json(ret);
    });
}

exports.uploadFiles = uploadFiles;
exports.downloadFile = downloadFile;
exports.addSign = addSign;
exports.getSignList = getSignList;