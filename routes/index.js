var express = require('express');
var multer = require('multer');
var fs = require("fs");
var path = require('path');
var mime = require('mime');
var http = require('http');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Picture = mongoose.model('Picture'); // 注意最后的 s

var router = express.Router();

var upload = multer({ dest: '/tmp/' });

// var fileDownloadDir = '/Users/xby/weixin/uploadFile/files/';
var fileDownloadDir = '/www/iconfont/files/';

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
            "data": "http://127.0.0.1:3000/files/qq.pdf"
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

router.get('/getFileAddr', function (req, res, next) {
    var type = req.query.type;
    var basePath = 'http://104.131.78.218:3000/files/';
    var files = fs.readdirSync('/Users/xby/weixin/uploadFile/files/' + type);
    var fileAddrs = files.map(function (fileName, index) {
        return basePath + type + '/' + fileName;
    });
    var response = {
          "status": 200,
          "msg": 'success',
          "data": {
              addr: fileAddrs
           }
    };
    res.json(response);
});

/*
 文件下载
 */
router.get('/file/:fileName', function(req, res, next) {
    var fileName = req.params.fileName;
    var filePath = path.join('files/', fileName);
    console.log(filePath);
    var mimetype = mime.lookup(filePath);
    var stats = fs.statSync(filePath);
    // if(stats.isFile()){
      // res.set({
      //     'Content-Type': 'application/octet-stream',
      //     'Content-Disposition': 'attachment; filename=' + encodeURI(fileName)
      // });
      // var fReadStream = fs.createReadStream(filePath);
      //
      // fReadStream.on("data", (chunk) => res.write(chunk));
      // fReadStream.on("end", () => {
      //     res.end();
      // });

      // res.sendFile(filePath);

      // res.set("Content-disposition", "attachment; filename=" + fileName);
      // res.set("Content-type", mimetype);
      //
      // var filestream = fs.createReadStream(filePath);
      // filestream.pipe(res);

      res.sendFile('/Users/xby/weixin/uploadFile/files/w.doc', function (err) {
          if (err) {
            console.log('file download fail');
          }
          else {
            console.log('file download success');
          }
      });
      // res.pipe(fs.createWriteStream(filePath));
    // }
    // else {
    //   res.set("Content-type","text/html");
    //   res.send("file not exist!");
    //   res.end();
    // }
});

/*
 文件上传
 */
router.post('/file_upload', upload.array('image'), function(req, res, next) {
    var picInfo = req.body.picName[0];
    console.log('start upload...');
    var fileType = req.body.fileType;
    if(undefined == req.files[0]) {
        res.json({
            "status": 400,
            "msg":"没有选择要上传的文件"
        });
        return -1;
    }

    var storageDir = './files/' + fileType + '/'; // 服务器存放地址
    var downloadAddr = 'http://104.131.78.218:3000/files/' + fileType + '/' + req.files[0].originalname; // 图片下载地址
    var des_file = storageDir + req.files[0].originalname;
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
                    "msg": 'success',
                    "data": {
                        addr: downloadAddr
                    }
                };
                res.json(response);
            }
        });
    });
});

module.exports = router;
