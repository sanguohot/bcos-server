const os = require("os");
const gprop = require('../etc/'+(os.platform()=="linux"?"config-linux":"config")).prop;
let Minio = require('minio');
let async = require('async');
let DEFAULT_BUCKET = "finchain";

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
    if(!bucket){
        bucket = DEFAULT_BUCKET;
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

exports.saveToMinio = saveToMinio;