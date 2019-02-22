var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
var qiniu = require('qiniu')

if (!port) {
    console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
    process.exit(1)
}

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true)
    var path = request.url
    var query = ''
    if (path.indexOf('?') >= 0) {
        query = path.substring(path.indexOf('?'))
    }
    var pathNoQuery = parsedUrl.pathname
    var queryObject = parsedUrl.query
    var method = request.method

    /******** 从这里开始看，上面不要看 ************/
    if (path == '/uptoken') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/json;charset=utf-8')
        response.setHeader('Access-Control-Allow-Origin', '*')

        let {accessKey, secretKey} = JSON.parse(fs.readFileSync("./qiniu-key.json"))
        
        var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        
        console.log(mac)
        var options = {
            scope: '163music01',
          };
          var putPolicy = new qiniu.rs.PutPolicy(options);
          var uploadToken=putPolicy.uploadToken(mac);

        response.write(`
            {
                "uptoken":"${uploadToken}"
            }
        `)
        response.end()
    } else {
        response.statusCode = 404
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.end()
    }
    /******** 代码结束，下面不要看 ************/

})

server.listen(port)
console.log('服务已启动\n打开 http://127.0.0.1:'+port+'/')