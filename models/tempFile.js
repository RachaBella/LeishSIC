var mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	path = require('path'),
	user = require("./users.js");

var tempSchema = new Schema({
	_user: {
		type: Schema.Types.ObjectId, ref: "User"
	}, 
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

// tempSchema.plugin(crate, {
//   storage: new LocalFS({
//     directory: 'C:\\Users\\Racha\\Desktop', //the directory of the local upload
//     path: function(attachment) { // where the file is stored in the bucket - defaults to this function
//       return 'C:\\Users\\Racha\\Desktop\\' + attachment.filename
//     }
//   }),
//   fields: {
//     attachments: {
//     	array: true,
//     	path: String
//     }
//   }
// })

var Temp =  mongoose.model('Temp', tempSchema);
module.exports = Temp;