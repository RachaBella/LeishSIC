var mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	actionsHistorique= require("./actionsHistorique.js");

var fileSchema = new Schema({
	_historique: {
		type: Schema.Types.ObjectId, ref: "Historique"
	},
	fileName: {
		type:String
	},
	filePath: {
		type:String
	}
})

var File = mongoose.model('File', fileSchema);
module.exports = File;