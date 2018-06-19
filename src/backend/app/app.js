/**
 * Created by Evan on 2016/7/22.
 */
let log = require('../controllers/log');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let routersApi = require('../routers/routers_api');
let express    = require('express');        // call express
let app        = express();
log.use(app);
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '5mb'}));
app.use(cookieParser());
app.use(function (req, res, next) {
    if (req.url.indexOf("/favicon.ico") >= 0) return res.end();
    res.setHeader("Access-Control-Allow-Origin", "*");
    //某些浏览器或者某些环境下，浏览器一直认为请求未结束，为避免误会我们直接设置连接关闭
    res.setHeader("Connection", "Close");
    // res.setHeader("X-Frame-Options", "SAMEORIGIN");
    next();
});

let router = express.Router();              // get an instance of the express Router
routersApi(router);
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api/v1', router);
app.all("/*",function (req,res,next) {
    res.status(404).send("Page not found.");
})
module.exports = app;