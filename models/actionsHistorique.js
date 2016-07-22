var mongoose = require('mongoose'),
    actionDone = require ('./actionDone.js'),
    fileInformation = require ('./fileInformation.js')
    user = require('./users.js'),
	Schema   = mongoose.Schema;

var historiqueSchema = new Schema ({
	_user: {type: Schema.Types.ObjectId, ref: "User"
	},
	date: {
		type: Date
	},
	fileInformation:[
		{type: Schema.Types.ObjectId, ref: "File"
		}],
	actionDone:[
		{type: Schema.Types.ObjectId, ref: "Action"
		}]

})


var Historique = mongoose.model('Historique', historiqueSchema);
module.exports = Historique;