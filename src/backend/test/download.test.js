const os = require("os");
const gprop = require('../etc/'+(os.platform()=="linux"?"config-linux":"config")).prop;
let fs = require('fs');
const iconv = require('iconv-lite');

let request = require('request');

let options = {
    url: 'http://localhost:2443/api/v1/files/75a752d86ca406585a851bce4ec751fe7b3bc411d147122bfcd6f4cf83968599?sign=38070470577aedd7051cecb739a036274bc8a35317a04f0634fc043846d7b7b95a78dd9fb2db554111f4428c01729408558df2f9f7c1c40c3eaaee95b76a9ece',
    headers: {
        'address': '0xb1e14a95d3d5cfabad15c4bfe0194c8415b8eaba'
    },
    // 非常关键，表示不要对响应做任何的转换
    encoding: null
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        // let info = JSON.parse(body);
        // console.log(info.stargazers_count + " Stars");
        // console.log(info.forks_count + " Forks");
        let buf = Buffer.from(body, "binary");
        let decode = iconv.decode(buf, "gbk");
        console.log(body.length, buf.length, decode.length)
        console.log(decode)
    }
}

request(options, callback);
process.on('uncaughtException', (err) => {
    console.error(`Caught exception: ${err}\n`);
});