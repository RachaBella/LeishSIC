'use strict'
/*** Execute the command 'cmd' with the aguments 'args' in Linux ***/
function run(cmd,args,callback) {
    var spawn = require('child_process').spawn;
    var command = spawn(cmd,args);

    var result = '';

    command.stdout.on('data', function(data) {
         result += data.toString();
    });
	
    command.on('close', function(code) {
        callback(result);
    });
}
function run_error(cmd,args,callback) {
    var spawn = require('child_process').spawn;
    var command = spawn(cmd,args);

    var result = '',
		error = '';

    command.stdout.on('data', function(data) {
         result += data.toString();
    });
	
	command.stderr.on('data', function(data) {
         error += data.toString();
    });
	
    command.on('close', function(code) {
        callback(result,error);
    });
}


/*** Formatting functions ***/
//Tool: FASTQC
//Update the state and the percentage of the step
function read_Fastqc(data, percent,callback){
		
	    console.log('received data: ' + data);
		var lines = data.trim().split('\n');
		var lastLine = lines.slice(-1)[0];
		var state="Processing...";
		
		if(typeof lastLine !== 'undefined' && lastLine){
			var words = lastLine.replace(/[.,?!;()"'-]/g, " ").replace(/\s+/g, " ").split(" ");
			if(words[0]=="Approx"){
				var per=(words[1].split('%'))[0];
				percent=Number(per);
				state="Processing the file...";
			        console.log('received data (firstword): '+words[0]+" second "+words[1]+" per "+percent);
			}
		}
		callback(percent,state);
}
//Get the error at the end of the execution of the step (if there's one)
function read_Fastqc_Error(data, callback){
	
	var error= null;
	
		if((data == null || data=="" || typeof data === 'undefined')){
			error="The processing of the files did not start or is aborted. Possible problem with the server.";

		} else {
			var lines = data.trim().split('\n');
			var lastLine = lines.slice(-1)[0];
			

			if(typeof lastLine !== 'undefined' && lastLine){
				var words = lastLine.replace(/[,?!;()"'-]/g, " ").replace(/\s+/g, " ").split(" ");

				if(words[1]=="at" || words[1]=="At"){
					error="Failed to process the fastq file . The file is either empty or not a standard fastq type. Please Reload it.";

				}else if(words[0]=="Skipping"){
					error="The file fastq couldn't be found or can't be read. Please reload it.";
				} else {
					error=null;
				}
			} else {
				error=null;
			}
		}
		console.log('received data (error): '+error);
		callback(error);
		
}

//Tool: Bwa
//Update the state and the percentage of the step
function read_Bwa(data, nbRead, totalRecord, percent, callback){
	var lines = data.trim().split('\n');
    var lastLine = lines.slice(-1)[0];
	var state="Processing...";
	
	console.log("received data (last): "+lastLine);
	if(typeof lastLine !== 'undefined' && lastLine){
		var words = lastLine.replace(/[.,?!;()"'-]/g, " ").replace(/\s+/g, " ").split(" ");
		if(words[0]=="[M::process]"){
			totalRecord=totalRecord+Number(words[2]);
			state=totalRecord+" reads processed...";
			console.log("received data (last-mprocess records): "+totalRecord);
			if(nbRead!=0){
				percent=(totalRecord*100)/nbRead;
				percent=parseFloat(percent.toFixed(1));
			}
		}
	}
	callback(totalRecord,percent,state);
}
//Get the error at the end of the execution of the step (if there's one)
function read_Bwa_Error(data, callback){
	var error= null;
	console.log("data error: "+data);
		if((data == null || data=="" || typeof data === 'undefined')){
			error="The processing of the files did not start or is aborted. Possible problem with the server.";
		} else {
			var lines = data.trim().split('\n');
			var lastLine = lines.slice(-1)[0];
			if(typeof lastLine !== 'undefined' && lastLine){
				var words = lastLine.replace(/.,?!;()"'-/g, " ").replace(/\s+/g, " ").split(" ");
				if(words[0]=="[bwa_index]"){
					error="Failed to index the file. The file is either empty or not a standard fasta type. Please Reload it.";
				} else if(words[0]=="[bwa_idx_build]"){
					error="The file fasta couldn't be found or can't be read. Please load it.";
				} else if(words[0]=="[E::bwa_idx_load_from_disk]"){
					error="The fasta file is either not existent or not indexed. Please Repeat this step.";
				} else if (words[0]=="[E::main_mem]"){
					error="The file fastq is not existent. Please Reload it."
				} else if(words[0]=="[main]"){
					var lineThree=lines.slice(-4)[0];
					var words2 = lineThree.replace(/.,?!;()"'-/g, " ").replace(/\s+/g, " ").split(" ");
					if(words2[0]=="[M::mem_process_seqs]" || words2[0]=="[M::process]" || words2[0]=="[bwa_index]"){
						error=null;
					} else{
						error="Failed to process the file fastq. The file is either empty or r not a standard fastq type. Please Reload it."
					}
				}  else if(words[0]=="bwa:"){
					error="Failed to process the file fastq. Please Repeat this step."
				} else {
					error=null;
				}
				
			} else {
				error=null;
			}
		}
		console.log("data error (error): "+error);
		callback(error);
}

//Tool: Faidx
//Get the error at the end of the execution of the step (if there's one)
function read_FAI_Error(data, callback){
	var error= null;
	console.log("data error: "+data);
		if((data == null || data=="" || typeof data === 'undefined')){
			error=null;
		} else {
			var lines = data.trim().split('\n');
			var lastLine = lines.slice(-1)[0];
			if(typeof lastLine !== 'undefined' && lastLine){
				var words = lastLine.replace(/.,?!;()"'-/g, " ").replace(/\s+/g, " ").split(" ");
				if(words[0]=="Failed"){
					error=lastLine+" The file couldn't be found or can't be read or is not a standard fasta. Please Reload it."; 
				}  else if (words[0]=="Usage"){
					error="The command is not found please ask the administrator to check the script script_INDEX_FAI.";
				}  else {
					error="Failed to index the file. Please Reload it."; 
				}
				
			} else {
				error="Failed to index the file. Please Reload it.";
			}
		}
		console.log("data error (error): "+error);
		callback(error);
}

//Tool: Picard
//Update the state and the percentage of the step
function read_PICARD_CV(data, nbRead, totalRecord, percent,callback){
	var lines = data.trim().split('\n');
    var lastLine = lines.slice(-1)[0];
	var state="Processing...";
	
	console.log("received data (last): "+lastLine);
	if(typeof lastLine !== 'undefined' && lastLine){
		var words = lastLine.replace(/[.,?!;()"']/g, " ").replace(/\s+/g, " ").split(" ");
		console.log('received data (last_word): '+ words[0]+ " fifth : "+ words[4]);
		if(words[0]=="INFO" && words[4]!="Finished"){
			var i=5;
			var totalRecordString="";
			while (words[i]!="records"){
				totalRecordString=totalRecordString+words[i];
				i++;
			}
			totalRecord=Number(totalRecordString);
			if(nbRead!=0){
				if(words[4]=="Read"){
					percent=(totalRecord*100)/(nbRead*2);
					state=totalRecord+" records are read and processed...";
				} else if (words[4]=="Wrote"){
					percent=((totalRecord*100)/(nbRead*2))+50;
					state=totalRecord+" records are written...";
				}
				percent=parseFloat(percent.toFixed(1));
			} else {
				if(words[4]=="Read"){
					state=totalRecord+" records are read and processed...";
				} else if (words[4]=="Wrote"){
					state=totalRecord+" records are written...";
				}
			}
		} else if(words[0]=="INFO" && words[4]=="Finished"){
			percent=50;
			state=nbRead+" records are read and processed...";
			//console.log('received data (percent finished): '+ percent "+percent);
		}
	}
	console.log('received data (percent): '+percent);
	callback(totalRecord,percent,state);
}
//Update the state and the percentage of the step
function read_PICARD_MarkDup(data, nbRead, totalRecord, percent,callback){
	var lines = data.trim().split('\n');
    var lastLine = lines.slice(-1)[0];
	var state="Processing...";
	
	console.log('received data (last): '+ lastLine);
	if(typeof lastLine !== 'undefined' && lastLine){
		var words = lastLine.replace(/[.,?!;()"']/g, " ").replace(/\s+/g, " ").split(" ");
		console.log('received data (lastword ): '+ words[0] +" fifth "+words[4]);
		 if(words[0]=="INFO" && words[4]=="Written"){
			var i=5;
			var totalRecordString="";
			while (words[i]!="records"){
				totalRecordString=totalRecordString+words[i];
				i++;
			}
			totalRecord=Number(totalRecordString);
			state=totalRecord+" records are written...";
			if(nbRead!=0){
				percent=(((totalRecord*100)/nbRead)*(133/1000))+4.4;
				percent=parseFloat(percent.toFixed(1));
			}
		} else if(words[0]=="INFO" && (words[4]=="Found" || words[4]=="Marking" || words[4]=="Sorting" || words[4]=="Reads" || words[4]=="Traversing")){
			percent=4.4;
			state="Finished reading and finding duplicates...";
		} else if(words[0]=="INFO" && words[4]=="Read"){
			var i=5;
			var totalRecordString="";
			while (words[i]!="records"){
				totalRecordString=totalRecordString+words[i];
				i++;
			}
			totalRecord=Number(totalRecordString);
			state=totalRecord+" records are read...";
		}
	}
	console.log('received data (percent ): '+ percent +" total "+totalRecord);
	callback(totalRecord,percent,state);
}
//Get the error at the end of the execution of the step (if there's one)
function read_PICARD_Error(data, callback){
	var error =null; 
	console.log("data error: "+data);
	if((data == null || data=="" || typeof data === 'undefined')){
		error="The processing of the files did not start or is aborted. Possible problem with the server.";
	} else {
		var lines = data.trim().split('\n');
		var lastLine = lines.slice(-1)[0];
		
		if (typeof lastLine !== 'undefined' && lastLine){
			var words = lastLine.replace(/[.,?!;()"']/g, " ").replace(/\s+/g, " ").split(" ");
			var firstWord=(words[0].split("."))[0];
			if(firstWord=="Runtime"){
				error=null;
			} else if (words[0]=="at" || words[1]=="at" || words[0]=="Exception" || words[0]=="Line" || words[0]=="Caused" || (words[0]=="To" && words[1]=="get") || words[0]=="..."){
				error="Failed to process the file. The file is either not existent or malformed. Please Repeat the step (or steps) above.";
			} else{
				error=null;
			}
		}
		else{
			error=null;
		}
	}
	console.log("data error (error): "+error);
	callback(error);
}

//Tool: GATK
//Update the state and the percentage of the step
function read_GATK(data, percent,init,phase,callback){
	var lines = data.trim().split('\n');
    var lastLine = lines.slice(-1)[0];
	var state="Processing...";
	
	console.log("received data (last): "+lastLine);
	if(typeof lastLine !== 'undefined' && lastLine){
		var words = lastLine.replace(/[?!;()"']/g, " ").replace(/\s+/g, " ").split(" ");
		console.log("received data (lastwords): "+words[0]+" third "+words[2]+" fifth "+words[4]);
		 if(words[0]=="INFO" && words[2]=="ProgressMeter" && words[4]!="Location" && words[4]!="|" && words[4]!="Total" && words[4]!="[INITIALIZATION COMPLETE" && words[4]!="[INITIALIZATION"){
			var per=words[10];
			var percentString=(per.split('%'))[0];
			var percentFile=Number(percentString);
			if(percentFile==100 && words[4]!="Done"){
					percentFile = 99.9;
			} 
			percent=((percentFile)*phase)+init;
			percent=parseFloat(percent.toFixed(1));
			state=words[5]+" reads processed ...";
		} 
	}
	console.log("received data (percent): "+percent);
	callback(percent,state);
}
//Get the error at the end of the execution of the step (if there's one)
function read_GATK_Error(data, callback){
	var error =null;
	
	console.log("error (data): "+data);
	if((data == null || data=="" || typeof data === 'undefined')){
		error="The processing of the files did not start or is aborted. Possible problem with the server.";
	} else {
		var lines = data.trim().split('\n');
		var lastLine = lines.slice(-1)[0];
		console.log("error (data-last): "+lastLine);	
		if (typeof lastLine !== 'undefined' && lastLine){
			var words = lastLine.replace(/[.,?!;()"']/g, " ").replace(/\s+/g, " ").split(" ");
			console.log("error (data-last-word): "+words[1]);
			if(words[1]=="ERROR" ){
				var isMsgError=false;
				var j=-2;
				while(!isMsgError){
					lastLine = lines.slice(-j)[0];
					console.log("error (data-avantlast): "+lastLine);
					
					words = lastLine.replace(/[.,?!;()"']/g, " ").replace(/\s+/g, " ").split(" ");
					if(words[2]=="MESSAGE:" || words[2]=="MESSAGE" || words[2]=="Message" || words[2]=="Message:"){
						isMsgError=true;
						var i=3;
						var totalRecordString="";
						var stop=false;
						while (words.length>i && !stop){
							if(words[i]=="Please" && (words[i+1]=="see" || words[i+1]=="add")){
								stop=true;
							} else{
								totalRecordString=totalRecordString+words[i]+" ";
								i++;
							}
						}
						if(stop){
							error=totalRecordString+". Please repeat the step (or steps) above.";
						} else{
							lastLine =lastLine.replace("##### ERROR MESSAGE: ","");
							error=lastLine+" Please repeat the step (or steps) above.";
						}
					}else{
						j++;
					}
				}
			} else{
				error=null;
			}
		}
		else{
			error=null;
		}
	}
	console.log("error (error): "+error);
	callback(error);
}


//Tool: Delly
//Update the state and the percentage of the step
function read_Delly(data, percent,phase, init,callback){
		
	    console.log('received data: ' + data);
		var lines = data.trim().split('\n');
		var lastLine = lines.slice(-1)[0];
		var lastLine4 = lines.slice(-5)[0];
		var state="Processing...";
		
		if(typeof lastLine !== 'undefined' && lastLine){
			var words = lastLine.replace(/[.,?!;()"']/g, " ").replace(/\s+/g, " ").split(" ");
			var words4 = lastLine4.replace(/[.,?!;()"']/g, " ").replace(/\s+/g, " ").split(" ");
			console.log('received data (firstword):'+words[0][0]+" second "+words4[3]+" "+lastLine4);
			if(words[0][0]=="*" && words4[3]=="clustering"){
				var per=((words[0]).length)-2;
				if(Number(per)<0){
					per=0;
				}
				var percentFile=(Number(per))*2;
				percent=((percentFile)*phase)+init;
				percent=parseFloat(percent.toFixed(1));
				state="Processing the files...";
			        console.log('received data (firstword): '+words[0]+" second "+words4[3]+" per "+percent);
			}
		}
		callback(percent,state);
}
//Get the error at the end of the execution of the step (if there's one)
function read_Delly_Error(data,callback){
	
	var error= null;
	var hasSV = false;
	
		if((data == null || data=="" || typeof data === 'undefined')){
			error="The processing of the files did not start or is aborted. Possible problem with the server.";

		} else {
			var lines = data.trim().split('\n');
			var lastLine = lines.slice(-1)[0];
			var lastLine2 = lines.slice(-2)[0];
			

			if(typeof lastLine !== 'undefined' && lastLine){
				var words = lastLine.replace(/[,?!;()"']/g, " ").replace(/\s+/g, " ").split(" ");
				var words2 = lastLine2.replace(/[,?!;()"']/g, " ").replace(/\s+/g, " ").split(" ");

				if(words[0]=="Fail" ){
					if(words[2]=="index"){
						error="Failed to process the BAM file . The file is not indexed. Please Repeat this step.";
						hasSV = false;
					} else{
						error="Failed to process the fasta file . The file is not a standard fasta type. Please Reload it.";
						hasSV = false;
					}

				}else if(words[0]=="BAM"){
					error="Failed to process the fasta file . The file is not a standard fasta type. Please Reload it.";
					hasSV = false;
				}else if(words[0]=="Alignment"){
					error="Failed to process the BAM file . The file couldn't be found or can't be read or is empty. Please Repeat the Alignment Step.";
					hasSV = false;
				} else if(words[0]=="Reference"){
					error="The file fasta couldn't be found or can't be read or is empty. Please reload it.";
					hasSV = false;
				}else if(words[0]=="Done" || words[0]=="Done."){
					if(words2[0]=="No"){
						hasSV = false;
					} else{
						hasSV = true;
					}
					error=null;
					
				} else if(words[2]=="Done" || words[2]=="Done."){
					if(words2[0]=="No"){
						hasSV = false;
					} else{
						hasSV = true;
					}
					error=null;
				} else {
					error=null;
					hasSV = true;
				}
			} else {
				error=null;
				hasSV = false;
			}
		}
		console.log('received data (error): '+error);
		callback(error,hasSV);
		
}


//Tool: SnpEff
//Update the state and the percentage of the step
function read_SnpEff(data, percent,callback){
		
	    console.log('received data: ' + data);
		var state="Processing...";
		var tabDone= data.match(/done/gi);
		var tabRead= data.match(/reading/gi);
		var tabBuild= data.match(/building/gi);
		var tabCreate= data.match(/creating/gi);
		var tabGene= data.match(/genome/gi);
		var percentDone=0;
		var percentRead=0;
		var percentBuild=0;
		var percentCreate=0;
		var percentGene=0;
		var percentAll=0;
		
		if(tabDone !=null){
			percentDone=tabDone.length;
		}
		if(tabRead !=null){
			percentRead=tabRead.length;
		}
		if(tabBuild !=null){
			percentBuild=tabBuild.length;
		}
		if(tabCreate !=null){
			percentCreate=tabCreate.length;
		}
		if(tabGene !=null){
			percentGene=tabGene.length;
		}
		percentAll = percentDone+percentRead+percentBuild+percentCreate+percentGene;
		
		percent= percentAll;
		if(percent >=100){
			percent =99;
		}
		
		if (percent<10){
			state="Reading from DataBase...";
		} else if (percent<40){
			state="Predicting Variants...";
		} else if (percent<70){
			state="Building Sequences...";
		} 
		
		callback(percent,state);
}
//Get the error at the end of the execution of the step (if there's one)
function read_SnpEff_Error(data,callback){
	
	var error= null;
	
		if((data == null || data=="" || typeof data === 'undefined')){
			error="The processing of the files did not start or is aborted. Possible problem with the server.";

		} else {
			var lines = data.trim().split('\n');
			var lastLine2 = lines.slice(-2)[0];
			var lastLine3 = lines.slice(-3)[0];
			
			if(typeof lastLine3 !== 'undefined' && lastLine3){

				var words2 = lastLine2.replace(/[,?!;()"']/g, " ").replace(/\s+/g, " ").split(" ");
				var words3 = lastLine3.replace(/[,?!;()"']/g, " ").replace(/\s+/g, " ").split(" ");
				console.log('received data (error-words): '+lastLine3+" 33333333 "+words3[1]);

				if(words3[1]!=="done." && words3[1]!=="done" && words3[1]!=="Done" && words3[1]!=="Done."){
					console.log('received data (error-wordsIF): '+lastLine2+" 2222222222 "+words2[0]);
					if(words2[1]!="at"){
											error="Failed to process the VCF file . The file couldn't be found or can't be read. Please Repeat the step above.";
					} else{
						error="Failed to load the annotation DataBase.";
					}
				}else {
					error=null;

				}
				
			} else {
				error=null;

			}
		}
		console.log('received data (error): '+error);
		callback(error);
		
}


/*** Principal functions ***/
//Step: Quality Control, Tool: FASTQC
//run_Step_QC(res,[script_QC,fileFastq,fileHtml,result_QC],result_QC,callback);
function run_Step_QC(){
	
	var errorProcess= null;
	var percent=0;
	var fs = require('fs');
	var repeat=true;
	//Arguments
	var res = arguments[0];
	var scriptStep = arguments[1];
	var filePath = arguments[2];
	var callback = arguments[3];
	
	run_error("rm",[filePath],function(r,e){});
	//Run the script of the step
	run("bash", scriptStep, function(result){
	//When finishing the execution of the script
		repeat=false;
		fs.access(filePath, fs.F_OK, function(err) {
			if (!err) {
				fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
					if(!err){
						read_Fastqc_Error(data, function (errorProcess){
							//If there isn't an error
							if(errorProcess==null){
								percent=100;
								console.log("fQC 100");
								
								//HTML
								//finishProcessing(id,percent,"Finished with success...",false);
								res.write("data: " + percent +" StateA "+"Finished with success..."+"\n\n");
								callback(1);
							}
							else{
							//There was an error
								percent=1000;
								//HTML
								//finishProcessing(id,percent,"ERROR...<br>"+errorProcess,true);
								res.write("data: " + percent +" StateA "+"ERROR...<br>"+errorProcess+"\n\n");
								console.log("fQC Error: "+errorProcess+" percent "+percent);
								callback(0);
							}
						});
					}
					else{
						//HTML3
						percent=1000;
						res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
						console.log(err);
					}
				});
				fs.unwatchFile(filePath);
			} else{
				//HTML3
				percent=1000;
				res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
					console.log(err);
			}
		});
	});
	//Update the progressBar and the state
	var percentCalcule=function(){
		fs.access(filePath, fs.F_OK, function(err) {
			if (!err && repeat) {
				fs.watchFile(filePath, (curr, prev) => {
					fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
						if(!err){
							read_Fastqc(data, percent, function (percentResult,state){
								//HTML
								percent=percentResult;
								//updateProcessing(id,percent,state);
								res.write("data: " + percent +" StateA "+state+"\n\n");
								console.log(percent);
							});
						}
						else{
							//HTML3
							res.write("data: " + percent +" StateA "+"Can't get the state of execution now."+"\n\n");
							console.log(err);
						}
					});
				});
			} else if(repeat){
				percentCalcule();
			}
		});
	};
	percentCalcule();
}

//Step: Alignment, Tool: Bwa/Picard/Faidx
//run_Step_ALN(res,[script_INDEX_BWA,fileFasta],[fileDict],[script_DICT_FA,fileFasta,fileDict],[script_INDEX_FAI,fileFasta],
//[script_ALN,fileFasta,fileFastq,fileSAM,result_ALN],result_ALN,[script_NREAD,isGZ,fileFastq], callback);
function run_Step_ALN(){
	var errorProcess= null;
    //Arguments
	var res = arguments[0];
	var scriptStep1 = arguments[1];
	var scriptStep2_1 = arguments[2];
	var scriptStep2_2 = arguments[3];
	var scriptStep3 = arguments[4];
	var scriptStep4 = arguments[5];
	var filePath = arguments[6];
	var scriptNb = arguments[7];
	var callback = arguments[8];
	
	run_error("rm",[filePath],function(r,e){});

	//Run the script of the step
		//1.Index fasta with BWA
		//updateProcessing(id,0,"Indexing the fasta file with bwa...");
		res.write("data: " + 0 +" StateA "+"Indexing the fasta file with bwa..."+"\n\n");
		run_error("bash",scriptStep1,function(result,error){
		//When finishing the execution of the script: index bwa
			console.log("result:\n"+result);
			console.log("error:\n"+error);
			//updateProcessing(id,0,"Finished indexing the fasta file with bwa with success...");
			res.write("data: " + 0 +" StateA "+"Finished indexing the fasta file with bwa with success..."+"\n\n");
			read_Bwa_Error(error, function (errorIndex){
				//If there isn't an error with index bwa
				if(errorIndex==null){
					console.log("aln percent "+null);
					//2. Create fasta dictionary
					//remove the file if it exists (avoid problem with Picard)
					run_error("rm", scriptStep2_1, function(result,error){ 
						console.log("resultRM:\n"+result);
						console.log("errorRM:\n"+error);
						//updateProcessing(id,0,"Creating the dictionary file of the fasta with Picard...");
						res.write("data: " + 0 +" StateA "+"Creating the dictionary file of the fasta with Picard..."+"\n\n");
						run_error("bash",scriptStep2_2,function(result,error){
							//When finishing the execution of the script: Create fasta dictionary
							console.log("result:\n"+result);
							console.log("error:\n"+error);
							//updateProcessing(id,0,"Finished creating the dictionary file of the fasta file with success...");
							res.write("data: " + 0 +" StateA "+"Finished creating the dictionary file of the fasta file with success..."+"\n\n");
							read_PICARD_Error(error, function (errorIndex){
								//If there isn't an error with creating fasta dictionary
								if(errorIndex==null){
									console.log("aln percent ");
									//3. Create the FAI Index of the fasta file 
									//updateProcessing(id,0,"Creating the the FAI Index of the fasta file with myFaidx...");
									res.write("data: " + 0 +" StateA "+"Creating the the FAI Index of the fasta file with myFaidx..."+"\n\n");
									run_error("bash",scriptStep3,function(result,error){
										//When finishing the execution of the script: Create FAI Index
										console.log("result:\n"+result);
										console.log("error:\n"+error);
										read_FAI_Error(error, function (errorIndex){
											//If there isn't an error with creating fai index
											if(errorIndex==null){
												console.log("aln percent ");
												//updateProcessing(id,0,"Finished creating the index fai of the fasta file with success...");
												res.write("data: " + 0 +" StateA "+"Finished creating the index fai of the fasta file with success..."+"\n\n");
												//4. Alignthe fastq file to the fasta file with bwa
												run_Step_ALN_BWA(res,scriptStep4,filePath,scriptNb,function (err){
													callback (err);
												});
											} else{
											//Error with creating FAI Index
												//HTML
												//finishProcessing(id,0,"ERROR...<br>"+errorIndex,true);
												res.write("data: " + 1000 +" StateA "+"ERROR...<br>"+errorIndex+"\n\n");
												console.log("aln error "+errorIndex);
												callback (0);
											}
										});
									});
									
								} else{
								//Error with creating fasta dictionary
									//HTML
									//finishProcessing(id,0,"ERROR...<br>"+errorIndex,true);
									res.write("data: " + 1000 +" StateA "+"ERROR...<br>"+errorIndex+"\n\n");
									console.log("aln error "+errorIndex);
									callback (0);
								}
							});
						});
					});
				}
				else{
				//Error with creating fasta index with bwa
					//HTML
					//finishProcessing(id,0,"ERROR...<br>"+errorIndex,true);
					res.write("data: " + 1000 +" StateA "+"ERROR...<br>"+errorIndex+"\n\n");
					console.log("aln error "+errorIndex);
					callback (0);
				}
			});
		});
	
}

//Tool: Bwa
//run_Step_ALN_BWA(res,[script_ALN,fileFasta,fileFastq,fileSAM,result_ALN],result_ALN,[script_NREAD,isGZ,fileFastq],callback);
function run_Step_ALN_BWA(){
	var errorProcess= null;
	var percent=0;
	var fs = require('fs');
	var repeat=true;
	//Arguments
	var res = arguments[0];
	var scriptStep = arguments[1];
	var filePath = arguments[2];
	var scriptNb = arguments[3];
	var callback = arguments[4];
	
	//Run the script of the step: count the number of reads in fastq file
	var nbRead=0;
	run("bash", scriptNb, function(result){ 
		var number = result.replace(/[.,?!;()"'-]/g, " ").replace(/\s+/g, " ").split(" ");
		nbRead=Number(number[0])/4;
		console.log("nb read : "+nbRead);
	});
	
	//Run the script of the step: aligning the fastq file to the fasta file
	run("bash", scriptStep, function(result){
		//When finishing the execution of the script
		repeat=false;
		fs.access(filePath, fs.F_OK, function(err) {
			if (!err) {
				fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
					if(!err){
						read_Bwa_Error(data, function (errorProcess){
							//If there isn't an error
							if(errorProcess==null){
								percent=100;
								console.log("aln percent "+percent);
								//finishProcessing(id,percent,"Finished with success...",false);
								res.write("data: " + percent +" StateA "+"Finished with success..."+"\n\n");
								callback(1);
							}
							else{
							//There was an error
								percent=1000;
								//HTML
								//finishProcessing(id,percent,"ERROR...<br>"+errorProcess,true);
								res.write("data: " + percent +" StateA "+"ERROR...<br>"+errorProcess+"\n\n");
								console.log("aln error "+errorProcess+" percent "+percent);
								callback(0);
							}
						});
					}
					else{
						//HTML3
						percent=1000;
						res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
						console.log(err);
					}
				});
				fs.unwatchFile(filePath);
			} else{
				//HTML3
				percent=1000;
				res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
				console.log(err);
			}
		});
	});
	//Update the progressBar and the state
	var totalRecord=0;
	var percentCalcule=function(){
		fs.access(filePath, fs.F_OK, function(err) {
			if (!err && repeat) {
				fs.watchFile(filePath, (curr, prev) => {
					fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
						if(!err){
						
							read_Bwa(data, nbRead, totalRecord, percent, function (totalRecords,percentResult,state){
								//HTML
								totalRecord=totalRecords;
								percent=percentResult;
								//updateProcessing(id,percent,state);
								res.write("data: " + percent +" StateA "+state+"\n\n");
								console.log(percent+" "+totalRecord);
							});
						}
						else{
							//HTML3
							res.write("data: " + percent +" StateA "+"Can't get the state of execution now."+"\n\n");
							console.log(err);
						}
					});
				});
			} else if(repeat){
				percentCalcule();
			}
		});
	};
	percentCalcule();
	
}

//Step: Conversion, Tool: Picard
//run_Step_CV(res,[script_CV,fileSAM,fileBAM,result_CV],result_CV,[script_NREADSam,fileSAM],callback);
function run_Step_CV(){
	var errorProcess= null;
	var percent=0;
	var fs = require('fs');
	var repeat=true;
	//Arguments
	var res = arguments[0];
	var scriptStep = arguments[1];
	var filePath = arguments[2];
	var scriptNb = arguments[3];
	var callback = arguments[4];
	
	run_error("rm",[filePath],function(r,e){});
	
	//Run the script of the step: count the number of reads in the sam file
	var nbRead=0;
	run("bash", scriptNb, function(result){ 
		var number = result.replace(/[.,?!;()"'-]/g, " ").replace(/\s+/g, " ").split(" ");
		nbRead=Number(number[0]);
		console.log("nb read : "+nbRead);
	});
	
	//Run the script of the step: convert the sam file to a bam file
	run("bash", scriptStep, function(result){
		//When finishing the execution of the script
		repeat=false;
		fs.access(filePath, fs.F_OK, function(err) {
			if (!err) {
				fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
					if(!err){
						read_PICARD_Error(data, function (errorProcess){
							//If there isn't an error
							if(errorProcess==null){
								percent=100;
								console.log("CV percent "+percent);
								//finishProcessing(id,percent,"Finished with success...",false);
								res.write("data: " + percent +" StateA "+"Finished with success..."+"\n\n");
								callback(nbRead,1);
							}
							else{
							//There was an error
								percent=1000;
								//finishProcessing(id,percent,"ERROR...<br>"+errorProcess,true);
								res.write("data: " + percent +" StateA "+"ERROR...<br>"+errorProcess+"\n\n");
								console.log("CV ERR "+errorProcess+ " percent "+percent);
								callback(nbRead,0);
							}
						});
					}
					else{
						//HTML3
						percent=1000;
						res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
						console.log(err);
						callback(nbRead,0);
					}
				});
				fs.unwatchFile(filePath);
			}else{
				//HTML3
				percent=1000;
				res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
				console.log(err);
				callback(nbRead,0);
			}
		});
	});
	//Update the progressBar and the state
	var totalRecord=0;
	var percentCalcule=function(){
		fs.access(filePath, fs.F_OK, function(err) {
			if (!err && repeat) {
				fs.watchFile(filePath, (curr, prev) => {
					fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
						if(!err){
						
							read_PICARD_CV(data, nbRead, totalRecord, percent, function (totalRecords,percentResult,state){
								//HTML
								totalRecord=totalRecords;
								percent=percentResult;
								//updateProcessing(id,percent,state);
								res.write("data: " + percent +" StateA "+state+"\n\n");
								console.log(percent+" "+totalRecord);
							});
						}
						else{
							//HTML3
							res.write("data: " + percent +" StateA "+"Can't get the state of execution now."+"\n\n");
							console.log(err);
						}
					});
				});
			} else if(repeat){
				percentCalcule();
			}
		});
	};
	percentCalcule();
	
	
}

//Step: Cleaning BAM, Tool: Picard/GATK
//run_Step_ClBAM(res,[script_CLBAM_MDup,fileBAM,fileBAMDedup,fileMetrics,result_CLBAM_MDup],result_CLBAM_MDup,nbSeqSAM,
//4/[script_CLBAM_Sort,fileBAMDedup,result_CLBAM_Sort],result_CLBAM_Sort,
//6/[script_CLBAM_Target,fileFasta,fileBAMDedup,fileListTarget,result_CLBAM_Target],result_CLBAM_Target,
//8/[script_CLBAM_Realign,fileFasta,fileBAMDedup,fileListTarget,fileBAMRalign,result_CLBAM_Realign],result_CLBAM_Realign,callback);
function run_Step_ClBAM(){
	//Arguments
	var res = arguments[0];
	var scriptStep1 = arguments[1];
	var filePath1 = arguments[2];
	var nbSeqSAM = arguments[3];
	var scriptStep2 = arguments[4];
	var filePath2 = arguments[5];
	var scriptStep3 = arguments[6];
	var filePath3 = arguments[7];
	var scriptStep4 = arguments[8];
	var filePath4 = arguments[9];
	var callback = arguments[10];
	
	run_error("rm",[filePath1],function(r,e){});
	run_error("rm",[filePath2],function(r,e){});
	run_error("rm",[filePath3],function(r,e){});
	run_error("rm",[filePath4],function(r,e){});
	
	//Run the script of the step: Mark duplicates
	run_Step_ClBAM_MarkDup(res,scriptStep1,filePath1,nbSeqSAM,scriptStep2,filePath2,scriptStep3,filePath3,scriptStep4,filePath4, function (err){
		callback(err);
	});
}

//run_Step_ClBAM_MarkDup(res,[script_CLBAM_MDup,fileBAM,fileBAMDedup,fileMetrics,result_CLBAM_MDup],result_CLBAM_MDup,nbSeqSAM,
//4/[script_CLBAM_Sort,fileBAMDedup,result_CLBAM_Sort],result_CLBAM_Sort,
//6/[script_CLBAM_Target,fileFasta,fileBAMDedup,fileListTarget,result_CLBAM_Target],result_CLBAM_Target,
//8/[script_CLBAM_Realign,fileFasta,fileBAMDedup,fileListTarget,fileBAMRalign,result_CLBAM_Realign],result_CLBAM_Realign, callback);
function run_Step_ClBAM_MarkDup(){
	var errorProcess= null;
	var percent=0;
	var fs = require('fs');
	var repeat=true;
	//Arguments
	var res = arguments[0];
	var scriptStep1 = arguments[1];
	var filePath = arguments[2];
	var nbSeqSAM = arguments[3];
	var scriptStep2 = arguments[4];
	var filePath2 = arguments[5];
	var scriptStep3 = arguments[6];
	var filePath3 = arguments[7];
	var scriptStep4 = arguments[8];
	var filePath4 = arguments[9];
	var callback = arguments[10];
	
	//Run the script of the step
	//1. Mark duplicates
	run("bash", scriptStep1, function(result){
		//When finishing the execution of the script
		repeat=false;
		fs.access(filePath, fs.F_OK, function(err) {
			if (!err) {
				fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
					if(!err){
						read_PICARD_Error(data, function (errorProcess){
							//If there isn't an error
							if(errorProcess==null){
								percent=17.7;
								console.log("cl-dedup "+percent);
								//finishProcessing(id,percent,"Finished marking duplicates with success...",false);
								res.write("data: " + percent +" StateA "+"Finished marking duplicates with success..."+"\n\n");
								//2. Sort the bam file
								run_Step_ClBAM_Sort(res,scriptStep2,filePath2,scriptStep3,filePath3,scriptStep4,filePath4,function(err){
									callback (err);
								});
							}
							else{
							//There was an error
								percent=1000;
								//HTML
								//finishProcessing(id,percent,"ERROR...<br>"+errorProcess,true);
								res.write("data: " + percent +" StateA "+"ERROR...<br>"+errorProcess+"\n\n");
								console.log("cl-dedup error "+errorProcess+" percent "+percent);
								callback (0);
							}
						});
					}
					else{
						//HTML3
						percent=1000;
						res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
						console.log(err);
					}
				});
				fs.unwatchFile(filePath);
			} else{
				//HTML3
				percent=1000;
				res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
				console.log(err);
			}
		});
	});
	//Update the progressBar and the state
	var totalRecord=0;
	var percentCalcule=function(){
		fs.access(filePath, fs.F_OK, function(err) {
			if (!err && repeat) {
				fs.watchFile(filePath, (curr, prev) => {
					fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
						if(!err){
							read_PICARD_MarkDup(data, nbRead, totalRecord, percent, function (totalRecords,percentResult,state){
								percent=percentResult;
								totalRecord=totalRecords;
								//updateProcessing(id,percent,state);
								res.write("data: " + percent +" StateA "+state+"\n\n");
								//HTML
								console.log(percent+" "+totalRecord);
							});
						}
						else{
							//HTML3
							res.write("data: " + percent +" StateA "+"Can't get the state of execution now."+"\n\n");
							console.log(err);
						}
					});
				});
			} else if(repeat){
				percentCalcule();
			}
		});
	};
	percentCalcule();
}

//run_Step_ClBAM_Sort(res,[script_CLBAM_Sort,fileBAMDedup,result_CLBAM_Sort],result_Sort,
//3/[script_CLBAM_Target,fileFasta,fileBAMDedup,fileListTarget,result_CLBAM_Target],result_CLBAM_Target,
//5/[script_CLBAM_Realign,fileFasta,fileBAMDedup,fileListTarget,fileBAMRalign,result_CLBAM_Realign],result_CLBAM_Realign,callback);
function run_Step_ClBAM_Sort(){
	var errorProcess= null;
	var percent=17.7;
	var fs = require('fs');
	var repeat=true;
	//Arguments
	var res = arguments[0];
	var scriptStep1 = arguments[1];
	var filePath = arguments[2];
	var scriptStep2 = arguments[3];
	var filePath2 = arguments[4];
	var scriptStep3 = arguments[5];
	var filePath3 = arguments[6];
	var callback = arguments[7];

	//Run the script of the step
	//1. Sort the bam file
	run("bash", scriptStep1, function(result){
		//When finishing the execution of the script
		repeat=false;
		fs.access(filePath, fs.F_OK, function(err) {
			if (!err) {
				fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
					if(!err){
						read_PICARD_Error(data, function (errorProcess){
							//If there isn't an error
							if(errorProcess==null){
								percent=20.3;
								console.log("cl-sort "+percent);
								//finishProcessing(id,percent,"Finished sorting the bam file with success...",false);
								res.write("data: " + percent +" StateA "+"Finished sorting the bam file with success..."+"\n\n");
								//2. Find target indel
								run_Step_ClBAM_Target(res,scriptStep2,filePath2,scriptStep3,filePath3,function(err){
									callback (err);
								});
							}
							else{
							//There was an error
								percent=1000;
								//HTML
								//finishProcessing(id,percent,"ERROR...<br>"+errorProcess,true);
								res.write("data: " + percent +" StateA "+"ERROR...<br>"+errorProcess+"\n\n");
								console.log("cl-sort error "+errorProcess+" percent "+percent);
								callback (0);
							}
							
						});
					}
					else{
						//HTML3
						percent=1000;
						res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
						console.log(err);
					}
				});
			} else{
				//HTML3
				percent=1000;
				res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
				console.log(err);
			}
		});
	});
	
}

//run_Step_ClBAM_Target(res,[script_CLBAM_Target,fileFasta,fileBAMDedup,fileListTarget,result_CLBAM_Target],result_CLBAM_Target,
//3/[script_CLBAM_Realign,fileFasta,fileBAMDedup,fileListTarget,fileBAMRalign,result_CLBAM_Realign],result_CLBAM_Realign,callback);
function run_Step_ClBAM_Target(){
	var errorProcess= null;
	var percent=20.3;
	var fs = require('fs');
	var repeat=true;
	//Arguments
	var res = arguments[0];
	var scriptStep1 = arguments[1];
	var filePath = arguments[2];
	var scriptStep2 = arguments[3];
	var filePath2 = arguments[4];
	var callback = arguments[5];

	//Run the script of the step
	//1. Find list of targets indel for realignment
	run("bash", scriptStep1, function(result){
		//When finishing the execution of the scrip
		repeat=false;
		fs.access(filePath, fs.F_OK, function(err) {
			if (!err) {
				fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
					if(!err){
						read_GATK_Error(data, function (errorProcess){
							//If there isn't an error
							if(errorProcess==null){
								percent=29.1;
								console.log("cl-target "+percent);
								//finishProcessing(id,percent,"Finished finding targets for realignment with success...",false);
								res.write("data: " + percent +" StateA "+"Finished finding targets for realignment with success..."+"\n\n");
								//2. Realignment
								run_Step_ClBAM_Realign(res,scriptStep2,filePath2,function(err){
									callback(err);
								});
							}
							else{
							//There was an error
								percent=1000;
								console.log("cl-target error "+errorProcess+" percent "+percent);
								//HTML
								//finishProcessing(id,percent,"ERROR...<br>"+errorProcess,true);
								res.write("data: " + percent +" StateA "+"ERROR...<br>"+errorProcess+"\n\n");
								callback(0);
							}
						});
					}
					else{
						//HTML3
						percent=1000;
						res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
						console.log(err);
					}
				});
				fs.unwatchFile(filePath);
			} else{
				//HTML3
				percent=1000;
				res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
				console.log(err);
			}
		});
	});
	//Update the progressBar and the state
	var percentCalcule=function(){
		fs.access(filePath, fs.F_OK, function(err) {
			if (!err && repeat) {
				fs.watchFile(filePath, (curr, prev) => {
					fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
						if(!err){
							read_GATK(data, percent, 20.3, 0.088, function (percentResult,state){
								percent=percentResult;
								//HTML
								//updateProcessing(id,percent,state);
								res.write("data: " + percent +" StateA "+state+"\n\n");
								console.log(percent);
							});
						}
						else{
							//HTML3
							res.write("data: " + percent +" StateA "+"Can't get the state of execution now."+"\n\n");
							console.log(err);
						}
					});
				});
			} else if(repeat){
				percentCalcule();
			}
		});
	};
	percentCalcule();
	
}

//run_Step_ClBAM_Realign(res,[script_CLBAM_Realign,fileFasta,fileBAMDedup,fileListTarget,fileBAMRalign,result_CLBAM_Realign],result_CLBAM_Realign,callback);
function run_Step_ClBAM_Realign(){
	var errorProcess= null;
	var percent=29.1;
	var fs = require('fs');
	var repeat=true;
	//Arguments
	var res = arguments[0];
	var scriptStep = arguments[1];
	var filePath = arguments[2];
	var callback = arguments[3];
	
	//Run the script of the step: realignment
	run("bash", scriptStep, function(result){
		//When finishing the execution of the script
		repeat=false;
		fs.access(filePath, fs.F_OK, function(err) {
			if (!err) {
				fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
					if(!err){
						read_GATK_Error(data, function (errorProcess){
							//If there isn't an error
							if(errorProcess==null){
								percent=100;
								//finishProcessing(id,percent,"Finished cleaning the bam file with success...",false);
								res.write("data: " + percent +" StateA "+"Finished cleaning the bam file with success..."+"\n\n");
								console.log("cl-real "+percent);
								callback(1);
							}
							else{
							//There was an error
								percent=1000;
								console.log("cl-real error "+errorProcess+" percent "+percent);
								//HTML
								//finishProcessing(id,percent,"ERROR...<br>"+errorProcess,true);
								res.write("data: " + percent +" StateA "+"ERROR...<br>"+errorProcess+"\n\n");
								callback(0);
							}
						});
					}
					else{
						//HTML3
						percent=1000;
						res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
						console.log(err);
					}
				});
				fs.unwatchFile(filePath);
			} else{
				//HTML3
				percent=1000;
				res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
				console.log(err);
			}
		});
	});
	//Update the progressBar and the state
	var percentCalcule=function(){
		fs.access(filePath, fs.F_OK, function(err) {
			if (!err && repeat) {
				fs.watchFile(filePath, (curr, prev) => {
					fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
						if(!err){
							read_GATK(data, percent, 29.1, 0.709, function (percentResult,state){
								percent=percentResult;
								//HTML
								//updateProcessing(id,percent,state);
								res.write("data: " + percent +" StateA "+state+"\n\n");
								console.log(percent);
							});
						}
						else{
							//HTML3
							res.write("data: " + percent +" StateA "+"Can't get the state of execution now."+"\n\n");
							console.log(err);
						}
					});
				});
			} else if(repeat){
				percentCalcule();
			}
		});
	};
	percentCalcule();
}


//Step: Variant Call, Tool: Picard/GATK
//run_Step_PR_Variant(res,[script_CLBAM_Sort,fileBAM,result_CLBAM_Sort],result_CLBAM_Sort,
//3/[script_PR_VARIANT,fileFasta,fileBAM,fileVCF,result_PR_VARIANT],result_PR_VARIANT,callback);
function run_Step_PR_Variant(){
	var errorProcess= null;
	var percent=0;
	var fs = require('fs');
	var repeat=true;
	//Arguments
	var res = arguments[0];
	var scriptStep1 = arguments[1];
	var filePath = arguments[2];
	var scriptStep2 = arguments[3];
	var filePath2 = arguments[4];
	var callback = arguments[5];
	
	run_error("rm",[filePath],function(r,e){});
	run_error("rm",[filePath2],function(r,e){});
	
	//Run the script of the step
	//1. Sort the bam file
	run("bash", scriptStep1, function(result){
		//When finishing the execution of the script
		repeat=false;
		fs.access(filePath, fs.F_OK, function(err) {
			if (!err) {
				fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
					if(!err){
						read_PICARD_Error(data, function (errorProcess){
							//If there isn't an error
							if(errorProcess==null){
								percent=0;
								console.log("sort sortpr done");
								//finishProcessing(id,percent,"Finished sorting the bam file with success...",false);
								res.write("data: " + percent +" StateA "+"Finished sorting the bam file with success..."+"\n\n");
								//2. Variant Call
								run_PR_Variant(res,scriptStep2,filePath2,function(err){
									callback(err);
								});
							}
							else{
							//There was an error
								percent=1000;
								//HTML
								//finishProcessing(id,percent,"ERROR...<br>"+errorProcess,true);
								res.write("data: " + percent +" StateA "+"ERROR...<br>"+errorProcess+"\n\n");
								console.log("sort sortpr error"+errorProcess);
								callback(0);
							}
						});
					}
					else{
						//HTML3
						percent=1000;
					    res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
						console.log(err);
					}
				});
			} else{
				//HTML3
				percent=1000;
				res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
				console.log(err);
			}
		});
	});
	
}

//Variant Call
//run_PR_Variant(res,[script_PR_VARIANT,fileFasta,fileBAM,fileVCF,result_PR_VARIANT],result_PR_VARIANT,callback);
function run_PR_Variant(){
	var errorProcess= null;
	var percent=0;
	var fs = require('fs');
	var repeat=true;
	//Arguments
	var res = arguments[0];
	var scriptStep = arguments[1];
	var filePath = arguments[2];
	var callback = arguments[3];
	
	//Run the script of the step: variant call
	run("bash", scriptStep, function(result){
		//When finishing the execution of the script
		repeat=false;
		fs.access(filePath, fs.F_OK, function(err) {
			if (!err) {
				fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
					if(!err){
						read_GATK_Error(data, function (errorProcess){
							//If there isn't an error
							if(errorProcess==null){
								percent=100;
								//finishProcessing(id,percent,"Finished processing with success...",false);
								res.write("data: " + percent +" StateA "+"Finished processing with success..."+"\n\n");
								console.log("var "+percent);
								callback(1);
							}
							else{
							//There was an error
								percent=1000;
								//HTML
								//finishProcessing(id,percent,"ERROR...<br>"+errorProcess,true);
								res.write("data: " + percent +" StateA "+"ERROR...<br>"+errorProcess+"\n\n");
								console.log("var error "+errorProcess+" percent "+percent);
								callback(0);
							}
							
						});
					}
					else{
						//HTML3
						percent=1000;
						res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
						console.log(err);
					}
				});
				fs.unwatchFile(filePath);
			} else{
				//HTML3
				percent=1000;
				res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
				console.log(err);
			}
		});
	});
	//Update the progressBar and the state
	var percentCalcule=function(){
		fs.access(filePath, fs.F_OK, function(err) {
			if (!err && repeat) {
				fs.watchFile(filePath, (curr, prev) => {
					fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
						if(!err){
							read_GATK(data, percent, 0, 1, function (percentResult,state){
								percent=percentResult;
								//HTML
								//updateProcessing(id,percent,state);
								res.write("data: " + percent +" StateA "+state+"\n\n");
								console.log(percent);
							});
						}
						else{
							//HTML3
							res.write("data: " + percent +" StateA "+"Can't get the state of execution now."+"\n\n");
							console.log(err);
						}
					});
				});
			} else if(repeat){
				percentCalcule();
			}
		});
	};
	percentCalcule();
}

//Step: SNP Call, Tool: GATK
//run_Step_PR_SNP(res,[script_PR_SNP,fileFasta,fileVCF,fileSNP,result_PR_SNP],result_PR_SNP,callback);
function run_Step_PR_SNP(){
	var errorProcess= null;
	var percent=0;
	var fs = require('fs');
	var repeat=true;
	//Arguments
	var res = arguments[0];
	var scriptStep = arguments[1];
	var filePath = arguments[2];
	var callback = arguments[3];
	
	run_error("rm",[filePath],function(r,e){});
	
	//Run the script of the step: snp call
	run("bash", scriptStep, function(result){
		//When finishing the execution of the script
		repeat=false;
		fs.access(filePath, fs.F_OK, function(err) {
			if (!err) {
				fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
					if(!err){
						read_GATK_Error(data, function (errorProcess){
							//If there isn't an error
							if(errorProcess==null){
								percent=100;
								//finishProcessing(id,percent,"Finished processing with success...",false);
								res.write("data: " + percent +" StateA "+"Finished processing with success..."+"\n\n");
								console.log("snp "+percent);
								callback(1);
								
							}
							else{
							//There was an error
								percent=1000;
								//HTML
								//finishProcessing(id,percent,"ERROR...<br>"+errorProcess,true);
								res.write("data: " + percent +" StateA "+"ERROR...<br>"+errorProcess+"\n\n");
								console.log("snp error "+errorProcess+" percent "+percent);
								callback(0);
							}
							
						});
					}
					else{
						//HTML3
						percent=1000;
						res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
						console.log(err);
					}
				});
				fs.unwatchFile(filePath);
			} else{
				//HTML3
				percent=1000;
				res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
				console.log(err);
			}
		});
	});
	//Update the progressBar and the state
	var percentCalcule=function(){
		fs.access(filePath, fs.F_OK, function(err) {
			if (!err && repeat) {
				fs.watchFile(filePath, (curr, prev) => {
					fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
						if(!err){
							read_GATK(data, percent, 0, 1, function (percentResult,state){
								percent=percentResult;
								//updateProcessing(id,percent,state);
								res.write("data: " + percent +" StateA "+state+"\n\n");
								//HTML
								console.log(percent);
							});
						}
						else{
							//HTML3
							res.write("data: " + percent +" StateA "+"Can't get the state of execution now."+"\n\n");
							console.log(err);
						}
					});
				});
			} else if(repeat){
				percentCalcule();
			}
		});
	};
	percentCalcule();
	
	
}

//Step: Indel Call, Tool: GATK
//run_Step_PR_Indel(res,[script_PR_INDEL,fileFasta,fileVCF,fileIndel,result_PR_INDEL],result_PR_INDEL,callback);
function run_Step_PR_Indel(){
	var errorProcess= null;
	var percent=0;
	var fs = require('fs');
	var repeat=true;
	//Arguments
	var res = arguments[0];
	var scriptStep = arguments[1];
	var filePath = arguments[2];
	var callback = arguments[3];
	
	run_error("rm",[filePath],function(r,e){});
	
	//Run the script of the step: indel call
	run("bash", scriptStep, function(result){
		//When finishing the execution of the script
		repeat=false;
		fs.access(filePath, fs.F_OK, function(err) {
			if (!err) {
				fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
					if(!err){
						read_GATK_Error(data, function (errorProcess){
							//If there isn't an error
							if(errorProcess==null){
								percent=100;
								//finishProcessing(id,percent,"Finished processing with success...",false);
								res.write("data: " + percent +" StateA "+"Finished processing with success..."+"\n\n");
								console.log("indel "+percent);
								callback(1);
							}
							else{
							//There was an error
								percent=1000;
								//HTML
								//finishProcessing(id,percent,"ERROR...<br>"+errorProcess,true);
								res.write("data: " + percent +" StateA "+"ERROR...<br>"+errorProcess+"\n\n");
								console.log("indel error "+errorProcess+" percent "+percent);
								callback(0);
							}
						});
					}
					else{
						//HTML3
						percent=1000;
						res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
						console.log(err);
					}
				});
				fs.unwatchFile(filePath);
			} else{
				//HTML3
				percent=1000;
				res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
				console.log(err);
			}
		});
	});
	//Update the progressBar and the state
	var percentCalcule=function(){
		fs.access(filePath, fs.F_OK, function(err) {
			if (!err && repeat) {
				fs.watchFile(filePath, (curr, prev) => {
					fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
						if(!err){
							read_GATK(data, percent, 0, 1, function (percentResult,state){
								//HTML
								percent=percentResult;
								//updateProcessing(id,percent,state);
								res.write("data: " + percent +" StateA "+state+"\n\n");
								console.log(percentResult);
							});
						}
						else{
							//HTML3
							res.write("data: " + percent +" StateA "+"Can't get the state of execution now."+"\n\n");
							console.log(err);
						}
					});
				});
			} else if(repeat){
				percentCalcule();
			}
		});
	};
	percentCalcule();
}


//Step: SV Call, Tool: Picard/Delly
//run_Step_PR_SV(res,step,type,[script_CLBAM_Sort,fileBAM,result_CLBAM_Sort],result_CLBAM_Sort, 
//5/result_PR_SV,[script_PR_SV_DEL,fileFasta,fileBAM,fileBCF,fileVCF,result_PR_SV],[script_PR_SV_INS,fileFasta,fileBAM,fileBCF,fileVCF,result_PR_SV], [script_PR_SV_DUP,fileFasta,fileBAM,fileBCF,fileVCF,result_PR_SV],[script_PR_SV_INV,fileFasta,fileBAM,fileBCF,fileVCF,result_PR_SV],[script_PR_SV_TRA,fileFasta,fileBAM,fileBCF,fileVCF,result_PR_SV],fileBCF,callback);
function run_Step_PR_SV(){
	var errorProcess= null;
	var percent=0;
	var fs = require('fs');
	var repeat=true;
	//Arguments
	var res = arguments[0];
	var step = arguments[1];
	var type = arguments[2];
	var scriptStep1 = arguments[3];
	var filePath = arguments[4];
	var filePath2 = arguments[5];
	var scriptStep2 = arguments[6];
	var scriptStep3 = arguments[7];
	var scriptStep4 = arguments[8];
	var scriptStep5 = arguments[9];
	var scriptStep6 = arguments[10];
	var filePath3 = arguments[11];
	var callback = arguments[12];
	
	run_error("rm",[filePath],function(r,e){});
	run_error("rm",[filePath2],function(r,e){});
	run_error("rm",[filePath3],function(r,e){});

	//Run the script of the step
	//1. Sort the bam file
	run("bash", scriptStep1, function(result){
		//When finishing the execution of the script
		repeat=false;
		fs.access(filePath, fs.F_OK, function(err) {
			if (!err) {
				fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
					if(!err){
						read_PICARD_Error(data, function (errorProcess){
							//If there isn't an error
							if(errorProcess==null){
								percent=0;
								console.log("sort sortpr done");
								//finishProcessing(id,percent,"Finished sorting the bam file with success...",false);
								res.write("data: " + percent +" StateA "+"Finished sorting the bam file with success..."+"\n\n");
								//2. SV Call (DEL)
								run_PR_SV(res,"DEL",step,type,scriptStep2,filePath2,function(err){
									if(err==0){
										callback(err,0);
									} else{
										//3. SV Call (INS)
										run_error("rm",[filePath2],function(r,e){});
										run_error("rm",[filePath3],function(r,e){});
										run_PR_SV(res,"INS",step,type,scriptStep3,filePath2,function(err){
											if(err==0){
												callback(err,1);
											} else{
												//4. SV Call (DUP)
												run_error("rm",[filePath2],function(r,e){});
												run_error("rm",[filePath3],function(r,e){});
												run_PR_SV(res,"DUP",step,type,scriptStep4,filePath2,function(err){
													if(err==0){
														callback(err,2);
													} else{
														//5. SV Call (INV)
														run_error("rm",[filePath2],function(r,e){});
														run_error("rm",[filePath3],function(r,e){});
														run_PR_SV(res,"INV",step,type,scriptStep5,filePath2,function(err){
															if(err==0){
																callback(err,3);
															} else{
																//6. SV Call (TRA)
																run_error("rm",[filePath2],function(r,e){});
																run_error("rm",[filePath3],function(r,e){});														
																run_PR_SV(res,"TRA",step,type,scriptStep6,filePath2,function(err){
																	if(err==0){
																		callback(err,4);
																	}else{
																		callback(1,5);
																	}
																});
															}
														});
													}
												});		
											}
										});
									}
								});
							}
							else{
							//There was an error
								percent=1000;
								//HTML
								//finishProcessing(id,percent,"ERROR...<br>"+errorProcess,true);
								res.write("data: " + percent +" StateA "+"ERROR...<br>"+errorProcess+"\n\n");
								console.log("sort sortpr error"+errorProcess);
								callback(0,0);
							}
						});
					}
					else{
						//HTML3
						percent=1000;
					    res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
						console.log(err);
					}
				});
			} else{
				//HTML3
				percent=1000;
				res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
				console.log(err);
			}
		});
	});
	
}

//SV Call
//run_PR_SV(res,stepSV,step,type,[script_PR_SV_,fileFasta,fileBAM,fileVCF,result_PR_SV],result_PR_SV,callback);
function run_PR_SV(){
	var errorProcess= null;
	var percent=0;
	var init=0;
	var phase=0.2;
	var fs = require('fs');
	var repeat=true;
	var doStep=true;
	//Arguments
	var res = arguments[0];
	var stepSV = arguments[1];
	var step = arguments[2];
	var type = arguments[3];
	var scriptStep = arguments[4];
	var filePath = arguments[5];
	var callback = arguments[6];
	
	//Get the percent depending on the type of the SV
	if(type=="SV"){
		phase=0.2;
		switch (stepSV){
			case "DEL" :
				percent=0;
				init=0;
				if(step>0){
					doStep=false;
				}
				break;
			case "INS" :
				percent=20;
				init=20;
				if(step>1){
					doStep=false;
				}
				break;
			case "DUP" :
				percent=40;
				init=40;
				if(step>2){
					doStep=false;
				}
				break;
			case "INV" :
				percent=60;
				init=60;
				if(step>3){
					doStep=false;
				}
				break;
			case "TRA" :
				percent=80;
				init=80;
				if(step>4){
					doStep=false;
				}
				break;
		}
	}else{
		phase=0.5;
		switch (stepSV){
			case "DEL" :
				percent=0;
				init=0;
				if(step>0){
					doStep=false;
				}
				break;
			case "DUP" :
				percent=50;
				init=50;
				if(step>2){
					doStep=false;
				}
				break;
			default :
				doStep=false;
				
				break;
		}
	}
	
	if (doStep==true){
		//Run the script of the step: SV call
		run("bash", scriptStep, function(result){
			//When finishing the execution of the script
			repeat=false;
			fs.access(filePath, fs.F_OK, function(err) {
				if (!err) {
					fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
						if(!err){
							read_Delly_Error(data, function (errorProcess){
								//If there isn't an error
								if(errorProcess==null){
									if(type=="SV"){
										switch (stepSV){
											case "DEL" :
												percent=20;
												break;
											case "INS" :
												percent=40;
												break;
											case "DUP" :
												percent=60;
												break;
											case "INV" :
												percent=80;
												break;
											case "TRA" :
												percent=100;
												break;
										}
									} else{
										switch (stepSV){
											case "DEL" :
												percent=50;
												break;
											case "DUP" :
												percent=100;
												break;
										}
									}
									//finishProcessing(id,percent,"Finished cleaning the bam file with success...",false);
									res.write("data: " + percent +" StateA "+"Finished SV Call ("+step+") with success..."+"\n\n");
									console.log(step+" "+percent);
									callback(1);
								}
								else{
								//There was an error
									percent=1000;
									console.log("cl-real error "+errorProcess+" percent "+percent);
									//HTML
									//finishProcessing(id,percent,"ERROR...<br>"+errorProcess,true);
									res.write("data: " + percent +" StateA "+"ERROR...<br>"+errorProcess+"\n\n");
									callback(0);
								}
							});
						}
						else{
							//HTML3
							percent=1000;
							res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
							console.log(err);
						}
					});
					fs.unwatchFile(filePath);
				} else{
					//HTML3
					percent=1000;
					res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
					console.log(err);
				}
			});
		});
		
		//Update the progressBar and the state
		var percentCalcule=function(){
			fs.access(filePath, fs.F_OK, function(err) {
				if (!err && repeat) {
					fs.watchFile(filePath, (curr, prev) => {
						fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
							if(!err){
								read_Delly(data, percent, phase, init, function (percentResult,state){
									percent=percentResult;
									//HTML
									//updateProcessing(id,percent,state);
									res.write("data: " + percent +" StateA "+state+"\n\n");
									console.log(percent);
								});
							}
							else{
								//HTML3
								res.write("data: " + percent +" StateA "+"Can't get the state of execution now."+"\n\n");
								console.log(err);
							}
						});
					});
				} else if(repeat){
					percentCalcule();
				}
			});
		};
		percentCalcule();
	} else{
		callback(1);
	}
}


//Step: Annotation, Tool: SnpEff
//run_Step_ANN(res,[script_ANN,fileVCF,fileDB,fileSTAT,fileVCFAnn,result_ANN],result_ANN,callback);
function run_Step_ANN(){
	var errorProcess= null;
	var percent=0;
	var fs = require('fs');
	var repeat=true;
	//Arguments
	var res = arguments[0];
	var scriptStep = arguments[1];
	var filePath = arguments[2];
	var callback = arguments[3];
	
	run_error("rm",[filePath],function(r,e){});

		//Run the script of the step: SV call
		run("bash", scriptStep, function(result){
			//When finishing the execution of the script
			repeat=false;
			fs.access(filePath, fs.F_OK, function(err) {
				if (!err) {
					fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
						if(!err){
							read_SnpEff_Error(data, function (errorProcess){
								//If there isn't an error
								if(errorProcess==null){
									percent=100;
									res.write("data: " + percent +" StateA "+"Finished processing with success..."+"\n\n");
									console.log(percent);
									callback(1);
								}
								else{
								//There was an error
									percent=1000;
									console.log("cl-real error "+errorProcess+" percent "+percent);
									//HTML
									res.write("data: " + percent +" StateA "+"ERROR...<br>"+errorProcess+"\n\n");
									callback(0);
								}
							});
						}
						else{
							//HTML3
							percent=1000;
							res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
							console.log(err);
						}
					});
					fs.unwatchFile(filePath);
				} else{
					//HTML3
					percent=1000;
					res.write("data: " + percent +" StateA "+"ERROR...<br>Can't get the state of execution."+"\n\n");
					console.log(err);
				}
			});
		});
		//Update the progressBar and the state
		var percentCalcule=function(){
			fs.access(filePath, fs.F_OK, function(err) {
				if (!err && repeat) {
					fs.watchFile(filePath, (curr, prev) => {
						fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
							if(!err){
								read_SnpEff(data, percent, function (percentResult,state){
									percent=percentResult;
									//HTML
									res.write("data: " + percent +" StateA "+state+"\n\n");
									console.log(percent+" "+state);
								});
							}
							else{
								//HTML3
								res.write("data: " + percent +" StateA "+"Can't get the state of execution now."+"\n\n");
								console.log(err);
							}
						});
					});
				} else if(repeat){
					percentCalcule();
				}
			});
		};
		percentCalcule();

}



exports.run_error = run_error;
exports.run_Step_QC = run_Step_QC;
exports.run_Step_ALN = run_Step_ALN; 
exports.run_Step_CV = run_Step_CV;
exports.run_Step_ClBAM = run_Step_ClBAM;
exports.run_Step_PR_Variant = run_Step_PR_Variant;
exports.run_Step_PR_SNP = run_Step_PR_SNP;
exports.run_Step_PR_Indel = run_Step_PR_Indel;
exports.run_Step_PR_SV = run_Step_PR_SV;
exports.run_Step_ANN = run_Step_ANN;


