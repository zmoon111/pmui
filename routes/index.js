var express = require('express');
var _ = require('./util.js');
var router = express.Router();

function list(root){
    var urls = [];
    _.find(root, function(path, full){
        if(path !== 'node_modules'){
            var host = 'http://' + path.replace(/-(?=\d+$)/g, ':');
            _.find(full, function(p, full){
                var pathname = new Buffer(p, 'base64');
                urls.push({
                    url: host + pathname.toString(),
                    path: path + '/' + p,
                    full: full
                });
            });
        }
    });
    return urls;
}

/* GET home page. */
router.get('/', function (req, res) {
    var root = req.app.get('page monitor root');
    res.render('index', { title: 'Page Monitor', list: list(root) });
});

module.exports = router;
