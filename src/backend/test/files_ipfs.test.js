let ipfsAPI = require('ipfs-api');
let crypto = require('../controllers/crypto');
// connect to ipfs daemon API server
let ipfs = ipfsAPI('10.6.250.50', '5001', {protocol: 'http'});
let fileName = "sanguohot.txt";
let content = "这是我的字号-恒奕!";
let encryptContent = Buffer.from(crypto.encryptByVersion(content));
console.log(encryptContent)
// ipfs.files.mkdir(fileDir, {parents : true}, (err) => {
//     if (err) {
//         return console.error(err);
//     }
//     console.log("创建目录成功", fileDir);
//     ipfs.files.write(fileDir+fileName, content, {create:true}, (err) => {
//         if (err) {
//             return console.error(err);
//         }
//         console.log("创建文件成功", fileDir+fileName);
//     })
// })
// 为每一个路径和文件单独生成hash，可以通过hash和每一个文件单独访问
if(fileName.indexOf("/")>=0){
    return console.error(fileName);
}
ipfs.files.add({
    path : fileName,
    content:encryptContent
}, (err, files) => {
    if (err) {
        return console.error(err);
    }
    console.log(files);
    if(!files || files.length!=1 || !files[0] || !files[0].hash){
        return console.error(files);
    }
    ipfs.files.get(files[0].hash, (err, files) => {
        if (err) {
            return console.error(err)
        }
        console.log(files);
        if(!files || files.length!=1 || !files[0] || !files[0].content){
            return console.error(files);
        }
        let encryptContent = files[0].content.toString();
        let decryptContent = crypto.decryptByVersion(encryptContent);
        console.log(encryptContent);
        console.log(decryptContent);
    });
});


process.on('uncaughtException', (err) => {
    console.error(`Caught exception: ${err}\n`);
});