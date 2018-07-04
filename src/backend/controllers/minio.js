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

function getInMinio(bucket, key, cb) {
    if(!key){
        return cb("参数错误");
    }
    if(!bucket){
        bucket = DEFAULT_BUCKET;
    }
    async.waterfall([
        function(cb) {
            minioClient.getObject(bucket, key, function(err, dataStream) {
                if (err) {
                    return cb(err);
                }
                let body = "";
                let size = 0;
                dataStream.on('data', function(chunk) {
                    body += chunk;
                    size += chunk.length;
                })
                dataStream.on('end', function() {
                    console.log('End. Total size = ' + size);
                    console.info(key, "===>", typeof body, body);
                    return cb(0, body);
                })
                dataStream.on('error', function(err) {
                    return cb(err);
                })
            })
        },
        function(body, cb) {
            if(!body){
                return cb("minio找不到账户"+key);
            }
            let obj = JSON.parse(body);
            if(!obj || !obj.prikey){
                return cb("minio账户信息非法"+key);
            }
            cb(0, obj);
        }
    ], function (err, result) {
        // result now equals 'done'
        if(err){
            return cb(err);
        }
        cb(0, result);
    });
}
exports.saveToMinio = saveToMinio;
exports.getInMinio = getInMinio;

// getInMinio(null, "account-0x4fffee7ca7da3b4195c60e290864943fa0556c04", function () {
//
// })