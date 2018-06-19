/**
 * Created by evan on 2016/06/01.
 */
const gprop = require('../etc/config').prop;
const http = require('http');
const https = require('https');
const fs = require("fs");
function start(){
    var port=gprop.web_port;
    var app=require('../app/app');
    app.set('port', port);
    var server = null;
    if(gprop.https){
        var options = {
            key: fs.readFileSync(gprop.https_path+"/"+gprop.key),
            cert: fs.readFileSync(gprop.https_path+"/"+gprop.cert),
            ca: [fs.readFileSync(gprop.https_path+"/"+gprop.ca)]
        };
        server=https.createServer(options,app);
    }else{
        server=http.createServer(app);
    }
    server.listen(port);
    server.on('error', function(err){
        onError(err,port);
    });
    server.on('listening', function(){
        onListening(server,"http");
    });

    /**
     * Event listener for HTTP server "error" event.
     */

    function onError(error,port) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening(server,type) {
        var addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        console.log('['+type+'] '+'listening on ' + bind);
    }
}
module.exports=start;
start();

process.on('uncaughtException', (err) => {
    console.error(`Caught exception: ${err}\n`);
});