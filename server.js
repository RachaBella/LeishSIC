
var express = require("express"),
	fs = require('fs'),
	fc = require('fs.extra'),
	app = express(),
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
	
	//app.use(bodyParser({keepExtensions:true,uploadDir:path.join(__dirname,'/files')}));

	app.get("/", function (req, res) {
		res.render("index");
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
		fs.readFile(req.file.path, function (err, data) {
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
				var lr = new LineByLineReader('uploads/'+  req.file.filename );
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

	app.listen(process.env.PORT || 3000, function () {
	console.log("listening on port 3000 ... success :)");
	});