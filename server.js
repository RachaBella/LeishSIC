
var express = require("express"),
	fs = require('fs'),
	fc = require('fs.extra'),
	app = express(),
	mongoose = require("mongoose"),
	bodyParser = require("body-parser"),
	multer  = require('multer'),
	upload = multer({ 
	 dest: 'uploads/',
	 inMemory:true,
	 onFileUploadData: function (file, data) {
  		console.log(data.length + ' of ' + file.fieldname + ' arrived')
		} 
	}),
	async = require('async'),
    path = require('path'),
	session = require('express-session') ({
        secret: "aliensAreAmongUs",
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 6000000}
    }),
    ejs = require("ejs"),
    Excel= require("exceljs");
    app.engine('html', ejs.renderFile); 
	app.set('view engine', 'html');
	app.use("/static", express.static("public"));
	app.use(bodyParser.urlencoded({ extended: true }));

	var db = require("./models");
	
	//app.use(bodyParser({keepExtensions:true,uploadDir:path.join(__dirname,'/files')}));
	var sessionUser = null
	app.get("/analyze", function (req, res) {
		res.render("index");
	});

	app.get("/", function (req, res) {
		res.render("pageAcceuil");
	});
	
	var LineByLineReader = require('line-by-line');
	var monObjet=[];
	function generateObjectFromGff(gffFile) {
		var objectFromGFF = [];
    	var lr = new LineByLineReader(gffFile);
		lr.on('error', function (err) {
   			 // 'err' contains error object
   			 console.log("An error occured", err.message);
		});
		i=1;
		async.series([
			function (callback) {
				lr.on('line', function (line) {
				    var line2 = (line).split(/\s/);
				    lr.pause();
				    setTimeout(function () {
					    if (line2[2] =="CDS") {
					    	line2.splice(1,1);
					    	line2.splice(4,3)
					    	objectFromGFF.push(line2);
					    	i++;
					    	// console.log(line2[0]);			    
					    }
				        // ...and continue emitting lines.
				        lr.resume();
				        monObjet = objectFromGFF;
				    }, 0.000000000001);   
				});
				callback();
			}, function (callback) {
				lr.on('end', function () {
					console.log('the object is ready and lenght  : ',objectFromGFF.length);
					callback();
					// All lines are read, file is closed now.
				});		

			}
			], function (err) {
				console.log( 'the object is ready and lenght is STILL  : ',objectFromGFF.length)
				return objectFromGFF;
			})
		
		
	}

	app.post("/GffData", upload.array('file', 12), function (req, res) {
		console.log("this is the request : ", req.files);
		fs.readFile(req.files[0].path, function (err, data) {
			if (err) {
				throw err; 
				res.send("ERROR");
			} else {
				console.log("renaming ...");
				// fc.move (req.file.path, 'uploads/' + req.file.originalname, function (err) {
				//     if (err) { throw err; }
				//     console.log ("Moved 'foo.txt' to 'bar.txt'");
				// });
				//fs.renameSync( req.file.path, 'uploads/test' )
				var objectFromGFF = [];
				var lr = new LineByLineReader('uploads/'+  req.files[0].filename );
				lr.on('error', function (err) {
		   			 // 'err' contains error object
		   			 console.log("An error occured", err.message);
		   			 res.send("ERROR");
				});
				i=1;
				async.series([
					function (callback) {
						console.log("reading ..")
						lr.on('line', function (line) {
						    var line2 = (line).split(/\s/);
						    lr.pause();
						    setTimeout(function () {
						    	
							    if (line2[2] =="CDS") {
							    	line2.splice(1,1);
							    	line2.splice(4,3)
							    	objectFromGFF.push(line2);
							    	i++;
							    	// console.log(i);			    
							    }else {
							    	if (line2[0]==='##FASTA') {
							    		lr.close();
							    	}
							    }
						        // ...and continue emitting lines.
						        lr.resume();
						    }, 0.000000000001);   
						});
						callback();
					}, function (callback) {
						console.log("finished reading ...")
						lr.on('end', function () {
							console.log('the object is ready and lenght  : ',objectFromGFF.length);
							res.send(objectFromGFF);
							// All lines are read, file is closed now.
						});	
						callback();	
					}
					], function (err) {
						if (err) {
							res.send("ERROR");
						}
					})	
					}
		});	
	})
	
	//CNV Treatment
	app.post('/CnvData', upload.array('file',12), function (req, res) {
		var l = req.files.length
		var finalResults = []
		async.series([
			function (callback1) {
				for (var k=0; k<l; k++) {
					console.log("analyzing the CNV file ...", req.files[k]);
					var p = req.files[k].path;
					var f= req.files[k].filename
					fs.readFile(p,  function (err, data) {
					if (err) {
						throw err; 
						res.send("ERROR");
					} else {
						// fc.move (req.file.path, 'uploads/' + req.file.originalname, function (err) {
						//     if (err) { throw err; }
						//     console.log ("Moved 'foo.txt' to 'bar.txt'");
						// });
						//fs.renameSync( req.file.path, 'uploads/test' )
						var objectFromCNV = [];
						var lr = new LineByLineReader('uploads/'+  f );
						lr.on('error', function (err) {
				   			 // 'err' contains error object
				   			 console.log("An error occured", err.message);
				   			 res.send("ERROR");
						});
						i=1;
						async.series([
							function (callback) {
								console.log("reading ..")
								lr.on('line', function (line) {
								    var line2 = (line).split("\t");
								    lr.pause();
								    setTimeout(function () {
									    line2.splice(7,1);
									    line2.splice(7,1);
									    // console.log(line2);
									    objectFromCNV.push(line2);
								        // ...and continue emitting lines.
								        lr.resume();
								    }, 0.000000000001);   
								});
								callback();
							}, function (callback) {
								console.log("finished reading ...")
								lr.on('end', function () {

									finalResults.push(objectFromCNV);
									if( finalResults.length === l) {
										console.log("DONE")
										res.send(finalResults)
									}
									

									// All lines are read, file is closed now.
								});	
								callback();	
							}
							], function (err) {
								if (err) {
									res.send("ERROR");
								}
								
							})	
							}
					});
				}
				callback1();
			}
		], function (err) {
			if (err) res.send("ERROR");
		
		})
	})

	//SNP Treatment
	app.post("/SnpData", upload.array('file',12), function (req, res) {
		var l = req.files.length;
		var finalResults = [];
		async.series([
			function (callback1) {
				for( var k=0; k<l; k++) {
					console.log("analyzing the SNP file ...", req.files[k]);
					var p = req.files[k].path;
					var f= req.files[k].filename;
					fs.readFile(p,  function (err, data) {
						if (err) {
							throw err; 
							res.send("ERROR");
						} else {
							//treatment goes here
							var objectFromSNP = [];
							var lr = new LineByLineReader('uploads/'+  f );
							lr.on('error', function (err) {
					   			 // 'err' contains error object
					   			 console.log("An error occured", err.message);
					   			 res.send("ERROR");
							});
							i=1;
							async.series([
							function (callback) {
								console.log("reading ..")
								lr.on('line', function (line) {
								    var line2 = (line).split("\t");
								    lr.pause();
								    setTimeout(function () {
								    	
								    	if (line2[0]==="NONE") {
								    		line2.splice(0,1);
								    		line2.splice(2,1);
								    		line2.splice(5,1);
								    		line2.splice(7,1);
								    	} else {
								    		line2.splice(2,1);
								    		line2.splice(5,1);
								    		line2.splice(7,1);
								    	}
									   
									    objectFromSNP.push(line2);
								        // ...and continue emitting lines.
								        lr.resume();
								    }, 0.000000000001);   
								});
								callback();
							}, function (callback) {
								console.log("finished reading ...")
								lr.on('end', function () {

									finalResults.push(objectFromSNP);
									if( finalResults.length === l) {
										console.log("DONE")
										res.send(finalResults)
									}
									

									// All lines are read, file is closed now.
								});	
								callback();	
							}
							], function (err) {
								if (err) {
									res.send("ERROR");
								}
								
							})
						}
					});

				}
				callback1();
			}
		], function (err) {

			if(err) res.send("ERROR");

		})
	})

	//INDELs Treatment
	app.post("/IndelData", upload.array('file',12), function (req, res) {

	})

	app.post("/signup", function (req, res) {
		var newUser = {
			firstName :req.body.firstname,
			lastName : req.body.lastname,
			userName : req.body.username,
			email: req.body.email,
			password: req.body.password
		};
		db.User.checkEmail(newUser.email, function (result) {
			if (result === 'error') {
				res.send("error")
			} else if (result === "email exists") {
				res.send("email exists")
			} else {
				db.User.checklogin(newUser.userName, function (result2) {
					if (result2 === 'error') {
						res.send("error")
					} else if (result2 === "login exists") {
						res.send("login exists")
					} else {
						db.User.createSecure(newUser.firstName, newUser.lastName, newUser.userName, newUser.password, newUser.email, function (error, newU) {
							if (error) {
								res.send("error")
							} else {
								console.log("the NEW USER IS : ", newU)
								//req.session.user = newU;
								sessionUser = newU;
								//req.session._id= newU._id;
								res.send(newU);
							}
						})
					}
				})
			}
		})
	})

	app.post("/login", function (req, res) {
		var user = {
			email : req.body.email,
			pass  : req.body.password
		}
		console.log(user)
		db.User.authenticate(user.email, user.pass, function (msg, response) {
			if (msg === 'wrong email') {
				console.log("wrong email")
				res.send("wrong email")
			}  else if (msg === "Error: incorrect password") {
				console.log("wrong password")
				res.send("wrong password")
			}else {
				console.log("login response", response)
				sessionUser = response;
				res.json({user : response})
			}
		})
	})

	app.get("/logout", function (req, res) {
		sessionUser =null;
		//on the logout we have to destroy the tempfile
		res.render("pageAcceuil");
	})

	//getting the current user
	app.get("/current_user", function (req, res) {
		var user = sessionUser;
		res.json({user : user})
	})

	app.get("/profile/:userName" , function (req, res) {
		var name = req.params.userName;
		console.log("the username received =", name)
		var userSession = sessionUser;
		console.log('the user session :', userSession);
		if (sessionUser !== null) {
			if (name !== sessionUser.userName) {
				res.render("ErrorForbidden")
			} else {
				res.render('profile', {user : userSession});
			}	
		} else {
			res.render("ErrorForbidden")
		}
	})

	app.get("/:userName/upload" , function (req, res) {
		console.log("APPEL REçuuu", req.params.userName)
		if (req.params.userName === sessionUser.userName) {
			console.log("page envoyée")
			res.render('upload');
		} else {
			res.render("ErrorForbidden")
		}
	})

	app.post("/:userName/update", function (req, res) {
		var user = {
			userName: req.body.userName,
			email : req.body.email,
			firstName: req.body.firstName,
			lastName: req.body.lastName
		}
		userN = req.params.userName;
		oldemail = sessionUser.email;
		if (userN !== user.userName) {
			db.User.checklogin(user.userName, function (msg) {
				if (msg === "error") {
					console.log("error niveau 1")
					res.send("error")
				} else if (msg ==="login exists") {
					console.log("error niveau 2")
					res.send("login exists")
				} else {
					if (oldemail !== user.email) {
						db.User.checkEmail(user.email, function (msg) {
							if (msg ==="error") {
								console.log("error niveau 3")
								res.send("error")
							} else if (msg === "email exists") {
								console.log("error niveau 4")
								res.send ('email exists')
							} else {
								db.User.updateInfo(req.params.userName, user.userName, user.firstName, user.lastName, user.email, function (msg, response) {
									if (msg === 'error') {
										console.log("error niveau 5")
										res.send("error")
									} else {
										console.log("updated user : ", response)
										sessionUser = response;
										res.json({user : response})
									}
								})
							}
						})
					} else { 
						db.User.updateInfo(req.params.userName, user.userName, user.firstName, user.lastName, user.email, function (msg, response) {
							if (msg === 'error') {
								console.log("error niveau 6")
								res.send("error")
							} else {
								sessionUser = response;
								res.json({user : response})
							}
						})

					}
				}
			})
		} else {
			if (oldemail !== user.email) {
						db.User.checkEmail(user.email, function (msg) {
							if (msg ==="error") {

							} else if (msg === "email exists") {
								res.send ('email exists')
							} else {
								db.User.updateInfo(req.params.userName, user.userName, user.firstName, user.lastName, user.email, function (msg, response) {
									if (msg === 'error') {
										res.send("error")
									} else {
										sessionUser = response;
										res.json({user : response})
									}
								})
							}
						})
					} else { 
						db.User.updateInfo(req.params.userName, user.userName, user.firstName, user.lastName, user.email, function (msg, response) {
							if (msg === 'error') {
								res.send("error")
							} else {
								sessionUser = response;
								res.json({user : response})
							}
						})

					}

		}
	})
 
 	// function filesTreatment(files, type) {
 	// 	var l = files.length
 	// 	for (var k=0; k<l; k++) {
		// 	console.log("analyzing the CNV file ...", files[k]);
		// 	var p = files[k].path;
		// 	var f= files[k].filename
		// 	fs.readFile(p,  function (err, data) {
		// 	if (err) {
		// 		throw err; 
		// 		res.send("ERROR");
		// 	} else {
		// 		// fc.move (req.file.path, 'uploads/' + req.file.originalname, function (err) {
		// 		//     if (err) { throw err; }
		// 		//     console.log ("Moved 'foo.txt' to 'bar.txt'");
		// 		// });
		// 		//fs.renameSync( req.file.path, 'uploads/test' )
		// 		var objectFromCNV = [];
		// 		var lr = new LineByLineReader('uploads/'+  f );
		// 		lr.on('error', function (err) {
		//    			 // 'err' contains error object
		//    			 console.log("An error occured", err.message);
		//    			 res.send("ERROR");
		// 		});
		// 		i=1;
		// 		async.series([
		// 			function (callback) {
		// 				console.log("reading ..")
		// 				lr.on('line', function (line) {
		// 				    var line2 = (line).split("\t");
		// 				    lr.pause();
		// 				    setTimeout(function () {
		// 				    	if (type ==="CNV") {
		// 				    		line2.splice(7,1);
		// 					    	line2.splice(7,1);
		// 				    	} else if (type === "SNP") {
		// 				    		if (line2[0]==="NONE") {
		// 						    		line2.splice(0,1);
		// 						    		line2.splice(2,1);
		// 						    		line2.splice(5,1);
		// 						    		line2.splice(7,1);
		// 						    	} else {
		// 						    		line2.splice(2,1);
		// 						    		line2.splice(5,1);
		// 						    		line2.splice(7,1);
		// 						    }
		// 				    	} else {

		// 				    	}
							    
		// 					    // console.log(line2);
		// 					    objectFromCNV.push(line2);
		// 				        // ...and continue emitting lines.
		// 				        lr.resume();
		// 				    }, 0.000000000001);   
		// 				});
		// 				callback();
		// 			}, function (callback) {
		// 				console.log("finished reading ...")
		// 				lr.on('end', function () {

		// 					finalResults.push(objectFromCNV);
		// 					if( finalResults.length === l) {
		// 						console.log("DONE")
		// 						 return finalResults
		// 					}
							

		// 					// All lines are read, file is closed now.
		// 				});	
		// 				callback();	
		// 			}
		// 			], function (err) {
		// 				if (err) {
		// 					res.send("ERROR");
		// 				}
						
		// 			})	
		// 			}
		// 	});
		// }

 	// }

	app.listen(process.env.PORT || 4000, function () {
	console.log("listening on port 4000 ... success :)");
	});