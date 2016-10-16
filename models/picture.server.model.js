var mongoose = require('mongoose');

var pictureSchema = new mongoose.Schema({
	picName: String,
	addr: String,
	createTime: Date
});

mongoose.model('Picture', pictureSchema);