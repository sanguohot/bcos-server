/**
 * Created by evan on 2016/06/01.
 */
const os = require("os");
const gprop = require('../etc/'+(os.platform()=="linux"?"config-linux":"config")).prop;
if(typeof __line=="undefined" && gprop.codeline){
    require('magic-globals');
}else{
    __line="";
}
const filename= __filename.split(gprop.file_split).pop();
const flog = require('../controllers/log');
const fs=require("fs");
let files = require('../controllers/files');
let middle = require('../controllers/middle');
let users = require('../controllers/users');
const SUCC_MESSAGE = "Success";
module.exports = function (router) {
    // test route to make sure everything is working (accessed at GET http://localhost:8080/api/v1)
    router.get('/', function(req, res) {
        res.json({ message: 'Welcome to our api!' });
    });
    // 上传文件
    router.post("/files", middle.signCheck, middle.addressCheck, files.uploadFiles);
    // 下载文件
    router.get("/files/:fileHash", middle.signCheck, middle.addressCheck, middle.fileHashCheck, files.downloadFile);
    // 签名列表
    router.get("/files/:fileHash/signers", middle.signCheck, middle.addressCheck, middle.fileHashCheck, files.getSignList);
    // 文件签名
    router.post("/files/:fileHash/signers", middle.signCheck, middle.addressCheck, middle.fileHashCheck, files.addSign);
    // 账号注册
    router.post("/accounts", users.addUser);
    // 账号删除
    router.delete("/accounts/:accountAddress", middle.signCheck, middle.addressCheck, users.delUser);
}