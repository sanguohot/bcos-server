const os = require("os");
const gprop = require('../etc/'+(os.platform()=="linux"?"config-linux":"config")).prop;
let fs = require('fs');
const iconv = require('iconv-lite');

let request = require('request');

let options = {
    url: 'http://localhost:2443/api/v1/files/b730bee675c9bc3700ca038161ca9aec2489df4683d08831ef4a2be1cc24ccbe?sign=a8f8af5a22ce88ec9c81c7e8bd456eb89d0227795687a3cad674203147e3271b2b8c72c93729fddb5e4f08c4614de64d2252e44b240e5faf5b6562f9c6ad904d',
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
        console.log(body)
    }
}

request(options, callback);
process.on('uncaughtException', (err) => {
    console.error(`Caught exception: ${err}\n`);
});