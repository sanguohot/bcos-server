exports.prop = {
	"web_port": 443,
	"https":true,
    "https_path":"e:/evan/nodejs/bcos-server/src/backend/key",
	"key":"privkey.pem",
    "cert":"fullchain.pem",
    "ca":"chain.pem",
	"server_path":'E:/evan/nodejs/bcos-server',//***项目路径，windows linux有分别
	"file_split":"/",//***windows linux有分别
	"log_path":'/src/backend/log',//***log4js日志路径，windows linux有分别
	"log_level":"info",//***log4js日志级别，正式环境和测试环境有分别
	"codeline":true//日志打印时，是否显示代码行数开关
};