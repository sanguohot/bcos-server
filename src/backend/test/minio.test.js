const os = require("os");
const gprop = require('../etc/'+(os.platform()=="linux"?"config-linux":"config")).prop;
let Minio = require('minio');
let async = require('async');
let bucket = "finchain";
let minioClient = new Minio.Client({
    endPoint: gprop.minio_endpoint,
    port: gprop.minio_port,
    secure: gprop.minio_secure,
    accessKey: gprop.minio_access_key,
    secretKey: gprop.minio_secret_key
});

function saveToMinio(bucket, key, value, cb) {
    if(!key || !value){
        return cb("参数错误");
    }
    async.waterfall([
        function(cb) {
            minioClient.bucketExists(bucket, cb);
        },
        function(isExist, cb) {
            if(isExist){
                return cb();
            }
            minioClient.makeBucket(bucket, 'us-east-1', cb);
        },
        function(cb) {
            minioClient.putObject(bucket, key, value, cb);
        }
    ], function (err, result) {
        // result now equals 'done'
        if(err){
            console.error("保存到minio错误", err.message || err);
            return cb(err);
        }
        console.log("保存到minio成功", result);
        cb(0);
    });
}

let key = "0x4cf315d678780da3c19db200f9a4acb33f7decc9";
let value = {
    // 备份不会修改的数据
    "idCartNo":"",
    // 备份链上和ipfs上不存在的数据
    "prikey":"QgBw8LGL27XrZoeZtj0bB8Od6SYLTjO/trjDV8UdW3/CxPKZfleyuaYXiSpygNhRm7Q7clKodPTOkIq4qx2sDFE94oESUd+yQO9IMQmV4xuVSSAALki1S6W+ssR805MogloDSyUw8n1+aB1Zgyh2tAAlw2LIrhPIZPD9zNKe86jGqU/HGqptmcsmELtpfTUBMB7Us57yWShfRlqzrI0YmS5h5aQDBktuQzM2wmiJQtZp9yddXfESO0VQACVFgQyZSYDDfwVWVm34A40z6x6ovC2SOjBJfv4QiFDycgdSWCD0mABoa2aaZBvyHgT1PH9YHtw3Av4fLPanPKxqOWiFfB6gP0LKPp6+iVJEqKtKuhBr3StvqTcPntUq3BbNoS5MgFUYrwjKUfdGFqrKwQ0FZQQtp0DEWoVmSG8tGaQBZjsv0Xe+s9vaH2DQXen+ypV8e6fCtSs5oOVhUUQmzoQEvg=="
};
value = JSON.stringify(value);
saveToMinio(ACCOUNT_BUCKET, key, value, function (err) {

})

var stream = minioClient.listObjects(ACCOUNT_BUCKET,'0x', true)
stream.on('data', function(obj) { console.log(obj) } )
stream.on('error', function(err) { console.log(err) } )
