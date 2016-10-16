var express = require('express');
var multer  = require('multer');
var fs = require("fs");
var path = require('path');
var mime = require('mime');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Picture = mongoose.model('Picture'); // 注意最后的 s

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
    // var files = fs.readdirSync('./files');
    // var filePaths = [];
    // files.forEach(function(file) {
    //     filePaths.push('http://127.0.0.1:3000/files/' + file);
    // });
    // var response = {
    //     "status": 400,
    //     "msg": 'success',
    //     "filePaths": filePaths
    // };
    // res.json(response);

    var result = Picture.find({}).exec();
    result.then(function(pics) {
        var response = {
            "status": 200,
            "data": pics
        };
        res.json(response);
    });
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
            res.json({
                "status": 500,
                "success": false,
                "msg": '文件不存在'
            });
        }
        else {
            res.download(filePath, function(err){
                if(err) {
                    res.json({
                        "status": 500,
                        "success": false,
                        "msg": err
                    });
                }
            });
        }
    }); 
});

/* 
 文件上传
 */
router.post('/file_upload', upload.array('image'), function(req, res, next) {
    var picInfo = req.body.picName[0];
    console.log(picInfo);  // 上传的文件名
    console.log(req.files[0]);  // 上传的文件信息

    if(undefined == req.files[0]) {
        res.json(['failed', {
            "status": 400,
            "msg":"没有选择要上传的文件"
        }]);
        return -1;
    }

    var des_file = "./files/" + req.files[0].originalname;
    fs.readFile(req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            if(err){
                res.json({
                    "status": 500,
                    "msg": '文件保存失败'
                });
            }
            else {
                // 存储图片相关信息到数据库
                var pic = new Picture({
                    picName: picInfo,
                    addr: des_file,
                    createTime: new Date()
                });

                pic.save();
                var response = {
                    "status": 200,
                    "msg": 'success'
                };
                res.json(response);
            }
        });
    });
});

module.exports = router;
