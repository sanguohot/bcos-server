exports.prop = {
    "web_port": 443,
    "https":true,
    "https_path":"/etc/letsencrypt/live/sanguohot.tk",
    "key":"privkey.pem",
    "cert":"fullchain.pem",
    "ca":"chain.pem",
    "server_path":'/opt/vultr',//***项目路径，windows linux有分别
    "file_split":"/",//***windows linux有分别
    "log_path":'/src/backend/log',//***log4js日志路径，windows linux有分别
    "download_path":'/downloads',//***log4js日志路径，windows linux有分别
    "log_level":"info",//***log4js日志级别，正式环境和测试环境有分别
    "codeline":false//日志打印时，是否显示代码行数开关
};