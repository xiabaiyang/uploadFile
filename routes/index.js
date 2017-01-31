var express = require('express');
var multer = require('multer');
var fs = require("fs");
var path = require('path');
var mime = require('mime');
var http = require('http');

var archiver = require('archiver');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Picture = mongoose.model('Picture'); // 注意最后的 s

var router = express.Router();

var upload = multer({ dest: '/tmp/' });

// var fileDownloadDir = '/Users/xby/weixin/uploadFile/files/';
var fileDownloadDir = '/www/uploadFile/files/';

var serverIp = 'http://104.131.78.218:3000';
// var serverIp = 'http://127.0.0.1:3000';

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
    var basePath = serverIp + '/files/';
    var files = fs.readdirSync(fileDownloadDir + type);
    var files = files.map(function (fileName, index) {
        return {
            addr: basePath + type + '/' + fileName,
            name: fileName.split('.svg')[0]
        }
    });
    var response = {
          "status": 200,
          "msg": 'success',
          "data": {
              addr: files
           }
    };
    res.json(response);
});

/*
  下载打包文件
*/
router.get('/pack', function (req, res, next) {
    var type = req.query.type;
    var packedFilePath = path.resolve(__dirname, '../files/' + type + '.zip');
    // var packedDownloadPath = 'http://127.0.0.1:3000' + '/files/' + type + '.zip';
    var packedDownloadPath = serverIp + '/files/' + type + '.zip';
    var packedFileName = type + '.zip';
    console.log('打包文件路径：' + packedFilePath);
      // create a file to stream archive data to.
    var output = fs.createWriteStream('files/' + type + '.zip');
    var archive = archiver('zip', {
        store: true // Sets the compression method to STORE.
    });

    // good practice to catch this error explicitly
    archive.on('error', function(err) {
        throw err;
    });

    // pipe archive data to the file
    archive.pipe(output);

    archive.directory('files/' + type + '/');

    archive.finalize();

    // listen for all archive data to be written
    output.on('close', function() {
        var response = {
              "status": 200,
              "msg": 'success',
              "data": {
                  addr: packedDownloadPath,
                  name: packedFileName
               }
        };
        res.json(response);

        // res.download(packedFilePath, packedFileName, function(err) {
        //     if (err) {
        //         console.log('打包下载失败');
        //     }
        //     else {
        //         console.log('打包下载成功');
        //     }
        // });
    });
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
    // var picInfo = req.body.picName[0];
    console.log('start upload...');
    var fileType = req.body.fileType;
    var uploadFileNum = req.files.length;
    var des_file = [];
    var fileOriginalName = [];
    if(uploadFileNum < 1) {
        res.json({
            "status": 400,
            "msg":"没有选择要上传的文件"
        });
        return -1;
    }

    var storageDir = './files/' + fileType + '/'; // 服务器存放地址
    var uploadInfo = [];
    for (var i = 0; i < uploadFileNum; i++) {
        var count = 0; // 存储文件计数用
        (function (i) {
            fileOriginalName[i] = req.files[i].originalname;
            des_file[i] = storageDir + fileOriginalName[i];
            uploadInfo.push({
                addr: serverIp + '/files/' + fileType + '/' + fileOriginalName[i],
                name: fileOriginalName[i]
            });
            fs.readFile(req.files[i].path, function (err, data) {
                fs.writeFile(des_file[i], data, function (err) {
                    if(err){
                        res.json({
                            "status": 500,
                            "msg": '文件保存失败'
                        });
                    }
                    else {
                        // 存储图片相关信息到数据库
                        new Picture({
                            picName: fileOriginalName[i],
                            addr: des_file,
                            createTime: new Date()
                        }).save();

                        count ++;

                        if (count === uploadFileNum) {
                          var response = {
                              "status": 200,
                              "msg": 'success',
                              "data": uploadInfo
                          };
                          res.json(response);
                        }
                    }
                });
            });
        })(i)
    }
});

module.exports = router;
