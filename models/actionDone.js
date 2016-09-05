var mongoose = require('mongoose'),
    user= require('./users.js'),
    db= require("."),
    moment= require("moment"),
    Schema = mongoose.Schema;

var actionSchema = new Schema ({
	actionType: {
		type: String,
		require:true
	},
	actionStep: {
		type: String,
	}, 
	actionDate: {
		type:String
	},
	actionDateEnd: {
		type:String
	}, 
	actionState: {
		type:String
	}
})

actionSchema.statics.createAction = function (userId, type, step, state, callback){
	db.Action.create( {actionType : type, 
						actionStep: step,
						actionDate: moment().format('MMMM Do YYYY, h:mm:ss a'), actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState:state} , function (error, newAction) {
							if (error) {
								callback ("Error");
							} else {
								db.Historique.findOne({_user:userId }, function (error, newHistorique) {
					        		if(error) {
					        			callback ("Error");
					        		} else if (newHistorique) {
					        			newHistorique.actionDone.push( newAction._id)
					        			newHistorique.save();
						        		callback ("Success");

					        		} else {
					        			db.Historique.create({
					        				_user:userId,
					        				date: Date.now(),
					        				actionDone:[],
					        				actionDone:[]
					        			}, function (erreur, histo) {
					        				if (erreur) {
					        					callback ("Error");
					        				} else {
					        					histo.actionDone.push(newAction._id); 
					        					histo.save();
					        					callback ("Success");
					        					
					        				}
					        			})
					        			
					        		}
				        		})
							}
						})
}

var Action = mongoose.model('Action', actionSchema);
module.exports = Action;

