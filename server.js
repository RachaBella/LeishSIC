
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

	

	var gffbook = new Excel.Workbook();
	var cnvbook = new Excel.Workbook();

	app.get("/", function (req, res) {
		res.render("index");
	});
	/*TESTING THE EXCEL */
	// workbook.xlsx.readFile("./test.xlsx")
	// .then(function() {
	// 	var i=0;
	// 	var values9= [];
	// 	var tab = [];
 //        console.log("workbook number of rows : ", workbook._worksheets[1]._rows.length);
 //        workbook.eachSheet(function(worksheet, sheetId) {
 //        	worksheet.eachRow({ includeNull: false }, function(row, rowNumber) {
	// 		    console.log("Row " + rowNumber + " = " + JSON.stringify(row.values[3]));
	// 		    values9.push(JSON.stringify(row.values[9]));
	// 		});  

	// 		values9.forEach( function (element, index) {
	// 		 	tab.push(values9[index].split('"'));
	// 		 	i= i+2;
 //        	}) 
	// 		values9= [];
 //        	tab.forEach(function (element, index) {
 //        		tab[index].forEach (function (elm, i) {
 //        			if (elm ==='') {
 //        				tab[index].splice(i,1);
 //        			}
 //        		})
 //        	})
 //        	var tab2= {};
 //        	tab.forEach( function (element, index) {
 //        		tab[index].forEach( function (elm, i) {
 //        			tab2 = tab[index][i].split(';')
 //        			values9.push(tab2)
 //        		})
 //        	})

 //        	console.log("In the final separated values of column 9 of each row : ", values9); 

	// 	});
 //    });

	//For the rest, this a reference easy to work with, we can update the file anytime, the code remains the same
	var gffFile = "./LeishmaniaRefChromosome_lenght.xlsx";

	function addEndChromosomeColumn(CNVfile, GFFfile) {
		gffbook.xlsx.readFile(""+ GFFfile)
		.then(function() {
			var array = [];
			var gffsheet = gffbook.getWorksheet(1);
			var sizeCol = gffsheet.getColumn("B");
				console.log('the sizeColumn is ', sizeCol)
				sizeCol.eachCell(function (cell, rowNumber) {
					if( rowNumber !== 1) {
					array.push(cell.value)
					console.log("the cell is", cell.value)
					}
				})
			console.log("thee array !!", array);
			cnvbook.xlsx.readFile(CNVfile)
			.then(function() {
				var cnvsheet = cnvbook.getWorksheet("Feuil1");
				// var sheet = cnvbook.addWorksheet("My Sheet");
				// console.log("the cnvsheet is ", cnvsheet)
				var lengthCol = cnvsheet.getColumn("N");
				lengthCol.header ="chr_size"
				var previousCel= cnvsheet.getCell("B2").value;
				var i=0;
				lengthCol.eachCell({ includeEmpty: true }, function (cell, rowNumber) {
					if (rowNumber !== 1) {
						//worksheet.getCell("C3").value 
						if (previousCel == cnvsheet.getCell("B"+rowNumber).value) {
							cell.value = array[i]
							console.log("la valeur : "+ cell.value + "\n")
						}else {
							i++;
							cell.value = array[i];
						}
						previousCel = cnvsheet.getCell("B"+rowNumber).value;
					} 
				})

			})
			.then (function() {
				cnvbook.xlsx.writeFile(CNVfile)
			})
			.then(function() {
			    console.log("Done");
			});

		});
	}

	//addEndChromosomeColumn("./CNV.xlsx" , gffFile)
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

	app.post("/GffData", upload.single('file'), function (req, res) {
		console.log("this is the request : ", req.file);
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

	app.post('/CnvData', upload.single('file'), function (req, res) {
		fs.readFile(req.file.path, function (err, data) {
			if (err) {
				throw err; 
				res.send("ERROR");
			} else {
				console.log("analyzing the CNV file ...");
				// fc.move (req.file.path, 'uploads/' + req.file.originalname, function (err) {
				//     if (err) { throw err; }
				//     console.log ("Moved 'foo.txt' to 'bar.txt'");
				// });
				//fs.renameSync( req.file.path, 'uploads/test' )
				var objectFromCNV = [];
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
							console.log('the object is ready and lenght  : ',objectFromCNV.length);
							res.send(objectFromCNV);
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


	app.listen(process.env.PORT || 4000, function () {
	console.log("listening on port 4000 ... success :)");
	});