
var express = require("express"),
	fs = require('fs'),
	fc = require('fs.extra'),
	app = express(),
	mongoose = require("mongoose"),
	bodyParser = require("body-parser"),
	nodemailer=require("nodemailer"),
	moment= require("moment"),
	mime = require("mime"),
	// rimraf = require("rimraf"),
 //    mkdirp = require("mkdirp"),
 //    multiparty = require('multiparty'),
 	http = require('http'),
    server = http.Server(app),
    io = require('socket.io').listen(server),
    exec = require('child_process').exec,
    util = require('util')
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
    ejs = require("ejs");
    app.engine('html', ejs.renderFile); 
	app.set('view engine', 'html');
	app.use("/static", express.static("public"));
	app.use(bodyParser.urlencoded({ extended: true }));
	var db = require("./models");
	///////////////////////////////////////////////
	var storage = multer.diskStorage({
	  destination: function (req, file , cb) {
	  	var destDir="./uploads/"+ req.params.userName;
		if(!fs.existsSync(destDir)){
			fs.mkdirSync( destDir)
			cb(null, destDir )
		} else {
	    	cb(null, destDir )
			
		}
	  },
	  filename: function (req, file, cb) {
	    cb(null, sessionUser.userName + '-'+ file.originalname)
	  }
	})

	var storage2 = multer.diskStorage({
	  destination: "./uploads",
	  filename: function (req, file, cb) {
	    cb(null, sessionUser.userName + '-'+ file.originalname)
	  }
	})

	var uploadD = multer({ storage: storage })
	var Upload  = require('./routes/gfs.js');
	///////////////////////////////////////////////
	//app.use(bodyParser({keepExtensions:true,uploadDir:path.join(__dirname,'/files')}));

	//////////////////////////////////////////////////////////////////////////////////////////
	//The scripts of the steps of the pipeline
	var script_QC= "./routes/Scripts/script_QC",
		script_ALN= "./routes/Scripts/script_ALN",
		script_NREAD="./routes/Scripts/script_NREAD",
		script_INDEX_BWA="./routes/Scripts/script_INDEX_BWA",
		script_INDEX_FAI="./routes/Scripts/script_INDEX_FAI",
		script_DICT_FA="./routes/Scripts/script_DICT_FA",
		script_CV="./routes/Scripts/script_CV",
		script_NREADSam="./routes/Scripts/script_NREADSam",
		script_CLBAM_MDup="./routes/Scripts/script_CLBAM_MDup",
		script_CLBAM_Sort="./routes/Scripts/script_CLBAM_Sort",
		script_CLBAM_Target="./routes/Scripts/script_CLBAM_Target",
		script_CLBAM_Realign="./routes/Scripts/script_CLBAM_Realign",
		script_PR_VARIANT="./routes/Scripts/script_PR_VARIANT",
		script_PR_SNP="./routes/Scripts/script_PR_SNP",
		script_PR_INDEL="./routes/Scripts/script_PR_INDEL"; 
		script_PR_SV_DEL="./routes/Scripts/script_PR_SV_DEL";
		script_PR_SV_INS="./routes/Scripts/script_PR_SV_INS";
		script_PR_SV_DUP="./routes/Scripts/script_PR_SV_DUP";
		script_PR_SV_INV="./routes/Scripts/script_PR_SV_INV";
		script_PR_SV_TRA="./routes/Scripts/script_PR_SV_TRA";
		script_RNA_VARIANT="./routes/Scripts/script_RNA_VARIANT";
		script_ANN="./routes/Scripts/script_ANN";//22
		
	var result_QC= "Results/result_QC.txt",
		result_ALN= "Results/result_ALN.txt",
		result_CV="Results/result_CV.txt",
		result_CLBAM_MDup="Results/result_CLBAM_MDup.txt",
		result_CLBAM_Sort="Results/result_CLBAM_Sort.txt",
		result_CLBAM_Target="Results/result_CLBAM_Target.txt",
		result_CLBAM_Realign="Results/result_CLBAM_Realign.txt",
		result_PR_VARIANT="Results/result_PR_VARIANT.txt",
		result_PR_SNP="Results/result_PR_SNP.txt",
		result_PR_INDEL="Results/result_PR_INDEL.txt"; 
		result_PR_SV="Results/result_PR_SV.txt"; 
		result_ANN="Results/result_ANN.txt";//12
/////////////////////////////////////////////////////////////////////////////////////////////
	//Fasta, fastq, Html,dict,SAM, BAM, BAMdedup,BAMrealig, VCF(variant), VCF(SNP), VCF(indel), BCF(SV), VCF(DEL), VCF(INS), VCF(DUP), VCF(INV), VCF(TRA), gz(CNV), gz(SV), VCF(ann_SNP), html(annStat_SNP), txt(annStat_SNP),VCF(ann_Indel), html(annStat_Indel), txt(annStat_Indel), VCF(ann_Del), html(annStat_Del), txt(annStat_Del), VCF(ann_Ins), html(annStat_Ins), txt(annStat_Ins)
	//0		,1	  ,2	,3	 ,4	  ,5  ,6	    ,7		  ,8            ,9	      ,10		  ,11		,12		 ,13	   ,14		 ,15		,16		 ,17	   ,18		,19			  ,20				 ,21				,22			  ,23					,24					,25			 ,26				,27				  , 28			, 29			  , 30
var filesProcess=["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""];
var filesProcessExist=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var fileListTarget="Results/targetintervals.list";
var fileMetrics ="Results/metrics.txt";	
var nbSeqSAM=0;
var isGZ=0;
var fileDB="LmjF9.0";
var typeAna="DNA-Seq";
var userPath="./uploads/";
//////////////////////////////////////////////////////////////////////////////////////////////////
/*Extrating the name of the file*/
function extractFileName(file,separator,callback){
	var res=file.split(separator);
	callback(res[0]);
}

function nameFiles(fileFastq,fileFasta,callback){
	if((filesProcessExist[0] == 1) && (filesProcessExist[1] == 1)){
		var res=fileFastq.split(".fastq");
		var res2=fileFasta.split(".fasta");
		var res3=fileFastq.split(".gz");
		var gz=0;
		if(res3[0]!=fileFastq){
			gz=1;
		}
		var filesNames =[fileFasta,fileFastq,(res[0]+"_fastqc.html"),(res2[0]+".dict"),(res[0]+".sam"),(res[0]+".bam"),(res[0]+"_dedup.bam"),(res[0]+"_realign.bam"),(res[0]+".vcf"),(res[0]+"_snp.vcf"),(res[0]+"_indel.vcf"),(res[0]+".bcf"),(res[0]+"_DEL.vcf"),(res[0]+"_INS.vcf"),(res[0]+"_DUP.vcf"),(res[0]+"_INV.vcf"),(res[0]+"_TRA.vcf"),(res[0]+"_cnv.tar.gz"),(res[0]+"_sv.tar.gz"),(res[0]+"_ann_snp.vcf"),(res[0]+"_ann_snp_stat.html"),(res[0]+"_ann_snp_stat.genes.txt"),(res[0]+"_ann_indel.vcf"),(res[0]+"_ann_indel_stat.html"),(res[0]+"_ann_indel_stat.genes.txt"),(res[0]+"_ann_del.vcf"),(res[0]+"_ann_del_stat.html"),(res[0]+"_ann_del_stat.genes.txt"),(res[0]+"_ann_ins.vcf"),(res[0]+"_ann_ins_stat.html"),(res[0]+"_ann_ins_stat.genes.txt")];
		callback(filesNames,gz);
	} else {
		if(filesProcessExist[1] == 1){
			var res=fileFastq.split(".fastq");
			var gz=0;
			if(res3[0]!=fileFastq){
				gz=1;
			}
			var filesNames =["",fileFastq,(res[0]+"_fastqc.html"), "","","","","","","","","","","","","","","","","","","","","","","","","","","",""];
			callback(filesNames,gz);
		} else{
			callback(["","", "", "","","","","","","","","","","","","","","","","","","","","","","","","","","",""],0);
		}
		
	}
}

function reinitFiles(callback){
	
	var gz=0;
	var filesNames =["","","", "","","","","","","","","","","","","","","","","","","","","","","","","","","",""];
	var filesExist=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var nbSAM=0;
	
	callback(filesNames,filesExist,gz,nbSAM);
}

/////////////////////////////////////////////////////////////////////////////////////////////////
/*Variables*/
	var sessionUser = null;
	var analysePipeline = require("./routes/analyse_pipeline");
/////////////////////////////////////////////////////////////////////////////////////////////////
/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/

require('dotenv').load();
var email = process.env.Mail;
var pass = process.env.pass;
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: email,
        pass: pass
    }
});
var rand,mailOptions,host,link;
/*------------------SMTP Over-----------------------------*/

//////////////////////////////////////////////////////////////////////////////////////////////////
/*Routes*/

	app.get('/analyse', function (req, res) {
		res.sendStatus(200);
	})

	app.get("/:userName/visualize", function (req, res) {
		if (req.params.userName !== sessionUser.userName) {
			res.render("ErrorForbidden")
		} else {
			res.render("index");
		}
	});

	app.get("/test", function (req, res) {
		res.render("upload2")
	})

	app.get('/:userName/analyze', function (req, res) {
		if (req.params.userName !== sessionUser.userName) {
			res.render("ErrorForbidden")
		} else {
			nameFiles(filesProcess[0],filesProcess[1],function(listNames,gz){
				filesProcess=listNames;
				isGZ=gz;
			});

			if(!fs.existsSync(userPath)){
				fs.mkdirSync( userPath)
				fs.mkdirSync( userPath+ "/Results")
			} else {
				if (!fs.existsSync(userPath+"/Results")) {
					fs.mkdirSync( userPath+ "/Results")
				}
			}
			
			res.render("analyzePage");	
		}
		
	})

	var bigActionId= [];
		bigActionId.length = 15
	app.get('/analyseSteps', function(req, res) {
		console.log("Step: "+req.query.step);
		typeAna=req.query.type;
		//here we save the step into action
		db.Action.create({
			_user: sessionUser._id,
			actionType: req.query.type,
			actionStep: req.query.step,
			actionDate: moment().format('MMMM Do YYYY, h:mm:ss a')
		}, function (err, Action) {
			if (err) {
				res.sendStatus(400);
			} else {
				//sauvegarde dans l'historique
				switch (req.query.step) {
					case "dna-qc": {
						bigActionId[0] = Action._id
					} break;
					case "dna-al": {
						bigActionId[2] = Action._id
					}break;
					case 'dna-clf': {
						bigActionId[1] = Action._id
					}break;
					case "dna-cv": {
						bigActionId[3] = Action._id
					}break;
					case "dna-clb" : {
						bigActionId[4] = Action._id
					} break;
					case "dna-pr-variant": {
						bigActionId[5] = Action._id
					}break;
					case "dna-pr-snp": {
						bigActionId[6] = Action._id
					}break;
					case "dna-pr-indel": {
						bigActionId[7] = Action._id
					}break;
					case "dna-pr-cnv": {
						bigActionId[8] = Action._id
					}break;
					case "dna-pr-sv": {
						bigActionId[9] = Action._id
					}break;
					case "dna-ann-snp": {
						bigActionId[10] = Action._id
					}break;
					case "dna-ann-indel": {
						bigActionId[11] = Action._id
					}break;
					case "dna-ann-del": {
						bigActionId[12] = Action._id
					}break;
					case "dna-ann-ins": {
						bigActionId[13] = Action._id
					}break;

				}
				db.Historique.findOne({_user:sessionUser._id }, function (error, newHistorique) {
	        		if(error) {
	        			res.sendStatus(500);
	        		} else if (newHistorique) {
	        			newHistorique.actionDone.push(Action._id)
	        			newHistorique.save();
		        		res.sendStatus(200);

	        		} else {
	        			db.Historique.create({
	        				_user:userId,
	        				date: Date.now(),
	        				fileInformation:[],
	        				actionDone:[]
	        			}, function (erreur, histo) {
	        				if (erreur) {
	        					res.sendStatus(500);
	        				} else {
	        					histo.actionDone.push(Action._id); 
	        					histo.save();
	        					res.sendStatus(200);
	        					
	        				}
	        			})
	        			
	        		}
        		})
			}
		})
	});

	app.get("/current_user/actions", function (req,res) {
		db.Historique.find({_user: sessionUser._id}).populate('actionDone').exec(function (error, histos) {
			if (error) {
				return res.status(400).send({
					message:"Error"
				})
			} else {
				console.log("the actions are ", histos.length)
				if (histos.length ===0) {
					return res.status(200).send({
						message: null
					})	
				} else {
					return res.status(200).send({
						message: histos[0].actionDone
					})
				}
				
			}
		})
	})

	//db.Action.findOneAndUpdate({_id:bigActionId[0]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Success" }}, function (error, action) {
					//don't know what to do in this case
	app.get('/stream_dna-qc', function(req, res) {
	    res.writeHead(200, {"Content-Type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive"});
		res.write("retry: 10000\n");
		//result_QC=path.join(__dirname, result_QC);
		analysePipeline.run_Step_QC(res,[script_QC,filesProcess[1],filesProcess[2],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_QC],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_QC, function (er){
			if(er==1){
				filesProcessExist[2]=1;
				db.Action.findOneAndUpdate({_id:bigActionId[0]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Success" }}, function (error, action) {

				})
	
			} else{
				filesProcessExist[2]=0;
				db.Action.findOneAndUpdate({_id:bigActionId[0]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Error" }}, function (error, action) {

				})
	
			}
		});
		
		res.connection.addListener("close", function () {
		   console.log("qc......resClose");
		   clearInterval(res);
		   res.end();
		}, false);
	});

	app.get('/stream_dna-al', function(req, res) {
	    res.writeHead(200, {"Content-Type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive"});
		res.write("retry: 10000\n");
		
		analysePipeline.run_Step_ALN(res,[script_INDEX_BWA,filesProcess[0]],[filesProcess[3]],[script_DICT_FA,filesProcess[0],filesProcess[3]],[script_INDEX_FAI,filesProcess[0]], [script_ALN,filesProcess[0],filesProcess[1],filesProcess[4],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_ALN],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_ALN,[script_NREAD,isGZ,filesProcess[1]],function (er){
			if(er==1){
				filesProcessExist[3]=1;
				filesProcessExist[4]=1;
				db.Action.findOneAndUpdate({_id:bigActionId[2]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Success" }}, function (error, action) {
				})
			} else{
				filesProcessExist[3]=0;
				filesProcessExist[4]=0;
				db.Action.findOneAndUpdate({_id:bigActionId[2]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Error" }}, function (error, action) {
				})			
			}

		});
		
		res.connection.addListener("close", function () {
		   console.log("qc......resClose");
		   clearInterval(res);
		   res.end();
		}, false);
	});

	app.get('/stream_dna-cv', function(req, res) {
	    res.writeHead(200, {"Content-Type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive"});
		res.write("retry: 10000\n");
		
		analysePipeline.run_Step_CV(res,[script_CV,filesProcess[4],filesProcess[5],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_CV],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_CV,[script_NREADSam,filesProcess[4]],function(nbSeq,er){
			nbSeqSAM=nbSeq;
			console.log("nbSeqSAM : "+nbSeqSAM);
			if(er==1){
				filesProcessExist[5]=1;
				db.Action.findOneAndUpdate({_id:bigActionId[3]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Success" }}, function (error, action) {
					
				})
			} else{
				filesProcessExist[5]=0;
				db.Action.findOneAndUpdate({_id:bigActionId[3]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Error" }}, function (error, action) {
					
				})
			}
		});
		
		res.connection.addListener("close", function () {
		   console.log("qc......resClose");
		   clearInterval(res);
		   res.end();
		}, false);
	});

	app.get('/stream_dna-clb', function(req, res) {
	    res.writeHead(200, {"Content-Type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive"});
		res.write("retry: 10000\n");
		
		analysePipeline.run_Step_ClBAM(res,[script_CLBAM_MDup,filesProcess[5],filesProcess[6],fileMetrics,__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_CLBAM_MDup],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_CLBAM_MDup,nbSeqSAM,
		[script_CLBAM_Sort,filesProcess[6],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_CLBAM_Sort],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_CLBAM_Sort,
		[script_CLBAM_Target,filesProcess[0],filesProcess[6],fileListTarget,__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_CLBAM_Target],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_CLBAM_Target,
		[script_CLBAM_Realign,filesProcess[0],filesProcess[6],fileListTarget,filesProcess[7],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_CLBAM_Realign],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_CLBAM_Realign, function (er){
			if(er==1){
				filesProcessExist[6]=1;
				filesProcessExist[7]=1;
				db.Action.findOneAndUpdate({_id:bigActionId[4]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Success" }}, function (error, action) {
					
				})
			} else{
				filesProcessExist[6]=0;
				filesProcessExist[7]=0;
				db.Action.findOneAndUpdate({_id:bigActionId[4]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Error" }}, function (error, action) {
					
				})
			}
		});
		
		res.connection.addListener("close", function () {
		   console.log("qc......resClose");
		   clearInterval(res);
		   res.end();
		}, false);
	});

	app.get('/stream_dna-pr-variant', function(req, res) {
	    res.writeHead(200, {"Content-Type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive"});
		res.write("retry: 10000\n");
		var fileBAM=filesProcess[5];
		
		if(filesProcessExist[7]==1){
			var fileBAM=filesProcess[7];
		}
		if(type=="DNA-Seq"){
			analysePipeline.run_Step_PR_Variant(res,[script_CLBAM_Sort,fileBAM,__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_CLBAM_Sort],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_CLBAM_Sort,
			[script_PR_VARIANT,filesProcess[0],fileBAM,filesProcess[8],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_PR_VARIANT],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_PR_VARIANT, function (er){
				if(er==1){
					filesProcessExist[8]=1;
					db.Action.findOneAndUpdate({_id:bigActionId[5]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Success" }}, function (error, action) {
					
					})
				} else{
					filesProcessExist[8]=0;
					db.Action.findOneAndUpdate({_id:bigActionId[5]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Error" }}, function (error, action) {
					
					})
				}
			});
		} else{
			analysePipeline.run_Step_PR_Variant(res,[script_CLBAM_Sort,fileBAM,__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_CLBAM_Sort],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_CLBAM_Sort,
			[script_RNA_VARIANT,filesProcess[0],fileBAM,filesProcess[8],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_PR_VARIANT],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_PR_VARIANT, function (er){
				if(er==1){
					filesProcessExist[8]=1;
					db.Action.findOneAndUpdate({_id:bigActionId[5]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Success" }}, function (error, action) {
					
					})
				} else{
					filesProcessExist[8]=0;
					db.Action.findOneAndUpdate({_id:bigActionId[5]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Error" }}, function (error, action) {
					
					})
				}
			});

		}
		
		
		res.connection.addListener("close", function () {
		   console.log("qc......resClose");
		   clearInterval(res);
		   res.end();
		}, false);
	});
	
	app.get('/stream_dna-pr-snp', function(req, res) {
	    res.writeHead(200, {"Content-Type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive"});
		res.write("retry: 10000\n");
		
		analysePipeline.run_Step_PR_SNP(res,[script_PR_SNP,filesProcess[0],filesProcess[8],filesProcess[9],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_PR_SNP],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_PR_SNP, function (er){
			if(er==1){
				filesProcessExist[9]=1;
				db.Action.findOneAndUpdate({_id:bigActionId[6]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Success" }}, function (error, action) {
					
				})
				Upload.uploadVCF("SNP", filesProcess[9], sessionUser._id,path.basename(filesProcess[9]),(fs.statSync(filesProcess[9])).size, mime.lookup(filesProcess[9]) )
			
			} else{
				filesProcessExist[9]=0;
				db.Action.findOneAndUpdate({_id:bigActionId[6]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Error" }}, function (error, action) {
					
				})

			}
		});
		
		res.connection.addListener("close", function () {
		   console.log("qc......resClose");
		   clearInterval(res);
		   res.end();
		}, false);
	});
	
	app.get('/stream_dna-pr-indel', function(req, res) {
	    res.writeHead(200, {"Content-Type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive"});
		res.write("retry: 10000\n");
		
		analysePipeline.run_Step_PR_Indel(res,[script_PR_INDEL,filesProcess[0],filesProcess[8],filesProcess[10],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_PR_INDEL],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_PR_INDEL,function (er){
			if(er==1){
				filesProcessExist[10]=1;
				db.Action.findOneAndUpdate({_id:bigActionId[7]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Success" }}, function (error, action) {
					
				})
				Upload.uploadVCF("Indels", filesProcess[10], sessionUser._id,path.basename(filesProcess[10]),(fs.statSync(filesProcess[10])).size, mime.lookup(filesProcess[10]) )
			

			} else{
				filesProcessExist[10]=0;
				db.Action.findOneAndUpdate({_id:bigActionId[7]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Error" }}, function (error, action) {
					
				})
			}
		});
		
		res.connection.addListener("close", function () {
		   console.log("qc......resClose");
		   clearInterval(res);
		   res.end();
		}, false);
	});

	app.get('/stream_dna-pr-cnv', function(req, res) {
	    res.writeHead(200, {"Content-Type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive"});
		res.write("retry: 10000\n");
		
		var fileBAM=filesProcess[5];
		var stepRepeatTypes= 0;
		
		if(filesProcessExist[7]==1){
			fileBAM=filesProcess[7];
		}
		stepRepeatTypes=filesProcessExist[12]+filesProcess[14]+filesProcess[14];
		
		run_Step_PR_SV(res,stepRepeatTypes,"CNV",[script_CLBAM_Sort,fileBAM,__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_CLBAM_Sort],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_CLBAM_Sort,__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_PR_SV,
		[script_PR_SV_DEL,filesProcess[0],fileBAM,filesProcess[11],filesProcess[12],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_PR_SV],
		[script_PR_SV_INS,filesProcess[0],fileBAM,filesProcess[11],filesProcess[13],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_PR_SV],
		[script_PR_SV_DUP,filesProcess[0],fileBAM,filesProcess[11],filesProcess[14],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_PR_SV],
		[script_PR_SV_INV,filesProcess[0],fileBAM,filesProcess[11],filesProcess[15],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_PR_SV],
		[script_PR_SV_TRA,filesProcess[0],fileBAM,filesProcess[11],filesProcess[16],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_PR_SV],filesProcess[11],function(er,arret){
			if(er==1){
				filesProcessExist[12]=1;
				filesProcessExist[14]=1;
				db.Action.findOneAndUpdate({_id:bigActionId[8]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Success" }}, function (error, action) {
					
				})
				Upload.uploadVCF("SV_DEL", filesProcess[12], sessionUser._id,path.basename(filesProcess[12]),(fs.statSync(filesProcess[12])).size, mime.lookup(filesProcess[12]) )
				
			} else{
				db.Action.findOneAndUpdate({_id:bigActionId[8]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Error" }}, function (error, action) {
					
				})
				switch (arret){
					case 0 :
						filesProcessExist[12]=0;
						filesProcessExist[14]=0;
						break;
					case 2 :
						filesProcessExist[12]=1;
						filesProcessExist[14]=0;
						Upload.uploadVCF("SV_DEL", filesProcess[12], sessionUser._id,path.basename(filesProcess[12]),(fs.statSync(filesProcess[12])).size, mime.lookup(filesProcess[12]))
						break;
				}
			}
		});
		
		res.connection.addListener("close", function () {
		   console.log("cnv......resClose");
		   clearInterval(res);
		   res.end();
		}, false);
	});
	
	app.get('/stream_dna-pr-sv', function(req, res) {
	    res.writeHead(200, {"Content-Type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive"});
		res.write("retry: 10000\n");
		
		var fileBAM=filesProcess[5];
		var stepRepeatTypes= 0;
		
		if(filesProcessExist[7]==1){
			fileBAM=filesProcess[7];
		}
		stepRepeatTypes=filesProcessExist[12]+filesProcess[13]+filesProcess[14]+filesProcess[15]+filesProcess[16];
		
		run_Step_PR_SV(res,stepRepeatTypes,"SV",[script_CLBAM_Sort,fileBAM,__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_CLBAM_Sort],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_CLBAM_Sort,__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_PR_SV,
		[script_PR_SV_DEL,filesProcess[0],fileBAM,filesProcess[11],filesProcess[12],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_PR_SV],
		[script_PR_SV_INS,filesProcess[0],fileBAM,filesProcess[11],filesProcess[13],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_PR_SV],
		[script_PR_SV_DUP,filesProcess[0],fileBAM,filesProcess[11],filesProcess[14],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_PR_SV],
		[script_PR_SV_INV,filesProcess[0],fileBAM,filesProcess[11],filesProcess[15],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_PR_SV],
		[script_PR_SV_TRA,filesProcess[0],fileBAM,filesProcess[11],filesProcess[16],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_PR_SV],filesProcess[11],function(er,arret){
			if(er==1){
				filesProcessExist[12]=1;
				filesProcessExist[13]=1;
				filesProcessExist[14]=1;
				filesProcessExist[15]=1;
				filesProcessExist[16]=1;
				db.Action.findOneAndUpdate({_id:bigActionId[9]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Success" }}, function (error, action) {
					
				})
				Upload.uploadVCF("SV_DEL", filesProcess[12], sessionUser._id,path.basename(filesProcess[12]),(fs.statSync(filesProcess[12])).size, mime.lookup(filesProcess[12]) )
				Upload.uploadVCF("SV_INS", filesProcess[13], sessionUser._id,path.basename(filesProcess[13]),(fs.statSync(filesProcess[13])).size, mime.lookup(filesProcess[13]) )
				
			} else{
				db.Action.findOneAndUpdate({_id:bigActionId[9]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Error" }}, function (error, action) {
					
				})
				switch (arret){
					case 0 :
						filesProcessExist[12]=0;
						filesProcessExist[13]=0;
						filesProcessExist[14]=0;
						filesProcessExist[15]=0;
						filesProcessExist[16]=0;
						break;
					case 1 :
						filesProcessExist[12]=1;
						filesProcessExist[13]=0;
						filesProcessExist[14]=0;
						filesProcessExist[15]=0;
						filesProcessExist[16]=0;
						Upload.uploadVCF("SV_DEL", filesProcess[12], sessionUser._id,path.basename(filesProcess[12]),(fs.statSync(filesProcess[12])).size, mime.lookup(filesProcess[12]) )
						
						break;
					case 2 :
						filesProcessExist[12]=1;
						filesProcessExist[13]=1;
						filesProcessExist[14]=0;
						filesProcessExist[15]=0;
						filesProcessExist[16]=0;
						Upload.uploadVCF("SV_DEL", filesProcess[12], sessionUser._id,path.basename(filesProcess[12]),(fs.statSync(filesProcess[12])).size, mime.lookup(filesProcess[12]) )
						Upload.uploadVCF("SV_INS", filesProcess[13], sessionUser._id,path.basename(filesProcess[13]),(fs.statSync(filesProcess[13])).size, mime.lookup(filesProcess[13]) )
				
						break;
					case 3 :
						filesProcessExist[12]=1;
						filesProcessExist[13]=1;
						filesProcessExist[14]=1;
						filesProcessExist[15]=0;
						filesProcessExist[16]=0;
						Upload.uploadVCF("SV_DEL", filesProcess[12], sessionUser._id,path.basename(filesProcess[12]),(fs.statSync(filesProcess[12])).size, mime.lookup(filesProcess[12]) )
						Upload.uploadVCF("SV_INS", filesProcess[13], sessionUser._id,path.basename(filesProcess[13]),(fs.statSync(filesProcess[13])).size, mime.lookup(filesProcess[13]) )
				
						break;
					case 4 :
						filesProcessExist[12]=1;
						filesProcessExist[13]=1;
						filesProcessExist[14]=1;
						filesProcessExist[15]=1;
						filesProcessExist[16]=0;
						Upload.uploadVCF("SV_DEL", filesProcess[12], sessionUser._id,path.basename(filesProcess[12]),(fs.statSync(filesProcess[12])).size, mime.lookup(filesProcess[12]) )
						Upload.uploadVCF("SV_INS", filesProcess[13], sessionUser._id,path.basename(filesProcess[13]),(fs.statSync(filesProcess[13])).size, mime.lookup(filesProcess[13]) )
				
						break;
				}
			}
		});
		
		res.connection.addListener("close", function () {
		   console.log("cnv......resClose");
		   clearInterval(res);
		   res.end();
		}, false);
	});
	
	app.get('/stream_dna-ann-snp', function(req, res) {
	    res.writeHead(200, {"Content-Type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive"});
		res.write("retry: 10000\n");
		
		analysePipeline.run_Step_ANN(res,[script_ANN,filesProcess[9],filesProcess[20],fileDB,filesProcess[19],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_ANN],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_ANN,function (er){
			if(er==1){
				filesProcessExist[19]=1;
				filesProcessExist[20]=1;
				filesProcessExist[21]=1;
				db.Action.findOneAndUpdate({_id:bigActionId[10]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Success" }}, function (error, action) {
					
				})
				Upload.uploadVCF("ANN_SNP", filesProcess[19], sessionUser._id,path.basename(filesProcess[19]),(fs.statSync(filesProcess[19])).size, mime.lookup(filesProcess[19]) )
				Upload.uploadVCF("STAT_ANN_SNP", filesProcess[21], sessionUser._id,path.basename(filesProcess[21]),(fs.statSync(filesProcess[21])).size, mime.lookup(filesProcess[21]) )
				
			} else{
				filesProcessExist[19]=0;
				filesProcessExist[20]=0;
				filesProcessExist[21]=0;
				db.Action.findOneAndUpdate({_id:bigActionId[10]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Error" }}, function (error, action) {
					
				})
			}
		});
		
		res.connection.addListener("close", function () {
		   console.log("ann......resClose");
		   clearInterval(res);
		   res.end();
		}, false);
	});
	
	app.get('/stream_dna-ann-indel', function(req, res) {
	    res.writeHead(200, {"Content-Type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive"});
		res.write("retry: 10000\n");
		
		analysePipeline.run_Step_ANN(res,[script_ANN,filesProcess[10],filesProcess[23],fileDB,filesProcess[22],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_ANN],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_ANN,function (er){
			if(er==1){
				filesProcessExist[22]=1;
				filesProcessExist[23]=1;
				filesProcessExist[24]=1;
				db.Action.findOneAndUpdate({_id:bigActionId[11]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Success" }}, function (error, action) {
					
				})
				Upload.uploadVCF("ANN_INDEL", filesProcess[22], sessionUser._id,path.basename(filesProcess[22]),(fs.statSync(filesProcess[22])).size, mime.lookup(filesProcess[22]) )
				Upload.uploadVCF("STAT_ANN_INDEL", filesProcess[24], sessionUser._id,path.basename(filesProcess[24]),(fs.statSync(filesProcess[24])).size, mime.lookup(filesProcess[24]) )
				
			} else{
				filesProcessExist[22]=0;
				filesProcessExist[23]=0;
				filesProcessExist[24]=0;
				db.Action.findOneAndUpdate({_id:bigActionId[11]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Error" }}, function (error, action) {
					
				})
			}
		});
		
		res.connection.addListener("close", function () {
		   console.log("ann......resClose");
		   clearInterval(res);
		   res.end();
		}, false);
	});
	
	app.get('/stream_dna-ann-del', function(req, res) {
	    res.writeHead(200, {"Content-Type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive"});
		res.write("retry: 10000\n");
		
		analysePipeline.run_Step_ANN(res,[script_ANN,filesProcess[12],filesProcess[26],fileDB,filesProcess[25],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_ANN],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_ANN,function (er){
			if(er==1){
				filesProcessExist[25]=1;
				filesProcessExist[26]=1;
				filesProcessExist[27]=1;
				db.Action.findOneAndUpdate({_id:bigActionId[12]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Success" }}, function (error, action) {
					
				})
				Upload.uploadVCF("ANN_DEL", filesProcess[25], sessionUser._id,path.basename(filesProcess[25]),(fs.statSync(filesProcess[25])).size, mime.lookup(filesProcess[25]) )
				Upload.uploadVCF("STAT_ANN_DEL", filesProcess[26], sessionUser._id,path.basename(filesProcess[26]),(fs.statSync(filesProcess[26])).size, mime.lookup(filesProcess[26]) )
				

			} else{
				filesProcessExist[25]=0;
				filesProcessExist[26]=0;
				filesProcessExist[27]=0;
				db.Action.findOneAndUpdate({_id:bigActionId[12]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Error" }}, function (error, action) {
					
				})
			}
		});
		
		res.connection.addListener("close", function () {
		   console.log("ann......resClose");
		   clearInterval(res);
		   res.end();
		}, false);
	});

	app.get('/stream_dna-ann-ins', function(req, res) {
	    res.writeHead(200, {"Content-Type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive"});
		res.write("retry: 10000\n");
		
		analysePipeline.run_Step_ANN(res,[script_ANN,filesProcess[13],filesProcess[29],fileDB,filesProcess[28],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_ANN],__dirname+ '/uploads/'+ sessionUser.userName+'/'+result_ANN,function (er){
			if(er==1){
				filesProcessExist[28]=1;
				filesProcessExist[29]=1;
				filesProcessExist[30]=1;
				db.Action.findOneAndUpdate({_id:bigActionId[13]}, {$set:{actionDateEnd: moment().format('MMMM Do YYYY, h:mm:ss a'), actionState: "Success" }}, function (error, action) {
					
				})
				Upload.uploadVCF("ANN_INS", filesProcess[28], sessionUser._id,path.basename(filesProcess[28]),(fs.statSync(filesProcess[28])).size, mime.lookup(filesProcess[28]) )
				Upload.uploadVCF("STAT_ANN_INS", filesProcess[30], sessionUser._id,path.basename(filesProcess[30]),(fs.statSync(filesProcess[30])).size, mime.lookup(filesProcess[30]) )
				
			} else{
				filesProcessExist[28]=0;
				filesProcessExist[29]=0;
				filesProcessExist[30]=0;
			}
		});
		
		res.connection.addListener("close", function () {
		   console.log("ann......resClose");
		   clearInterval(res);
		   res.end();
		}, false);
	});

	app.get('/download_dna-qc', function(req, res) {
		var file = __dirname +'/'+filesProcess[2];
		console.log("file "+file);
		
		var filename = path.basename(file);
		var mimetype = mime.lookup(file);
		res.setHeader('Content-disposition', 'attachment; filename=' + filename);
		res.setHeader('Content-type', mimetype);
		var stat = fs.statSync(file);
		res.writeHeader(200,{"Content-Length":stat.size});
		
		console.log("path "+file+" name "+filename+" contet "+mimetype+" size "+stat.size);
		var fReadStream = fs.createReadStream(file);
		fReadStream.pipe(res,filename);
	});

	app.get('/download_dna-al', function(req, res) {

		var file = __dirname +'/'+filesProcess[4];
		console.log("file "+file);
  
		var filename = path.basename(file);
		var mimetype = mime.lookup(file);
		res.setHeader('Content-disposition', 'attachment; filename=' + filename);
		res.setHeader('Content-type', mimetype);
		var stat = fs.statSync(file);
		res.writeHeader(200,{"Content-Length":stat.size});
		
		console.log("path "+file+" name "+filename+" contet "+mimetype+" size "+stat.size);
		var fReadStream = fs.createReadStream(file);
		fReadStream.pipe(res,filename);
	});

	app.get('/download_dna-cv', function(req, res) {

		var file = __dirname +'/'+filesProcess[5];
		console.log("file "+file);
  
		var filename = path.basename(file);
		var mimetype = mime.lookup(file);
		res.setHeader('Content-disposition', 'attachment; filename=' + filename);
		res.setHeader('Content-type', mimetype);
		var stat = fs.statSync(file);
		res.writeHeader(200,{"Content-Length":stat.size});
		
		console.log("path "+file+" name "+filename+" contet "+mimetype+" size "+stat.size);
		var fReadStream = fs.createReadStream(file);
		fReadStream.pipe(res,filename);
	});
	
	app.get('/download_dna-clb', function(req, res) {

		var file = __dirname +'/'+filesProcess[7];
		console.log("file "+file);
  
		var filename = path.basename(file);
		var mimetype = mime.lookup(file);
		res.setHeader('Content-disposition', 'attachment; filename=' + filename);
		res.setHeader('Content-type', mimetype);
		var stat = fs.statSync(file);
		res.writeHeader(200,{"Content-Length":stat.size});
		
		console.log("path "+file+" name "+filename+" contet "+mimetype+" size "+stat.size);
		var fReadStream = fs.createReadStream(file);
		fReadStream.pipe(res,filename);
	});

	app.get('/download_dna-pr-variant', function(req, res) {

		var file = __dirname +'/'+filesProcess[8];
		console.log("file "+file);
  
		var filename = path.basename(file);
		var mimetype = mime.lookup(file);
		res.setHeader('Content-disposition', 'attachment; filename=' + filename);
		res.setHeader('Content-type', mimetype);
		var stat = fs.statSync(file);
		res.writeHeader(200,{"Content-Length":stat.size});
		
		console.log("path "+file+" name "+filename+" contet "+mimetype+" size "+stat.size);
		var fReadStream = fs.createReadStream(file);
		fReadStream.pipe(res,filename);
	});
	
	app.get('/download_dna-pr-snp', function(req, res) {

		var file = __dirname +'/'+filesProcess[9];
		console.log("file "+file);
  
		var filename = path.basename(file);
		var mimetype = mime.lookup(file);
		res.setHeader('Content-disposition', 'attachment; filename=' + filename);
		res.setHeader('Content-type', mimetype);
		var stat = fs.statSync(file);
		res.writeHeader(200,{"Content-Length":stat.size});
		
		console.log("path "+file+" name "+filename+" contet "+mimetype+" size "+stat.size);
		var fReadStream = fs.createReadStream(file);
		fReadStream.pipe(res,filename);
	});

	app.get('/download_dna-pr-indel', function(req, res) {

		var file = __dirname +'/'+filesProcess[10];
		console.log("file "+file);
  
		var filename = path.basename(file);
		var mimetype = mime.lookup(file);
		res.setHeader('Content-disposition', 'attachment; filename=' + filename);
		res.setHeader('Content-type', mimetype);
		var stat = fs.statSync(file);
		res.writeHeader(200,{"Content-Length":stat.size});
		
		console.log("path "+file+" name "+filename+" content "+mimetype+" size "+stat.size);
		var fReadStream = fs.createReadStream(file);
		fReadStream.pipe(res,filename);
	});
	
	app.get('/download_dna-pr-cnv', function(req, res) {
		analysePipeline.run_error("tar", ["-cvzf",filesProcess[12],filesProcess[14],filesProcess[17]],function(e,r){});
		var file = __dirname +'/'+filesProcess[17];
		
		console.log("file "+file);
  
		var filename = path.basename(file);
		var mimetype = mime.lookup(file);
		res.setHeader('Content-disposition', 'attachment; filename=' + filename);
		res.setHeader('Content-type', mimetype);
		var stat = fs.statSync(file);
		res.writeHeader(200,{"Content-Length":stat.size});
		
		console.log("path "+file+" name "+filename+" content "+mimetype+" size "+stat.size);
		var fReadStream = fs.createReadStream(file);
		fReadStream.pipe(res,filename);
	});
	
	app.get('/download_dna-pr-sv', function(req, res) {
		analysePipeline.run_error("tar", ["-cvzf",filesProcess[12],filesProcess[13],filesProcess[14],filesProcess[15],filesProcess[16],filesProcess[18]],function(e,r){});
		var file = __dirname +'/'+filesProcess[18];
		console.log("file "+file);
  
		var filename = path.basename(file);
		var mimetype = mime.lookup(file);
		res.setHeader('Content-disposition', 'attachment; filename=' + filename);
		res.setHeader('Content-type', mimetype);
		var stat = fs.statSync(file);
		res.writeHeader(200,{"Content-Length":stat.size});
		
		console.log("path "+file+" name "+filename+" content "+mimetype+" size "+stat.size);
		var fReadStream = fs.createReadStream(file);
		fReadStream.pipe(res,filename);
	});

	app.get('/download_dna-ann-snp', function(req, res) {

		var file = __dirname +'/'+filesProcess[19];
		console.log("file "+file);
  
		var filename = path.basename(file);
		var mimetype = mime.lookup(file);
		res.setHeader('Content-disposition', 'attachment; filename=' + filename);
		res.setHeader('Content-type', mimetype);
		var stat = fs.statSync(file);
		res.writeHeader(200,{"Content-Length":stat.size});
		
		console.log("path "+file+" name "+filename+" content "+mimetype+" size "+stat.size);
		var fReadStream = fs.createReadStream(file);
		fReadStream.pipe(res,filename);
	});
	
	app.get('/download_dna-ann-indel', function(req, res) {

		var file = __dirname +'/'+filesProcess[22];
		console.log("file "+file);
  
		var filename = path.basename(file);
		var mimetype = mime.lookup(file);
		res.setHeader('Content-disposition', 'attachment; filename=' + filename);
		res.setHeader('Content-type', mimetype);
		var stat = fs.statSync(file);
		res.writeHeader(200,{"Content-Length":stat.size});
		
		console.log("path "+file+" name "+filename+" content "+mimetype+" size "+stat.size);
		var fReadStream = fs.createReadStream(file);
		fReadStream.pipe(res,filename);
	});

	app.get('/download_dna-ann-del', function(req, res) {

		var file = __dirname +'/'+filesProcess[25];
		console.log("file "+file);
  
		var filename = path.basename(file);
		var mimetype = mime.lookup(file);
		res.setHeader('Content-disposition', 'attachment; filename=' + filename);
		res.setHeader('Content-type', mimetype);
		var stat = fs.statSync(file);
		res.writeHeader(200,{"Content-Length":stat.size});
		
		console.log("path "+file+" name "+filename+" content "+mimetype+" size "+stat.size);
		var fReadStream = fs.createReadStream(file);
		fReadStream.pipe(res,filename);
	});
	
	app.get('/download_dna-ann-ins', function(req, res) {

		var file = __dirname +'/'+filesProcess[28];
		console.log("file "+file);
  
		var filename = path.basename(file);
		var mimetype = mime.lookup(file);
		res.setHeader('Content-disposition', 'attachment; filename=' + filename);
		res.setHeader('Content-type', mimetype);
		var stat = fs.statSync(file);
		res.writeHeader(200,{"Content-Length":stat.size});
		
		console.log("path "+file+" name "+filename+" content "+mimetype+" size "+stat.size);
		var fReadStream = fs.createReadStream(file);
		fReadStream.pipe(res,filename);
	});
	

	app.get("/", function (req, res) {
		res.render("pageAcceuil");
	});
	
	var LineByLineReader = require('line-by-line');
	var monObjet=[];
	
	app.post("/GffData",upload.array('file', 12), function (req, res) {
		console.log("this is the request : ", req.body);
		Upload.readParseGFF(req, res, sessionUser._id)
		// fs.readFile(req.files[0].path, function (err, data) {
		// 	if (err) {
		// 		throw err; 
		// 		res.send("ERROR");
		// 	} else {
		// 		console.log("renaming ...");
		// 		// fc.move (req.file.path, 'uploads/' + req.file.originalname, function (err) {
		// 		//     if (err) { throw err; }
		// 		//     console.log ("Moved 'foo.txt' to 'bar.txt'");
		// 		// });
		// 		//fs.renameSync( req.file.path, 'uploads/test' )
		// 		var objectFromGFF = [];
		// 		var lr = new LineByLineReader('uploads/'+  req.files[0].filename );
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
		// 				    var line2 = (line).split(/\s/);
		// 				    lr.pause();
		// 				    setTimeout(function () {
						    	
		// 					    if (line2[2] =="CDS") {
		// 					    	line2.splice(1,1);
		// 					    	line2.splice(4,3)
		// 					    	objectFromGFF.push(line2);
		// 					    	i++;
		// 					    	// console.log(i);			    
		// 					    }else {
		// 					    	if (line2[0]==='##FASTA') {
		// 					    		lr.close();
		// 					    	}
		// 					    }
		// 				        // ...and continue emitting lines.
		// 				        lr.resume();
		// 				    }, 0.000000000001);   
		// 				});
		// 				callback();
		// 			}, function (callback) {
		// 				console.log("finished reading ...")
		// 				lr.on('end', function () {
		// 					console.log('the object is ready and lenght  : ',objectFromGFF.length);
		// 					res.send(objectFromGFF);
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
		// });	
	})
	
	//CNV Treatment
	app.post('/CnvData', upload.array('file',12), function (req, res) {
		console.log("this is the request : ", req.body);
		var l = req.files.length
		var finalResults = []
		Upload.readParseCNV(req, res, sessionUser._id)
	})

	//SNP Treatment
	app.post("/SnpData", upload.array('file',12), function (req, res) {
		console.log("this is the request : ", req.body);
		Upload.readParseSNP(req, res, sessionUser._id)
	})

	//INDELs Treatment
	app.post("/IndelData", upload.array('file',12), function (req, res) {
		Upload.readParseINDEL(req, res, sessionUser._id)

	})
	var newUser= {}
	app.post("/signup", function (req, res) {
		newUser = {
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
						//we send to the user the fact that he has to verify his mail: 
						rand=Math.floor(((Math.random() * 99999999999999) + 1));
						host=req.get('host');
					    link="http://"+req.get('host')+"/LeishSIC/verify?id="+rand;
					    mailOptions={
					        to : req.body.email,
					        subject : "LeishSIC :Please confirm your Email account",
					        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
					    }
					    smtpTransport.sendMail(mailOptions, function(error, response){
						     if(error){
						            console.log(error);
						        res.status.send("error");
						     }else{
						            console.log("Message sent: " + response.message);
						            res.status(200).send({
										message: "SUCCESS"
									});
						        
						     }
						});
					}
				})
			}
		})
	})

	app.get('/LeishSIC/verify',function(req,res){
		if((req.protocol+"://"+req.get('host'))==("http://"+host))
		{
		    console.log("Domain is matched. Information is from Authentic email");
		    if(req.query.id==rand)
		    {
		        console.log("email is verified");
	        //THIS PART WHEN WE VERIFY THE EMAIL
				db.User.createSecure(newUser.firstName, newUser.lastName, newUser.userName, newUser.password, newUser.email, function (error, newU) {
					if (error) {
						res.send("error")
					} else {
						console.log("the NEW USER IS : ", newU)
						//req.session.user = newU;
						sessionUser = newU;
						userPath = userPath+ sessionUser.userName
						//req.session._id= newU._id;
						res.render("pageAcceuil")
					}
				})
		        
		    }
		    else
		    {
		        console.log("email is not verified");
		        res.render("pageAcceuil")
		    }
		}
		else
		{
		    res.render("pageAcceuil")
		}
	});

	app.post("/login", function (req, res) {
		var user = {
			email : req.body.email,
			pass  : req.body.password
		}
		db.User.authenticate(user.email, user.pass, function (msg, response) {
			if (msg === 'wrong email') {
				console.log("wrong email")
				res.send({message :"wrong email"})
			}  else if (msg === "Error: incorrect password") {
				console.log("wrong password")
				res.send( {message: "wrong password"})
			}else {
				console.log("login response", response)
				sessionUser = response;
				userPath = userPath+ sessionUser.userName
				res.json({user : response})
			}
		})
	})

	app.get("/logout", function (req, res) {
		//on the logout we have to destroy the files existing in the fs.files and fs.chunk
		var id = sessionUser._id
		analysePipeline.run_error("rm",["-r", "./uploads/" + sessionUser.userName], function (err, arg2) {
			// body...
		})
		sessionUser =null;
		Upload.destroy(req,id, res);
	})

	//getting the current user
	app.get("/current_user", function (req, res) {
		var user = sessionUser;
		
		res.status(200).json({user : user})
	})

	//getting user historique
	app.get("/current_user/Historique", function (req, res) {

		db.Historique.findOne({_user: sessionUser._id}).populate("fileInformation").exec(function (error, historique) {
			if (error) {
				return res.status(500).send( {
	        		message: "Error"
	        	})
			} else if (historique) {
				return res.status(200).send( {
	        		message: historique
	        	})
			} else {
				return res.status(200).send( {
	        		message: "Empty"
	        	})
			}
		})
		
	})

	//getting user current uploaded files
	app.get("/current_user/files", function (req, res) {
		db.Temp.find({_user: sessionUser._id}, function(error, temp) {
			if (error) {
				return res.status(400).send({
					message:"Error"
				})
			} else {
					return res.status(200).send({
						message:temp
					})
				
			}
		})
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
		if (sessionUser !== null) {
			if (req.params.userName === sessionUser.userName) {
				console.log("page envoyée")
				reinitFiles( function(filesNames,filesExist,gz,nbSAM){
					filesProcess=filesNames;
					filesProcessExist=filesExist;
					isGZ=gz;
					nbSeqSAM = nbSAM;
				})
				res.render('upload');
			} else {
				res.render("ErrorForbidden")
			}

		} else {
			res.render("ErrorForbidden")
		}
	})

	var destDir;
	app.post("/:userName/upload/files",uploadD.any(), function (req, res) {
		console.log("Headers ARE:", req.headers)
		console.log("FILES ARE:", req.files)
		console.log("the other inputs : ", req.body)
		var l = req.files.length;
		if (sessionUser.userName !== req.params.userName) {
			res.render("ErrorForbidden")
		} else {
			for (var i =0; i< l ; i++) {
				Upload.create(req,i, sessionUser._id, res);
			}
			if (req.body.selectValue.constructor !== Array) {
				var type = req.body.selectValue;
				// if (type === "Fastq") {
				// 	filesProcess[1] = req.files[0].path;
				// 	filesProcessExist[1] = 1;
				// } else {
				if (type === "Fasta") {
					filesProcess[0] =  req.files[0].path;
					filesProcessExist[0] = 1;
				}
			} else {
				for (var i =0; i< l ; i++) {
					var type = req.body.selectValue[i];
					// if (type === "Fastq") {
					// 	filesProcess[1] = req.files[i].path;
					// 	filesProcessExist[1] = 1;
					// } else {
					if (type === "Fasta") {
						filesProcess[0] = req.files[i].path;
						filesProcessExist[0] = 1;
					}
				}
			}
		}
	})

	//////////////////////////////////////////////////////////////
				/*FASTQ FILE SOCKET TREATMENT*/
	var Files = {};
		io.sockets.on('connection', function (socket) {
		    socket.on('Start', function (data) { //data contains the variables that we passed through in the html file
			        var Name = data['Name'];
			        Files[Name] = {  //Create a new Entry in The Files Variable
			            FileSize : data['Size'],
			            Data     : "",
			            Downloaded : 0
			        }
			        var Place = 0;
			        try{
			            var Stat = fs.statSync('uploads/'+sessionUser.userName+'/' +  Name);
			            if(Stat.isFile())
			            {
			                Files[Name]['Downloaded'] = Stat.size;
			                Place = Stat.size / 524288;
			            }
			        }
			        catch(er){} //It's a New File
			        //we create the folder : 
			        destDir="./uploads/" +sessionUser.userName ;
						if(!fs.existsSync(destDir)){
							fs.mkdirSync( destDir)	
						}
			        fs.open(destDir +'/' + Name, "a", 0755, function(err, fd){
			            if(err)
			            {
			                console.log(err);
			            }
			            else
			            {
			                Files[Name]['Handler'] = fd; //We store the file handler so we can write to it later
			                socket.emit('MoreData', { 'Place' : Place, Percent : 0 });
			            }
			        });
			});

			socket.on('Upload', function (data){
		        var Name = data['Name'];
		        Files[Name]['Downloaded'] += data['Data'].length;
		        Files[Name]['Data'] += data['Data'];
		        if(Files[Name]['Downloaded'] == Files[Name]['FileSize']) //If File is Fully Uploaded
		        {
		            fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
		                //Get Thumbnail Here
		                socket.emit('Done',{ 
		                	Percent : 100 
			            });
			            filesProcess[1]= destDir +'/'+ Name;
			                filesProcessExist[1]=1;
			                var fileInfo= {
			                	originalname:Name,
			                	path: destDir +'/'+ Name,
			                	size: Files[Name]['FileSize'],
			                }
			                console.log(fileInfo)
			                Upload.createFastq(fileInfo, sessionUser._id)
		                
		            });

		        }
		        else if(Files[Name]['Data'].length > 10485760){ //If the Data Buffer reaches 10MB
		            fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
		                Files[Name]['Data'] = ""; //Reset The Buffer
		                var Place = Files[Name]['Downloaded'] / 524288;
		                var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
		                socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
		            });
		        }
		        else
		        {
		            var Place = Files[Name]['Downloaded'] / 524288;
		            var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
		            socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
		        }
		    });
		});

	//////////////////////////////////////////////////////////////

	//getting the files info for the select form in the analyze page
	app.get("/getFilesInfo/:userId", function (req, res) {
		Upload.read(req, sessionUser._id, res)
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

 server.listen(process.env.PORT || 80, function () {
		console.log("listening on port 80 ... success :)");
		
	});

	// module.exports =server;