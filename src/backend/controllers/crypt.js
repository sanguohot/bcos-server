var gprop = require('../etc/config').prop;
if(typeof __line=="undefined" && gprop.codeline){
    require('magic-globals');
}else{
    __line="";
}
var filename= __filename.split(gprop.file_split).pop();
flog=require("./log");

var assert = require('assert');
var crypto = require('crypto');

function encrypt(param) {
  var key = new Buffer(param.key);
  var iv = new Buffer(param.iv ? param.iv : 0)
  var plaintext = param.plaintext
  var alg = param.alg
  var autoPad = param.autoPad

  //encrypt
  var cipher = crypto.createCipheriv(alg, key, iv);
  cipher.setAutoPadding(autoPad)  //default true
  var ciph = cipher.update(plaintext, 'utf8', 'hex');
  ciph += cipher.final('hex');
  console.log(alg, ciph);
  return ciph;
}
function decrypt(param) {
  var key = new Buffer(param.key);
  var iv = new Buffer(param.iv ? param.iv : 0)
  var plaintext = param.plaintext
  var alg = param.alg
  var autoPad = param.autoPad

  //decrypt
  var decipher = crypto.createDecipheriv(alg, key, iv);
  cipher.setAutoPadding(autoPad)
  var txt = decipher.update(ciph, 'hex', 'utf8');
  txt += decipher.final('utf8');
  assert.equal(txt, plaintext, 'fail');
  return txt;
}
function encrypt_3des_ecb(content){
  return encrypt({
    alg: 'des-ede3',    //3des-ecb
    autoPad: true,
    key: '0123456789abcd0123456789',
    plaintext:content,
    iv: null
  })
}
function encrypt_3des_cbc(content){
  return encrypt({
    alg: 'des-ede3-cbc',    //3des-cbc
    autoPad: true,
    key: '0123456789abcd0123456789',
    plaintext:content,
    iv: '12345678'
  })
}
function encrypt_des_ecb(content){
  return encrypt({
    alg: 'des-ecb',
    autoPad: true,
    key: '01234567',
    plaintext:content,
    iv: null
  })
}
function encrypt_des_cbc(content){
  return encrypt({
    alg: 'des-cbc',
    autoPad: true,
    key: '01234567',
    plaintext:content,
    iv: '12345678'
  })
}
function md5_digest(content){
  var md5 = crypto.createHash('md5');
  md5.update(new Buffer(content,"utf8"));
  var ret=md5.digest('base64');
    flog.do_log(flog.log_name,"debug",filename,__line," md5摘要:"+ret);
  return ret;
}
module.exports={
  encrypt_3des_ecb:encrypt_3des_ecb,
  encrypt_3des_cbc:encrypt_3des_cbc,
  encrypt_des_ecb:encrypt_des_ecb,
  encrypt_des_cbc:encrypt_des_cbc,
  md5_digest:md5_digest
}
encrypt_3des_cbc("dinstar09");
console.log(md5_digest("dinstar123"))
//encrypt_3des_cbc("CTNEX");
//md5_digest("rishi.india");
//md5_digest("likit.telekom");
//md5_digest("uccc2016");
//md5_digest("Support@Dinstar");
//AoswU7k7i3V+xjuAzX/sNA==
console.log("d3f6db66f2ab828f028b96ecf698741d".length)