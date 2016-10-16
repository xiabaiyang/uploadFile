var mongoose = require('mongoose');
var config = require('./config.js');

module.exports = function () {
	var db = mongoose.connect(config.mongodb);

	// 测试数据库连接情况代码
	mongoose.connection.on('connected', function(){
    	console.log('Connection success!');
	});
	mongoose.connection.on('error', function(err){
    	console.log('Connection error: ' + err);
	});
	mongoose.connection.on('disconnected', function(){
    	console.log('Connection disconnected');
	});

	require('../models/picture.server.model.js'); // 导入 model

	return db;
}