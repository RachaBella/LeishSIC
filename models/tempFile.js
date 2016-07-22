var mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	crate = require('mongoose-crate'),
	LocalFS = require('mongoose-crate-localfs'),
	user = require("./users.js");

var tempSchema = new Schema({
	_user: {
		type: Schema.Types.ObjectId, ref: "User"
	}, 
	tfileName: {
		type: String
	},
	tfilePath: {
		type: String
	}

})

tempSchema.plugin(crate, {
  storage: new LocalFS({
    directory: 'C:/Users/UploadFolder' //the directory of the local upload
  }),
  fields: {
    attachment: {}
  }
})

var Temp =  mongoose.model('Temp', tempSchema);
module.exports = Temp;