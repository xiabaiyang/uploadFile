var express = require('express');
var multer  = require('multer');
var fs = require("fs");
var path = require('path');
var mime = require('mime');

var router = express.Router();

var upload = multer({ dest: '/tmp/' });

/* 
 主页
 */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* 
 文件操作页面
 */
router.get('/upload', function(req, res, next) {
    res.render('upload');
});

/* 
 获取文件地址
 */
router.get('/getAllImages', function(req, res, next) {
    var files = fs.readdirSync('./files');
    var filePaths = [];
    files.forEach(function(file) {
        filePaths.push('http://127.0.0.1:3000/files/' + file);
    });
    var response = {
        msg: 'success',
        filePaths: filePaths
    };
    res.json(response);
});

/* 
 文件下载
 */
router.get('/download/', function(req, res, next) {
    var fileName = req.query.fileName;
    var dir = '/Users/xby/weixin/fileUploader/picUploader/files/';
    var filePath = path.join(dir, fileName);

    fs.exists(filePath, function(exists) {
        if(!exists) {
            res.json({'success':false,'msg':'文件不存在！'});
        }
        else {
            console.log('loading.............');
            res.download(filePath, function(err){
                if(err) {
                    res.json({'success':false,'msg':err});
                }
            });
            
            // var basename = path.basename(filePath);
            // var mimetype = mime.lookup(filePath);

            // res.setHeader('Content-disposition', 'attachment; filename=' + basename);
            // res.setHeader('Content-type', mimetype);

            // var filestream = fs.createReadStream(filePath);
            // filestream.pipe(res);
        }
    }); 
});

/* 
 文件上传
 */
router.post('/file_upload', upload.array('image'), function(req, res, next) {

    console.log(req.body.picName[0]);  // 上传的文件名
    console.log(req.files[0]);  // 上传的文件信息

    if(undefined == req.files[0]){
        res.json(['failed', {msg:"没有选择要上传的文件！"}]);
        return -1;
    }

    var des_file = "./files/" + req.files[0].originalname;
    fs.readFile(req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            if( err ){
                console.log( err );
                res.json(['failed', {msg:err}]);
            }else{
                var response = {
                    msg: 'success', 
                    filename: req.files[0].originalname,
                };
                // console.log( response );
                res.json(['success', response]);
            }
        });
    });
});

module.exports = router;
