/////////////////////////////////////////////////////////Variables////////////////////////////////////////////////////////////////////////
//Variables for the progressBar
var $progress,
	$bar,
	$text,
	$dnaHelix,
	$btnDownlaod,
	analyseType="DNA-Seq",
    percent = 0;
	
//This set of variables let us decide the percentage that change the colours of the progressBar
var orange = 30,
    yellow = 55,
    green = 85;

//Variables for the files uploaded
	var varFastqExist= false;
	var varFastaExist= false;
	
/////////////////////////////////////////////////////////Functions////////////////////////////////////////////////////////////////////////

	//We try to update the tabs in function of the uploaded files (we get that info from the server)
	function getInfo(){
		$.ajax('/current_user/files', {
			type: "GET",
			success:	function(response) {
				if (response.message === "Error") {
					varFastqExist= false;
					varFastaExist= false;
					sweetAlert("oups..","An error occured, refresh the page", "error");
				} else {
					if (response.message ===null) {
						varFastqExist= false;
						varFastaExist= false;
						sweetAlert("oups..","No fastq or fasta were uploaded", "error");
					} else {
						for (var i=0; i< response.message.length; i++) {
							console.log(response.message[i])
							if (response.message[i].fileType === "Fastq") {
								varFastqExist= true;
							} else if (response.message[i].fileType === "Fasta") {
								varFastaExist= true;
							}
						}
					}
				}
				
			},
			complete : function (resultat, statut) {
					initStateTabs(varFastqExist,varFastaExist);
			}
		})
	}

	/*** Initialize the state of tabs (enabled/disabled) in function of the step and the files uploaded ***/
	function initStateTabs(fastqExist,fastaExist) {
			console.log(fastqExist+" "+fastaExist);
			document.getElementById("dna-qc").disabled = true;
			document.getElementById("dna-clf").disabled = true;
			document.getElementById("dna-al").disabled = true;
			document.getElementById("dna-cv").disabled = true;
			document.getElementById("dna-clb").disabled = true;
			document.getElementById("dna-pr").disabled = true;
			document.getElementById("dna-ann").disabled = true;
			
			if(fastqExist){
				document.getElementById("dna-qc").disabled = false;
				document.getElementById("dna-clf").disabled = false;
				if(fastaExist){
					document.getElementById("dna-al").disabled = false;
				}
			}
			
			document.getElementById("dna-pr-snp").disabled = true;
			document.getElementById("dna-pr-indel").disabled = true;
			document.getElementById("dna-ann-snp").disabled = true;
			document.getElementById("dna-ann-indel").disabled = true;
			document.getElementById("dna-ann-del").disabled = true;
			document.getElementById("dna-ann-ins").disabled = true;
	}
	
	////////////////////////////////////////////////////
	//Launch analyse step 'stepAna' in the server
	function analyseStep(stepAna) {
		$.get("/analyseSteps?step=" + stepAna+"&type="+analyseType, function() {
		});
    }
	
	//Launch the download of the result file of the step 'stepAna' from the server
	function analyseStepDownload(stepAna) {
		$.ajax("/analyse?step=" + stepAna,{
			type: 'GET',
			success: function() {
				window.location = '/download_'+stepAna;
			}
		});
    }
	
	//Launch the streaming SSE for the update of the progressBar
	function connect(id){
		var streamStep='/stream_'+id;
		var source = new EventSource(streamStep);
		
		source.addEventListener('message', function(e) {
			console.log(e.data);
			var statePercent = (e.data).split(" StateA ");
			
			if(statePercent[0]>=100){
				if(statePercent[0] >= 1000){
					finishProcessing(id,statePercent[0],statePercent[1],true);
				} else {
					finishProcessing(id,statePercent[0],statePercent[1],false);
				}
			    console.log("closed "+id);
				source.close();
			} else{
				updateProcessing(id,statePercent[0],statePercent[1]);
			}
		  }, false)

		source.addEventListener('open', function(e) {
			console.log("Connection was opened "+id);
		  }, false)

		  source.addEventListener('error', function(e) {
			if (e.readyState == EventSource.CLOSED) {
				source.close();
				console.log("Connection was closed "+id);
			} else if (event.target.readyState === EventSource.CONNECTING) {
				console.log("Connection closed. Attempting to reconnect! "+id);
			} else {
				console.log("Connection closed. Unknown error! "+id);
			}
		  }, false)
	}
	
	//////////////////////////////////////////////////////
	/*** Functions that get the elements of a tab (its id is 'id') that will start the processing ***/
	//Get the progressBar container
	function getProgressElement(id){
	//btn ; ul; c1 li; c2 dnaqc-c; c3 div class dna-container-relative ..........
		return document.getElementById(id).nextElementSibling.childNodes[1].childNodes[1].childNodes[3].nextElementSibling.childNodes[1];
	}
	//Get the progressBar
	function getProgressBarElement(idV){
		return document.getElementById(idV).nextElementSibling.childNodes[1].childNodes[1].childNodes[3].nextElementSibling.childNodes[1].childNodes[1];
	}
	//Get the progressBar text
	function getProgressTextElement(id){
		return document.getElementById(id).nextElementSibling.childNodes[1].childNodes[1].childNodes[3].nextElementSibling.childNodes[1].childNodes[1].childNodes[1].childNodes[1];
	}
	//Get the dna helix that rotate
	function getDnaHelixElement(id){
		return document.getElementById(id).nextElementSibling.childNodes[1].childNodes[1].childNodes[3].childNodes[1];
	}
	//Get the state textBar
	function getStateBarElement(id){
		return document.getElementById(id).nextElementSibling.childNodes[3].childNodes[1];
	}
	//Get the button download
	function getBtnDownloadElement(id){
		return document.getElementById(id).nextElementSibling.childNodes[5].childNodes[1].childNodes[1];
	}
	//Get the button start
	function getBtnStartElement(id){
		return document.getElementById(id).nextElementSibling.childNodes[5].childNodes[1].childNodes[3];
	}

	/*** Initialize the progress bar element for the first use ***/
	function initProgressBar (id){
		var progress=getProgressElement(id);
		var dnaHelix=getDnaHelixElement(id);
		
		progress.classList.add("progress--active");
		
		var i,
			dnaNucleotides = dnaHelix.childNodes;
			
		for(i=0;i<dnaNucleotides.length;i++){
			if(dnaNucleotides[i].nodeName=="DIV"){
				dnaNucleotides[i].classList.add("dna-nucleotide--active");
			}
		}
	}

	/*** Reinitialize the progress bar element after a use ***/
	function resetColorsProgressBar (id) {
		var progress=getProgressElement(id);
		var bar=getProgressBarElement(id);
		var dnaHelix=getDnaHelixElement(id);
		
		
		bar.classList.remove("progress__bar--green")
		bar.classList.remove("progress__bar--yellow")
		bar.classList.remove("progress__bar--orange")
		bar.classList.remove("progress__bar--blue");
	  
		progress.classList.remove("progress--complete");
		
		var i, 
			dnaNucleotides = dnaHelix.childNodes;
		for(i=0;i<dnaNucleotides.length;i++){
			if(dnaNucleotides[i].nodeName=="DIV"){
				dnaNucleotides[i].classList.remove("dna-nucleotide--green");
				dnaNucleotides[i].classList.remove("dna-nucleotide--yellow");
				dnaNucleotides[i].classList.remove("dna-nucleotide--orange");
				dnaNucleotides[i].classList.remove("dna-nucleotide--blue");
				dnaNucleotides[i].classList.remove("dna-nucleotide--active");
				dnaNucleotides[i].classList.remove("dna-nucleotide--complete");
			}
		}
		
	}

	/*** Update the progress bar when used with the percent ***/
	function updateProgressBar (id, percent) {

		var progress=getProgressElement(id);
		var bar=getProgressBarElement(id);
		var text=getProgressTextElement(id);
		var dnaHelix=getDnaHelixElement(id);
		
		var i, 
			dnaNucleotides = dnaHelix.childNodes;
			
		percent = parseFloat( percent );
		percent = percent.toFixed(1);
		text.innerHTML= percent + "%" ;
		
		if( percent >= 100 ) {
			percent = 100;
			
			progress.classList.add("progress--complete");
			bar.classList.add("progress__bar--blue");
			text.innerHTML="Complete" ;

			for(i=0;i<dnaNucleotides.length;i++){
				if(dnaNucleotides[i].nodeName=="DIV"){
					dnaNucleotides[i].classList.remove("dna-nucleotide--green");
					dnaNucleotides[i].classList.remove("dna-nucleotide--yellow");
					dnaNucleotides[i].classList.remove("dna-nucleotide--orange");
					dnaNucleotides[i].classList.remove("dna-nucleotide--active");
					dnaNucleotides[i].classList.add("dna-nucleotide--complete");
					dnaNucleotides[i].classList.add("dna-nucleotide--blue");
				}
			}
				
			
		} else {
			if( percent >= green ) {
				bar.classList.add("progress__bar--green");
				for(i=0;i<dnaNucleotides.length;i++){
					if(dnaNucleotides[i].nodeName=="DIV"){
						dnaNucleotides[i].classList.add("dna-nucleotide--green");
					}
				}
			} else if( percent >= yellow ) {
				bar.classList.add("progress__bar--yellow");
				for(i=0;i<dnaNucleotides.length;i++){
					if(dnaNucleotides[i].nodeName=="DIV"){
						dnaNucleotides[i].classList.add("dna-nucleotide--yellow");
					}
				}
			} else if( percent >= orange ) {
				bar.classList.add("progress__bar--orange");
				for(i=0;i<dnaNucleotides.length;i++){
					if(dnaNucleotides[i].nodeName=="DIV"){
						dnaNucleotides[i].classList.add("dna-nucleotide--orange");
					}
				}
			}
		}

		bar.setAttribute("style", "width:"+percent + "%;");
	}

	/*** Change the state of tabs (enabled/disabled) in function of the step (represented by the tab with the id 'id') that has been processed ***/ 
	function processStateTabs(id){
		if(id == "dna-al"){
			document.getElementById("dna-cv").disabled = false;
		} else if(id == "dna-cv"){
			document.getElementById("dna-clb").disabled = false;
			document.getElementById("dna-pr").disabled = false;
		} else if(id == "dna-pr-variant"){
			document.getElementById("dna-pr-snp").disabled = false;
			document.getElementById("dna-pr-indel").disabled = false;
		} else if(id == "dna-pr-snp"){
			document.getElementById("dna-ann-snp").disabled = false;
			document.getElementById("dna-ann").disabled = false;
		} else if(id == "dna-pr-indel"){
			document.getElementById("dna-ann-indel").disabled = false;
			document.getElementById("dna-ann").disabled = false;
		} else if(id == "dna-pr-cnv"){
			document.getElementById("dna-ann-del").disabled = false;
			document.getElementById("dna-ann").disabled = false;
		} else if(id == "dna-pr-sv"){
			document.getElementById("dna-ann-del").disabled = false;
			document.getElementById("dna-ann-ins").disabled = false;
			document.getElementById("dna-ann").disabled = false;
		}
	}

	/*** Start the processing of the step of analysis corresponding to the tab with the id 'id' ***/ 
	function startProcessing(id){
		var btnStart = getBtnStartElement(id);
		var btnDownlaod=getBtnDownloadElement(id);
		var stateBar = getStateBarElement(id);
		
		btnStart.disabled=true;
		btnDownlaod.disabled=true;
		
		stateBar.innerHTML="Starting processing...";
		stateBar.style.display = "block";
		resetColorsProgressBar (id);
		initProgressBar (id);
		updateProgressBar (id, 0);
	}

	/*** Update the processing of the step of analysis corresponding to the tab with the id 'id' with the percentage and the state***/ 
	function updateProcessing(id,percent,state){
		var stateBar = getStateBarElement(id);
		stateBar.innerHTML=state;
		updateProgressBar (id, percent);
	}

	/*** finish the processing of the step of analysis corresponding to the tab with the id 'id'. It depends on error and state ***/ 
	function finishProcessing(id,percent,state,error){
		var stateBar = getStateBarElement(id);
		var btnStart = getBtnStartElement(id);
		var btnDownlaod=getBtnDownloadElement(id);
		
		stateBar.innerHTML=state;
		if(error){
			updateProgressBar (id, 0);
			resetColorsProgressBar (id);
			btnStart.disabled=false;
			btnDownlaod.disabled=true;
		} else{
			btnStart.disabled=false;
			btnDownlaod.disabled=false;
			processStateTabs(id);
			updateProgressBar (id, percent);
		}
	}

	/*** Type Analyse DNA-Seq ***/
	function analyseDNA() {
		document.getElementById("analyseChoice").style.display= "none";
		document.getElementById("analyseChoiceR").style.display= "block";
		document.getElementById("analyseChoiceR").childNodes[1].innerHTML="DNA-Seq";
		document.getElementById("analyseChoiceR").childNodes[1].disabled=true;
		document.getElementById("analyseActivate").style.display= "block";
		analyseType="DNA-Seq";
		document.getElementById("footer").style.position ="relative";
	}

	/*** Type Analyse RNA-Seq ***/
	function analyseRNA() {
		document.getElementById("analyseChoice").style.display= "none";
		document.getElementById("analyseChoiceR").style.display= "block";
		document.getElementById("analyseChoiceR").childNodes[1].innerHTML="RNA-Seq";
		document.getElementById("analyseChoiceR").childNodes[1].disabled=true;
		document.getElementById("analyseChoiceR").disabled=true;
		document.getElementById("analyseActivate").style.display= "block";
		analyseType="RNA-Seq";
		document.getElementById("footer").style.position ="relative";
	}
	
	/*** The return function ***/
	function goBack() {
		document.getElementById("analyseChoice").style.display= "block";
		document.getElementById("analyseChoiceR").style.display= "none";
		document.getElementById("analyseActivate").style.display= "none";
		document.getElementById("footer").style.position ="absolute";
	}

	
/////////////////////////////////////////////////////////Interface////////////////////////////////////////////////////////////////////////
	//Effect in the tabs	
	$(".tabsAn").fadeIn(1000);
	
	//Effect in the principal tabsAn
	$(".tabsAn-a").click(function(){
		//Effect
		$(".menu").slideUp();
		
		if(($(this).attr('id')!= "dna-pr") && ($(this).attr('id')!= "dna-ann")){
			//Initialize ProgressBar
			percent = 0;
			var thisId=$(this).attr('id');
			var btnStart = getBtnStartElement(thisId);
			btnStart.addEventListener("click", function (){
				startProcessing(thisId);
					///////////////////////SSE/////////////////////////
					analyseStep(thisId);
					if (!!window.EventSource) {
						connect(thisId);
					}else {
						console.log("Sorry, your browser doesn't support server-sent events");
					}
					 //////////////////////////////////////////////////
			});
			
			var btnDownload= getBtnDownloadElement(thisId);
			btnDownload.addEventListener("click", function (){
				analyseStepDownload(thisId);
			});
		}	
		
		//Effect
		if ($(this).next().is(":hidden")){
			$(this).next().slideDown(300);
			$(".menu-second").slideUp()
		}
	});
	
	//Effect in the secondary tabs//
	$(".tabsAn-a-second").click(function(){
		//Effect
		$(".menu-second").slideUp();

		if($(this).attr('id')!= "dna-pr-st"){
			percent = 0;
			var thisId=$(this).attr('id');
			var btnStart = getBtnStartElement(thisId);
			btnStart.addEventListener("click", function (){
				startProcessing(thisId);
					///////////////////////SSE/////////////////////////
					analyseStep(thisId);
					if (!!window.EventSource) {
						connect(thisId);
					}else {
						console.log("Sorry, your browser doesn't support server-sent events");
					}
					 //////////////////////////////////////////////////
			});
			
			var btnDownload= getBtnDownloadElement(thisId);
			btnDownload.addEventListener("click", function (){
				analyseStepDownload(thisId);
			});
		}
		
		//Effect
		if ($(this).next().is(":hidden")){
			$(this).next().slideDown(300)
		}
	});



	//On the page Load
	$(document).ready(function() {
		getInfo();
	});