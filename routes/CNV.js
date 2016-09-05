'use strict'

var fs = require('fs'),
	fc = require('fs.extra'),
	bodyParser = require("body-parser"),
	async = require('async');


exports.parseCNV = function (finalResults) {
	//var finalResults = [];
	async.series([
			function (callback1) {
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
				callback1();
			}
		], function (err) {
			if (err) res.send("ERROR");
		
		})
}