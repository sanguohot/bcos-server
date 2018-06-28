/**
 * @file: post.js
 * @author: fisco-dev
 * 
 * @date: 2018
 */

var Web3= require('web3');
var config=require('./config');

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider(config.HttpProvider));
}


var http = require('http');
let util = require('../controllers/util');


async function post(method,params) {
  
  return new Promise((resolve, reject) => {
       
      //curl -X POST --data '{"jsonrpc":"2.0","method":"admin_peers","params":[],"id":74}'  <ip:port> e.g.:127.0.0.1:8545
      var post_data = { 
         "jsonrpc":"2.0",
         "method":method,
         "params":params,
         "id":74
         };//这是需要提交的数据  
        
        
      var content = JSON.stringify(post_data);  
        
      var options = {  
          hostname: config.HttpProvider.replace("http:\/\/","").replace(/:\d+/,''),  
          port: config.HttpProvider.replace(/http:.*:/,''),  
          path: '',  
          method: 'POST',  
          headers: {  
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'  
          }  
      };
      console.info("发送请求", util.getInvokeMethod(params), "<===", util.getInvokeParams(params));
      var response="";
      var req = http.request(options, function (res) {  
          //console.log('STATUS: ' + res.statusCode);  
          //console.log('HEADERS: ' + JSON.stringify(res.headers));  

          res.setEncoding('utf8');  
          res.on('data', function (chunk) {  
              //console.log('BODY: ' + chunk);  
              response+=chunk;
          });  
          res.on('end', function (chunk) {
              console.info("请求完成", util.getInvokeMethod(params), "===>", response);
              let responseObj = JSON.parse(response);
              if(responseObj.error){
                  return reject(responseObj.error);
              }
              if(responseObj.result){
                  return resolve(JSON.parse(responseObj.result));
              }
              resolve(response);
          }); 
      });  
        
      req.on('error', function (e) {  
          console.error('请求错误', util.getInvokeMethod(params), "===>", e.message);
          reject(response);
      });  
        
      // write data to request body  
      req.write(content);  
        
      req.end();  
  });
}

exports.post=post;

