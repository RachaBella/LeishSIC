var mongoose = require('mongoose'),
    actionsHistorique= require('./actionsHistorique.js'),
    Schema = mongoose.Schema;

var actionSchema = new Schema ({
	_historique : {
		type: Schema.Types.ObjectId, ref: "Historique"
	},
	actionType: {
		type: String,
		require:true
	},
	actionOrder: {
		type: Number
	}
})

var Action = mongoose.model('Action', actionSchema);
module.exports = Action;