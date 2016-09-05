'use strict'
var mongoose = require('mongoose'),
    _ = require('lodash'),
    moment= require("moment"),
    async =require('async'),
    Grid = require('gridfs-stream');
    Grid.mongo = mongoose.mongo;
var fs = require('fs');
var gfs = new Grid(mongoose.connection.db);
var historique = require("../models/actionsHistorique.js");
var fileInfo = require('../models/fileInformation.js');
var db = require('../models')


exports.create = function(req,i,userId, res) {   	
	var part = req.files[i];
	var len = req.files.length;
	if (req.body.selectValue.constructor === Array) {
		var type = req.body.selectValue[i];
	} else {
		type = req.body.selectValue
	}
	if (type !=="Fasta") {
	    var writeStream = gfs.createWriteStream({
	        filename: part.originalname,
			mode: 'w',
			chunkSize: 1024,
	        content_type:part.mimetype,
	        metadata: {
	        	path:part.path,
	        	size: part.size,
	        	uploadDate: moment().format("MMM Do YY"),
	        	user_id: userId,
	        	type: type
	        }
	    });
	    fs.createReadStream(''+ part.path).pipe(writeStream);
	    // req.pipe(writeStream)
	    // writeStream.write(part.path, function (err, doc) {
	    // 	if (err) {
	    // 		console.log("ERROR NIVEAU writeFile:", err)
	    // 	} else {
	    // 		console.log("THE doc IS WRITTEN: ", doc)
	    // 	}
	    // });
		writeStream.on('close', function(file) {
	        console.log(file)
	        db.File.create( {
	        	fileName: part.originalname,
	        	filePath: part.path,
	        	fileType: type,
	        	fileSize: part.size,
	        	uploadDate: moment().format("MMM Do YY")
	        }, function (err, newFile) {
	        	if (err) {
	        		return res.status(500).send( {
		        		message: "Error"
		        	})
	        	} else {
	        		var id = newFile._id
	        		db.Historique.findOne({_user:userId }, function (error, newHistorique) {
		        		if(error) {
		        			return res.status(500).send( {
		        				message: "Error"
		        			})
		        		} else if (newHistorique) {
		        			newHistorique.fileInformation.push(newFile._id)
		        			newHistorique.save();
		        			console.log(" I =================",i)
		        			if (len === i+1) {
			        			return res.status(200).send({
									message: 'Success'
								});
		        			}

		        		} else {
		        			db.Historique.create({
		        				_user:userId,
		        				date: Date.now(),
		        				fileInformation:[],
		        				actionDone:[]
		        			}, function (erreur, histo) {
		        				if (erreur) {
		        					console.log("ERREUR NIV 1 :", erreur)
		        					return res.status(300).send( {
		        						message: "Not found"
		        					})
		        				} else {
		        					histo.fileInformation.push(id); 
		        					histo.save();
		        					console.log(" I =================",i)
		        					if ( len === i+1) {
		        						console.log("DOOOOOOOOOOOONE")
			        					return res.status(200).send( {
			        						message: "Success"
			        					})
		        					}
		        				}
		        			})
		        			
		        		}
	        		})
	        	}
	        })    
	    });
	} else {
		db.File.create( {
	        	fileName: part.originalname,
	        	filePath: part.path,
	        	fileType: type,
	        	fileSize: part.size,
	        	uploadDate: moment().format("MMM Do YY")

		}, function (err, newTemp) {
			if (err) {
				return res.status(500).send({
					message:"Error"
				})
			} else {
				var id = newTemp._id
				db.Historique.findOne({_user:userId }, function (error, newHistorique) {
		        		if(error) {
		        			return res.status(500).send( {
		        				message: "Error"
		        			})
		        		} else if (newHistorique) {
		        			newHistorique.fileInformation.push(id)
		        			newHistorique.save();
		        			console.log(" I =================",i)
		        			if (len === i+1) {
			     //    			return res.status(200).send({
								// 	message: 'Success'
								// });
		        			}

		        		} else {
		        			db.Historique.create({
		        				_user:userId,
		        				date: Date.now(),
		        				fileInformation:[],
		        				actionDone:[]
		        			}, function (erreur, histo) {
		        				if (erreur) {
		        					console.log("ERREUR NIV 1 :", erreur)
		        					return res.status(300).send( {
		        						message: "Not found"
		        					})
		        				} else {
		        					histo.fileInformation.push(id); 
		        					histo.save();
		        					console.log(" I =================",i)
		        					// if ( len === i+1) {
		        					// 	console.log("DOOOOOOOOOOOONE")
			        				// 	return res.status(200).send( {
			        				// 		message: "Success"
			        				// 	})
		        					// }
		        				}
		        			})
		        			
		        		}
	        		})
			}
			}
		)
		db.Temp.create( {
				_user: userId,
	        	fileName: part.originalname,
	        	filePath: part.path,
	        	fileType: type,
	        	fileSize: part.size,
	        	uploadDate: moment().format("MMM Do YY")

		}, function (err, newTemp) {
			if (err) {

			} else {
				if (len === i+1) {
        			return res.status(200).send({
						message: 'Success'
					});
    			}
			}
		})
	}
};

exports.createFastq = function(fileInfo, userId) {
	db.File.create( {
	        	fileName: fileInfo.originalname,
	        	filePath: fileInfo.path,
	        	fileType: "Fastq",
	        	fileSize: fileInfo.size,
	        	uploadDate: moment().format("MMM Do YY")

		}, function (err, newTemp) {
			if (err) {
				return res.status(500).send({
					message:"Error"
				})
			} else {
				var id = newTemp._id
				db.Historique.findOne({_user:userId }, function (error, newHistorique) {
		        		if(error) {
		        			// return res.status(500).send( {
		        			// 	message: "Error"
		        			// })
		        		} else if (newHistorique) {
		        			newHistorique.fileInformation.push(id)
		        			newHistorique.save();
		        			console.log(" I =================")

		        		} else {
		        			db.Historique.create({
		        				_user:userId,
		        				date: Date.now(),
		        				fileInformation:[],
		        				actionDone:[]
		        			}, function (erreur, histo) {
		        				if (erreur) {
		        					console.log("ERREUR NIV 1 :", erreur)
		        				} else {
		        					histo.fileInformation.push(id); 
		        					histo.save();
		        					console.log(" I =================")
		        				}
		        			})
		        			
		        		}
	        		})
			}
			}
		)
		db.Temp.create( {
				_user: userId,
	        	fileName: fileInfo.originalname,
	        	filePath: fileInfo.path,
	        	fileType: 'Fastq',
	        	fileSize: fileInfo.size,
	        	uploadDate: moment().format("MMM Do YY")

		}, function (err, newTemp) {
			if (err) {
				console.log("ERROR")
				//should log this to the log file
			} else {
				
			}
		})
}

exports.read = function (req,userId, res) {
	gfs.files.find({'metadata.user_id': userId}).toArray(function (err, files) {
		if (err) {
			res.status(500).send( {
				message:"Error"
			})
		} else {
			if (files.length ===0) {
				console.log("NO FILES FOUND");
			    res.status(200).send({
					message:"file not found"
				})
			} else {
				console.log("files found = ", files.length)
				// var readStream = gfs.createReadStream ({
				// 	filename: files[0].filename
				// })
				// // readStream.pipe(res);
				// readStream.on("data", function(data) {
				// 	//console.log("READSTREAM DATA=" , data.toString())
				// 	res.write(data);
				// })

				// readStream.on("end", function() {
				// 	res.end();
				// })

				// readStream.on("error", function (err) {
				// 	console.log("ERROR NIVEAU READSTREAM: ", err)
				// 	throw err;
				// })
				res.status(200).send({
					message: files
				})
				
			}
			//res.writeHead(200, {'content-type': files[0].content_type});
		}
		

	})
}

exports.destroy = function (req, userId, res){
	gfs.db.collection('fs.files').remove({'metadata.user_id': userId} , function (error){
		if (error) {
			return res.status(400).send({
				message:"Error"
			})
		} else {
			gfs.db.collection('fs.chunks').remove({}, function (err) {
				if (err) {
					return res.status(400).send({
						message:"Error"
					})
				} else {
					db.Temp.remove({_user: userId}, function (error) {
						if (error) {
							res.status(400).send({
								message:"Error"
							})
						} else {
							res.status(200).send({
								message:"Success"
							})
						}
					});
					//res.render("pageAcceuil");
				}
			})
			
		}
	})
	// gfs.files.remove({'metadata.user_id': userId}, function (error) {
	// 	if (error) {
	// 		return res.status(400).send({
	// 			message:"Temp File not deleted"
	// 		})
	// 	} else {

	// 		res.render("pageAcceuil");
	// 	}
	// })
}

exports.readParseCNV = function(req, res, userId) {
	var finalResults=[]
	var buffer=""
	var gffO=[]
	if (req.body.selectCNV.constructor === Array) {
		async.waterfall([
			function (callback) {
				var buffer2="";
				var readStream2 = gfs.createReadStream( {
					filename: req.body.selectGffRelated
				})
				readStream2.on("data", function (data) {
					buffer2+= data
				})

				readStream2.on("end", function() {
					buffer2.split("\n").forEach( function (line) {
						var line3= line.split("\t");
						var l = line3.length
						if ((line3[2] ==="gene") && (l!==1)) {
							line3.splice(0,6);
							line3.splice(1,1);
							var temp = line3[1].split(';')
							line3[1] = temp[0];
							line3[1] = line3[1].replace("ID=", "")
							gffO.push(line3)
						}
					})
				console.log("the gffo = ", gffO[0])
				callback(null, gffO);
				}) 
			}, function (arg, callback) {
					var len = req.body.selectCNV.length;
					var cc=0
					var v=0
					gfs.files.find({"metadata.user_id" : userId, "metadata.type" :"CNV"}).toArray(function (error, files) {
						if (error){
							db.Action.createAction(userId, "Visualize", "CNV", "Error", function (msg) {
								res.status(500).send({
									message: "Error"
								})
							})
						} else {
							var cpt=0;
								var k=0
								var j=0
								var done=false
								var treatment = function(files,req, k,j , len) {
									if (k< len) {
										if (files[j].filename === req.body.selectCNV[k]) {
											//mon traitement
											var objectFromCNV = [];
											buffer=""
											console.log(files[j].filename)
											 var bigReadStream= gfs.createReadStream({
												filename: files[j].filename
											})
										// console.log("quel indice? =", bigReadStream);
											var test=0
											bigReadStream.on("data", function (chunk) {
												buffer+= chunk;
												test++
												console.log(test)
											})
											bigReadStream.on("end", function () {
												// test=0

													buffer.split("\n").forEach(function (line, indic) {
														var line2= line.split("\t"); 
														cpt++;
														var lll = line2.length;
														var last = line2[lll-1];
														if (lll!== 1) {
															line2.push(line2[1])
															line2[1]= line2[1].replace(/\D/g,"")
															last = last.replace("\r","");
															line2[12] = last;
															//console.log("New line split", line2[1])
															line2.splice(7,2);
															//we treat here to look for the + or - in the gffO
															// console.log(line2)
															// console.log(cpt)
															if (line2[7]!== undefined) {
																var tempo = line2[7].split(',');
																var t = tempo.length;
																var leng= arg.length
																for (var x=0; x< leng; x++) {
																	if (tempo[0] === arg[x][1]) {
																		line2.push(arg[x][0]);
																		break;
																	}
																}
															}
															objectFromCNV.push(line2)
														}
													})
													test =0
													buffer=""
													objectFromCNV.sort( function (a,b) {
														if (a[1] - b[1] < 0) {
															return -1;
														} else if (a[1] - b[1] > 0) {
														    return 1;
														}  else return 0;
													})

													finalResults.push(objectFromCNV);
													console.log("the object lenght : ",objectFromCNV.length)
													objectFromCNV=[]
													console.log(cpt)
													cpt=0
													
													j=0
													if (finalResults.length === len) {
														callback();
													}
												//LE TEXT QUE JAI COPIE DEVRAIS ETRE ICI
											treatment(files, req,k+1,0,len)
											})// nte3 .end
										} else {
											j++
											treatment(files, req,k,j, len);
										}
									}
								}
								treatment(files, req, 0,0, len)
								
									// console.log("Multiple files : ",files)
									// console.log("fuck you K", k, " ", j)
									// if (files[j].filename === req.body.selectCNV[k]) {
										
									// } else {
								
									// 	j++
									// }
						}
					})//end of gfd.find

			}], function (err) {
				if (err) {
					constructor.log("error niveau last", err)
					db.Action.createAction(userId, "Visualize", "CNV", "Error", function (msg) {
						res.status(500).send({
							message:"Error"
						})
					})
				} else {
					var len = req.body.selectCNV.length;
					db.Action.createAction(userId, "Visualize", "CNV", "Success", function (msg) {
						res.status(200).send(finalResults)
					})
				}

			})

	} else {
		gfs.files.find({"metadata.user_id" : userId, filename: req.body.selectCNV, "metadata.type" :"CNV" }).toArray( function (error, files) {
			if (error){
				res.status(500).send({
					message: "Error"
				})
			} else {
					async.waterfall([
						function (callback) {
							var buffer2="";
							var readStream2 = gfs.createReadStream( {
								filename: req.body.selectGffRelated
							})
							readStream2.on("data", function (data) {
								buffer2+= data
							})

							readStream2.on("end", function() {
								buffer2.split("\n").forEach( function (line) {
									var line3= line.split("\t");
									var l = line3.length
									if ((line3[2] ==="gene") && (l!==1)) {
										line3.splice(0,6);
										line3.splice(1,1);
										var temp = line3[1].split(';')
										line3[1] = temp[0];
										line3[1] = line3[1].replace("ID=", "")
										gffO.push(line3)
									}
								})
							console.log("the gffo = ", gffO[0])
							callback(null, gffO);
							}) 
						},
						function (arg, callback) {
							var objectFromCNV = [];
							buffer="";
							console.log(files)
							var readStream = gfs.createReadStream({
								filename: req.body.selectCNV
							})
							var test=0
							readStream.on("data", function(data) {
								buffer+= data;
								test++
								console.log("TEST = ", test)
							})
							readStream.on("end", function () {
								console.log("ARG PASSED= ", arg[0])
										buffer.split("\n").forEach(function (line) {
											var line2= line.split("\t");
											//line2.push(line2[1])
											var lll = line2.length
											var last = line2[lll-1];
											// console.log("length", lll)
											if (lll!== 1) {
												line2.push(line2[1])
												line2[1]= line2[1].replace(/\D/g,"")
												last = last.replace("\r","");
												line2[12] = last;
												//console.log("New line split", line2[1])
												line2.splice(7,2);
												//we treat here to look for the + or - in the gffO
												var tempo = line2[7].split(',');
												var t = tempo.length;
												var leng= arg.length
												for (var j=0; j< leng; j++) {
													if (tempo[0] === arg[j][1]) {
														line2.push(arg[j][0]);

														break;
													}
												}
												objectFromCNV.push(line2)
												//console.log("After effect ", line2)
											}
										
										})

										objectFromCNV.sort( function (a,b) {
											if (a[1] - b[1] < 0) {
												return -1;
											} else if (a[1] - b[1] > 0) {
											    return 1;
											}  else return 0;
										})
										finalResults.push(objectFromCNV);
										callback();

							})
							
						}
					], function (err) {
						if (err) {
							db.Action.createAction(userId, "Visualize", "CNV", "Error", function (msg) {
								res.status(500).send({
									message:"Error"
								})
							})
						} else {
							//console.log(finalResults[0])
							db.Action.createAction(userId, "Visualize", "CNV", "Success", function (msg) {
								res.status(200).send(finalResults)
							})
						}
					})

				
				
			}
		})

	}
}

exports.getLengthGff= function (req, res, userId) {
	
}
exports.readParseGFF = function(req, res, userId) {
	
	gfs.files.find({"metadata.user_id" : userId, "metadata.type" : "Gff" , filename: req.body.selectGff}).toArray( function (error, files) {
		if (error) {
			db.Action.createAction(userId, "Visualize", "GFF", "Error", function (msg) {		
				res.status(500).send({
					message: "Error"
				})
			})
		 } 
		else {
			console.log("files : ", files)
			var l = files.length;
			var objectFromGff = [];
			var buffer="";
			var readStream = gfs.createReadStream({
				filename: req.body.selectGff
			})
			readStream.on("data", function(data) {
				buffer+= data;
			})
			readStream.on("end", function () {
				buffer.split("\n").forEach(function (line) {
					var line2= line.split("\t");
					var index = line2.length
					if (index!==1) {
						if (line2[0][0]!=='#') {
							if (line2[2] ==="CDS") {
								var last = line2[index-1];
						    	last = last.replace('\r', "")
						    	line2[index-1] = last;
								line2.splice(1,1);
						    	line2.splice(4,3);
						    	objectFromGff.push(line2);
							}
						}
					}
				})
				console.log(objectFromGff)
				db.Action.createAction(userId, "Visualize", "GFF", "Success", function (msg) {
					res.status(200).send(objectFromGff);	
				})
			})
		 }
	})
}

exports.readParseSNP = function(req, res, userId) {
	var finalResults = [];
	var buffer =""
	if (req.body.selectSNP.constructor === Array) {
		var len= req.body.selectSNP.length;
		 //we'll use the recursive function instead of this
		gfs.files.find({"metadata.user_id" : userId ,"metadata.type" :"SNP"}).toArray( function (error, files) {
			if (error) {
				db.Action.createAction(userId, "Visualize", "SNP", "Error", function (msg) {
					res.status(500).send( {
						message: "Error"
					})	
				})
				
			} else {
				var cpt =0;
				var k=0;
				var j=0;
				var treatment = function( files, req, k,j,len) {
					if(k<len) {
						if (files[j].filename === req.body.selectSNP[k]) {
							buffer=""
							var objectFromSNP=[];
							var bigReadStream= gfs.createReadStream({
								filename: files[j].filename
							})
							bigReadStream.on("data", function (chunk) {
								buffer+= chunk
							})
							bigReadStream.on("end", function () {
								buffer.split("\n").forEach(function (line) {
									var line2= line.split('\t')
									var lll= line2.length; 
									if (lll !==1) {
										if (line2[0][0] !=="#") {
											var last = line2[lll-1]
											last = last.replace('\r', "");
											line2[lll-1] = last
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
											
											line2.push(line2[0]);
											line2[0]= line2[0].replace(/\D/g,"")
											objectFromSNP.push(line2)
											}
									}
								})
								buffer =""
								objectFromSNP.sort( function (a,b) {
									if (a[0] - b[0] < 0) {
										return -1;
									} else if (a[0] - b[0] > 0) {
									    return 1;
									}  else return 0;
								})
								finalResults.push(objectFromSNP);
								j=0
								if( finalResults.length === len) {
									db.Action.createAction(userId, "Visualize", "SNP", "Success", function (msg) {
										res.status(200).send(finalResults)
									})
										
								}
								treatment(files, req, k+1,0, len)

							})

						} else {
							j++
							treatment(files,req,k,j,len)
						}
						
					}
				}
				treatment(files, req, k,j, len)
				
			}

		})

		
	} else {
		gfs.files.find({"metadata.user_id" : userId , filename: req.body.selectSNP, "metadata.type" :"SNP"}).toArray( function (error, files) {
			if (error) {
				db.Action.createAction(userId, "Visualize", "SNP", "Error", function (msg) {
					res.status(500).send( {
						message: "Error"
					})
				})
			} else {
			    buffer=""
				var objectFromSNP=[];
				var readStream = gfs.createReadStream({
						filename: req.body.selectSNP
					})
					readStream.on("data", function(data) {
						buffer+= data;
					})
					readStream.on("end", function () {
						buffer.split("\n").forEach(function (line) {
							var line2= line.split('\t')
							var lll= line2.length; 
							if (lll !==1) {
								if (line2[0][0] !=="#") {
									var last = line2[lll-1]
									last = last.replace('\r', "");
									line2[lll-1] = last
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
									line2.push(line2[0]);
									line2[0]= line2[0].replace(/\D/g,"")
									objectFromSNP.push(line2)
									}
							}
						})
							objectFromSNP.sort( function (a,b) {
								if (a[0] - b[0] < 0) {
									return -1;
								} else if (a[0] - b[0] > 0) {
								    return 1;
								}  else return 0;
							})
							//objectFromCNV.splice[objectFromCNV.length-1,1];
							finalResults.push(objectFromSNP);
							db.Action.createAction(userId, "Visualize", "SNP", "Success", function (msg) {
								res.status(200).send(finalResults)
							})
							
							
						})

			}

		})

	}
}

exports.readParseINDEL = function(req, res, userId) {
	var finalResults = []
	var buffer=""
	if (req.body.selectIndel.constructor === Array) {
		var len= req.body.selectIndel.length;
		 //we'll use the recursive function instead of this
		gfs.files.find({"metadata.user_id" : userId ,"metadata.type" :"Indels"}).toArray( function (error, files) {
			if (error) {
				db.Action.createAction(userId, "Visualize", "INDEL", "Error", function (msg) {
					res.status(500).send( {
						message: "Error"
					})
				})
			} else {
				var cpt =0;
				var k=0;
				var j=0;
				var treatment = function( files, req, k,j,len) {
					if(k<len) {
						if (files[j].filename === req.body.selectIndel[k]) {
							buffer=""
							var objectFromINDEL=[];
							var bigReadStream= gfs.createReadStream({
								filename: files[j].filename
							})
							bigReadStream.on("data", function (chunk) {
								buffer+= chunk
							})
							bigReadStream.on("end", function () {
								buffer.split("\n").forEach(function (line) {
									var line2= line.split('\t')
									var lll= line2.length; 
									if (lll !==1) {
										if (line2[0][0] !=="#") {
											var last = line2[lll-1]
											last = last.replace('\r', "");
											line2[lll-1] = last
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
											
											line2.push(line2[0]);
											line2[0]= line2[0].replace(/\D/g,"")
											if (line2[2].length > line2[3].length){
												line2.push("Deletion")
											} else {
												line2.push("Insertion")
											}
											objectFromINDEL.push(line2)
											}
									}
								})
								buffer =""
								objectFromINDEL.sort( function (a,b) {
									if (a[0] - b[0] < 0) {
										return -1;
									} else if (a[0] - b[0] > 0) {
									    return 1;
									}  else return 0;
								})
								finalResults.push(objectFromINDEL);
								j=0
								if( finalResults.length === len) {
										console.log("DONE")
										db.Action.createAction(userId, "Visualize", "INDEL", "Success", function (msg) {
											res.status(200).send(finalResults)
										})
								}
								treatment(files, req, k+1,0, len)

							})

						} else {
							j++
							treatment(files,req,k,j,len)
						}
						
					}
				}
				treatment(files, req, k,j, len)
				
			}

		})

	} else {
		gfs.files.find({"metadata.user_id" : userId , filename: req.body.selectIndel, "metadata.type" :"Indels"}).toArray( function (error, files) {
			if (error) {
				db.Action.createAction(userId, "Visualize", "INDEL", "Error", function (msg) {
					res.status(500).send( {
						message: "Error"
					})
				})
			} else {
			    buffer=""
				var objectFromINDEL=[];
				var readStream = gfs.createReadStream({
						filename: req.body.selectIndel
					})
					readStream.on("data", function(data) {
						buffer+= data;
					})
					readStream.on("end", function () {
						buffer.split("\n").forEach(function (line) {
							var line2= line.split('\t')
							var lll= line2.length; 
							if (lll !==1) {
								if (line2[0][0] !=="#") {
									var last = line2[lll-1]
									last = last.replace('\r', "");
									line2[lll-1] = last
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
									line2.push(line2[0]);
									line2[0]= line2[0].replace(/\D/g,"")
									if (line[2].length > line2[3].length){
										line2.push("Deletion")
									} else {
										line2.push("Insertion")
									}
									objectFromINDEL.push(line2)
									}
							}
						})
							objectFromINDEL.sort( function (a,b) {
								if (a[0] - b[0] < 0) {
									return -1;
								} else if (a[0] - b[0] > 0) {
								    return 1;
								}  else return 0;
							})
							//objectFromCNV.splice[objectFromCNV.length-1,1];
							finalResults.push(objectFromINDEL);
							db.Action.createAction(userId, "Visualize", "INDEL", "Success", function (msg) {
								res.status(200).send(finalResults)
							})
							
						})

			}

		})

	}
	

	// var readStream = gfs.createReadStream ({
	// 		filename: files[0].filename
	// 	})
	// 	// // readStream.pipe(res);
	// 	readStream.on("data", function(data) {
	// 		//console.log("READSTREAM DATA=" , data.toString())
	// 		var data2= data.toString()
	// 		console.log("TESTING : ", data2[1]) 
	// 		res.write(data);
	// 	})
}

exports.uploadVCF = function(type, path, userId, fileName, size, content_type ) {
	var writeStream = gfs.createWriteStream({
        filename: fileName,
		mode: 'w',
		chunkSize: 1024,
        content_type:content_type,
        metadata: {
        	path:path,
        	size:size,
        	uploadDate: moment().format("MMM Do YY"),
        	user_id: userId,
        	type: type
        }
    });
	fs.createReadStream(''+ part.path).pipe(writeStream);
	writeStream.on('close', function(file) {
	        console.log(file)
	        db.File.create( {
	        	fileName: fileName,
	        	filePath: path,
	        	fileType: type,
	        	fileSize: size,
	        	uploadDate: moment().format("MMM Do YY")
	        }, function (err, newFile) {
	        	if (err) {
	        		return res.status(500).send( {
		        		message: "Error"
		        	})
	        	} else {
	        		var id = newFile._id
	        		db.Historique.findOne({_user:userId }, function (error, newHistorique) {
		        		if(error) {
		        			return res.status(500).send( {
		        				message: "Error"
		        			})
		        		} else if (newHistorique) {
		        			newHistorique.fileInformation.push(newFile._id)
		        			newHistorique.save(); 
			        			return res.status(200).send({
									message: 'Success'
								});
		        		} else {
		        			db.Historique.create({
		        				_user:userId,
		        				date: Date.now(),
		        				fileInformation:[],
		        				actionDone:[]
		        			}, function (erreur, histo) {
		        				if (erreur) {
		        					console.log("ERREUR NIV 1 :", erreur)
		        					return res.status(300).send( {
		        						message: "Not found"
		        					})
		        				} else {
		        					histo.fileInformation.push(id); 
		        					histo.save();
	        						console.log("DOOOOOOOOOOOONE")
		        					return res.status(200).send( {
		        						message: "Success"
		        					})
		        					
		        				}
		        			})
		        			
		        		}
	        		})
	        	}
	        })      
	});
}
