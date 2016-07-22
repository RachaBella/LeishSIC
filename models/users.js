var mongoose = require('mongoose'),
    tempFile= require('./tempFile.js'),
    db= require(".")
    actionsHistorique = require('./actionsHistorique.js'),
	Schema   = mongoose.Schema,
	bcrypt   = require('bcryptjs');

var userSchema = new Schema({
	firstName: {
		type: String,
		require:true,
		unique:false
	},
	lastName: {
		type: String,
		require:true,
		unique:false
	},
	userName: { //login
		type:String,
		require:true,
		unique:true
	},
	password_digest: { //crypted password
		type:String,
		require:true
	},
	email: {
		type:String,
		require:true,
		unique:true
	},
	actionsHistorique:[
		{type: Schema.Types.ObjectId, ref: "Historique"
		}],
	tempFile:[
		{type: Schema.Types.ObjectId, ref: "Temp"
		}]
});

userSchema.statics.checklogin = function (userName, callback) {
	db.User.find({userName: userName}, function (error, found) {
		if (error) {
			callback("error");
		} else {
			if (found.length) {
				callback("login exists")
			} else  {
				callback(null);	
			} 
		}
	})
}

userSchema.statics.checkEmail = function (email, callback) {
	db.User.find({email:email}, function (error, found) {
		if (error) {
			callback("error");
		} else {
			if (found.length) {
				callback("email exists")
			} else  {
				callback(null);	
			} 
		}

	})
}

userSchema.statics.createSecure = function (firstName, lastName, userName, password, email, callback) {
	var user = this;
	//Now creating the crypted password with bycriptjs : password ---> password_digest
	bcrypt.genSalt(function (err, salt) {
	    bcrypt.hash (password, salt, function (err, hash) {
		    //console.log(hash);
		        // create the new user (save to db) with hashed password
		    user.create({
		    	firstName:firstName,
		    	lastName:lastName,
		        userName:userName,	
		        email: email,
		        password_digest: hash,
		        actionsHistorique:[],
		        tempFile:[],
		        }, callback);
		});
	});

}

userSchema.statics.authenticate = function (email, password, callback) {
	this.findOne({email:email}).populate("actionsHistorique").exec( function (error, user) {
		//if there is no user found
		if(!user) {
			callback("wrong email", null);
			//if a user is found, we check his password : 
		} else if (user.checkPassword(password)) {
        callback(null, user);
      	}else {
      		// if the password is incorrect : the function checkPassword retunrs false, we return an error
      	callback("Error: incorrect password", null);
      }
	})
}
//updating personnal info 
userSchema.statics.updateInfo = function (olduserName, newuserName, firstName, lastName, email, callback) {
	this.findOneAndUpdate({userName : olduserName }, { $set : { email : email, 
												 firstName: firstName,
												 lastName: lastName,
												 userName: newuserName
														}
											   },  {new: true}, function (err, userU) {
											   		if (err) {
											   			callback("error", null);
											   		} else {
											   			console.log("the NEW IS : ", userU)
											   			callback(null, userU)
											   		}
											   })
}
//updating a password
userSchema.methods.updatePassword = function (email, old, New, callback) {
	this.findOne({email: email}).exec(function (error, found) {
		//we are supposed to be already at the user account, so no need to check if user found or not
		//we directly check if the old password matches the user's password
		if (found.checkPassword(old)) {
			bcrypt.genSalt(function (err, salt) {
			    bcrypt.hash (New, salt, function (err, hash) {
				    //console.log(hash);
				        // update the password (save to db) with hashed password
				    this.findByIdAndUpdate(found._id, { $set : {password_digest: hash }} , function (error, userU ) {
				    	if (error) {
				    		callback("Error", null);
				    	}else {
				    		callback(null, userU);
				    	}
				    });
				});
			});

		} else {
			//the old doesn"t match the user's password, error
			callback ('Error: incorrect password', null);
		}
	})
}

//checking the password function
userSchema.methods.checkPassword = function (password) {
	return bcrypt.compareSync(password, this.password_digest);
}

var User = mongoose.model('User', userSchema);
module.exports = User;