var gprop = require('../etc/config').prop;
var log4js = require('log4js');
var filename= __filename.split(gprop.file_split).pop();
var LOG_CONTENT_LEN=384;
const LOG_PATH = gprop.server_path+gprop.log_path
log4js.configure({
  appenders: [
    {
      type: 'console'
    },
    {
      type: "file",
      filename: LOG_PATH+'/restart.log',
      maxLogSize: 10*1024*1024,
      backups:3,
      category: 'restart'
    }
    ,
    {
      type: "file",
      filename: LOG_PATH+'/mysql.log',
      maxLogSize: 10*1024*1024,
      backups:3,
      category: 'mysql'
    }
    ,
    {
      type: "file",
      filename: LOG_PATH+'/cpu.log',
      maxLogSize: 10*1024*1024,
      backups:3,
      category: 'cpu'
    }
    ,
    {
      type: "file",
      filename: LOG_PATH+'/access.log',
      maxLogSize: 10*1024*1024,
      backups:3,
      category: 'access'
    }
    ,
    {
      type: "file",
      filename: LOG_PATH+'/error.log',
      maxLogSize: 10*1024*1024,
      backups:3,
      category: 'error'
    }
    ,
    {
      type: "file",
      filename: LOG_PATH+'/bcos.log',
      maxLogSize: 10*1024*1024,
      backups:3,
      category: 'bcos'
    }
  ],
  "levels": {
    "[all]": gprop.log_level
  },
  replaceConsole: true
});

exports.use = function(app) {
  var access_log=log4js.getLogger("access");
  access_log.setLevel("debug");
  app.use(log4js.connectLogger(access_log, { level: 'auto', format:  ':method :url :status :response-time ms :remote-addr'}));
}
function  do_log(name,level,filename,__line,content){
  //错误日志单独输出
  if(level=="error" && name!=level){
    name=level;
  }
  var logger=log4js.getLogger(name);
  if(!logger[level]){
    return;
  }
  if(!content){
    return;
  }
  var json="";
  if( content instanceof Array ){
		json=JSON.stringify(content);
	}else if( content instanceof Object ){
	  json=content.stack||content.message||JSON.stringify(content);
  }else{
		json=""+content;
  }
  if(json.length>=LOG_CONTENT_LEN){
    json=json.substring(0,LOG_CONTENT_LEN)+"······"
  }
  // console.log(json)
  var logger_filter=global.logger_filter || gprop.logger_filter;
  var log_content=__line?(filename+" line_"+__line+" "+json):(filename+" "+json);
  if(logger_filter){
    var reg = new RegExp(logger_filter, 'i');
    if(json.match(reg)){
      return logger[level](log_content);
    }else{
      return;
    }
  }
  logger[level](log_content);
}
exports.do_log=do_log;
exports.log_name="bcos";

//do_log("mysql","error","mysql.js","","hello 好DA00-0040-C900-0221");