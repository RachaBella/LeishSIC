var mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	actionsHistorique= require("./actionsHistorique.js");

var fileSchema = new Schema({
	fileType: {
		type:String
	},
	fileSize: {
		type:String
	},
	fileName: {
		type:String
	},
	filePath: {
		type:String
	},
	uploadDate: {
		type:String
	}
})

var File = mongoose.model('File', fileSchema);
module.exports = File;