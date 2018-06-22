const gprop = require('../etc/config').prop;
let multer = require("multer");
let stream = require("stream");
let async = require("async");
let wallet = require("./wallet");
let storage = multer.memoryStorage();
let fcode = require("./code");
let util = require("./util");
let files_bc = require("./files_bc");
let files_ipfs = require("./files_ipfs");
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
            return util.resUtilError(res, "请求中未发现文件");
        }
        if(!req.file || !req.file.size || !req.file.buffer || !req.file.buffer.length){
            return util.resUtilError(res, "请求中未发现文件");
        }
        console.log(req.file,req.body);
        if(!req.body || !req.body.sign){
            return util.resUtilError(res);
        }
        // Everything went fine
        let fileHashBuffer = wallet.rlphash(req.file.buffer);
        let fileHashHex = fileHashBuffer.toString("hex");
        console.log(fileHashHex,fileHashHex.length);
        // 可能是异步的 考虑async
        let isOk = wallet.verifyBuffer(fileHashBuffer, req.body.sign, req.headers.pubkey);
        if(!isOk){
            return util.resUtilError(res,"签名校验失败");
        }
        // 可能是异步的 考虑async

        async.waterfall([
            function(cb) {
                files_ipfs.addFileToIpfs(req.file, cb);
            },
            function(ipfsHash, cb) {
                files_bc.addFileToBlockChain(req.headers.address, req.body.sign, fileHashHex, ipfsHash, req.file.size, req.body.desc, cb);
            }
        ], function (err, result) {
            // result now equals 'done'
            if(err){
                return util.resUtilError(res, err || err.message);
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
    if(!req.query || !req.query.sign){
        return util.resUtilError(res, "参数错误");
    }
    // 可能是异步的 考虑async
    let isOk = wallet.verify(req.params.fileHash, req.query.sign, req.headers.pubkey);
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
            return util.resUtilError(res, err||err.message);
        }
        var fileBuffer = Buffer.from(fileContent);

        var readStream = new stream.PassThrough();
        readStream.end(fileBuffer);
        res.set('Content-disposition', 'attachment; filename=' + req.params.fileHash);
        res.set('Content-Type', 'text/plain');
        readStream.pipe(res);
    });
}

function addSign(req, res) {
    console.info(req.params,req.body);
    if(!req.body || !req.body.sign){
        return util.resUtilError(res);
    }

    let isOk = wallet.verify(req.params.fileHash, req.body.sign, req.headers.pubkey);
    if(!isOk){
        return util.resUtilError(res, "签名校验失败");
    }

    if(req.headers.fileSignSize<=0 || req.headers.fileSignSize>=MAX_SIGN_SIZE){
        return util.resUtilError(res);
    }
    // 发送签名上链
    files_bc.addSignToBlockChain(req.params.fileHash, req.headers.address, req.body.sign, (err) => {
        if(err){
            return util.resUtilError(res, err||err.message);
        }
        let ret = {};
        ret.code = 0;
        ret.message = fcode.CODE_SUCC.message;
        res.json(ret);
    });
}

function getSignList(req, res) {
    console.info(req.params,req.query);
    if(!req.query || !req.query.sign){
        return util.resUtilError(res, "参数错误");
    }
    let isOk = wallet.verify(req.params.fileHash, req.query.sign, req.headers.pubkey);
    if(!isOk){
        return util.resUtilError(res, "签名校验失败");
    }
    async.waterfall([
        function(cb) {
            files_bc.isAccountAddressExistOnBlockChain(req.params.fileHash, req.headers.address, cb);
        },
        function (isExist, cb) {
            if(!isExist){
                return cb("非文件所有者或者签名者无法访问");
            }
            // 这里从区块链上循环获取签名地址，最大循环数量为req.headers.fileSignSize
            files_bc.getFileSignerAddressListFromBlockChain(req.params.fileHash, req.headers.fileSignSize, (err, list) => {
                if(err){
                    return util.resUtilError(res, err||err.message);
                }
                cb(0, list);
            })
        }
    ], function (err, list) {
        // result now equals 'done'
        if(err){
            return util.resUtilError(res, err || err.message);
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