console.log("sanity check app");

var l_major_chr_length = [268988, 355712, 384502, 472852, 465823, 516869, 596352, 574960, 573434, 570865, 
						  582573, 675346, 654595, 622644, 629517, 714651, 684829, 739748, 702208, 742537,
						  772972, 716602, 772565, 840950, 912845, 1091540, 1130424, 1160104, 1212663, 1403434,
						  1484328, 1604637, 1583653, 1866748, 2090474, 2682151];
var divAddFileCnv ='<div class= "col s12 offset-s3"><div class="big col s6"><div class="input-field col s10  type Divv" id="divSelectTypeCNV"><select class="selectType" name="selectCNV" id="selectCNV"><option value="" disabled selected>Choose your CNV uploaded files</option><option value="cnvU"></option></select></div><br></div><br><a class="btn-floating btn-small waves-effect waves-light addFileBtn myCard" id="addFileCNV"><i class="material-icons">add</i></a><button id="sendCnvFile" class="btn btn1" type="submit">Send</button>	</div>'
var divAddFileSnp ='<div class= "col s12 offset-s3"><div class="big col s6"><div class="input-field col s10  type Divv" id="divSelectTypeSNP"><select class="selectType" name="selectSNP" id="selectCNV"><option value="" disabled selected>Choose your SNP uploaded files</option><option value="snpU"></option></select></div><br></div><br><a class="btn-floating btn-small waves-effect waves-light addFileBtn myCard" id="addFileSNP"><i class="material-icons">add</i></a><button id="sendSNPFile" class="btn btn1" type="submit">Send</button>	</div>'
var divAddFileIndel ='<div class= "col s12 offset-s3"><div class="big col s6"><div class="input-field col s10  type Divv" id="divSelectTypeIndel"><select class="selectType" name="selectIndel" id="selectIndel"><option value="" disabled selected>Choose your Indel uploaded files</option><option value="indelU"></option></select></div><br></div><br><a class="btn-floating btn-small waves-effect waves-light addFileBtn myCard" id="addFileIndel"><i class="material-icons">add</i></a><button id="sendIndelFile" class="btn btn1" type="submit">Send</button>	</div>'
var delButton ='<a class="btn-floating btn-small waves-effect waves-light delFileBtn"><i class="material-icons">highlight_off</i></a>'
var divNumber=[0,0,0]
$(document).ready(function() {
	checkUser();
	pageLoad();
	$('.slider').slider({full_width: true});
	$('.parallax').parallax();
	$('.modal-trigger').leanModal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      in_duration: 300, // Transition in duration
      out_duration: 200, // Transition out duration
    });
    $(".button-collapse").sideNav();
	$('select').material_select();
	 $('.collapsible').collapsible({
      });
})

function pageLoad() {
	//adding files input
	// $(document).on("click",'.addFileBtn', function (event) {
	// 	event.preventDefault();
	// 	var typeId = $(this).attr('id'); 
	// 	switch (typeId) {
	// 		case "addFileCNV": {
	// 			divNumber[0]++;
	// 			plusButtonEffect("sendCnvFile", typeId, "CnvInput", divAddFileCnv, "divSelectTypeCNV", "DivC", "selectCNV", divNumber[0]);
	// 		}
	// 		break;
	// 		case "addFileSNP": {
	// 			divNumber[1]++;
	// 			plusButtonEffect("sendSNPFile", typeId, "SNPInput",divAddFileSnp, "divSelectTypeSNP", "DivS", "selectSNP", divNumber[1]);
	// 		} 
	// 		break;
	// 		case "addFileIndel": {
	// 			divNumber[2]++;
	// 			plusButtonEffect("sendIndelFile", typeId, "INDELInput",divAddFileIndel, "divSelectTypeIndel", "DivI", "selectIndel", divNumber[2]);
	// 		} 
	// 		break;
	// 	}
	// })

	// //deleting file's input is common to cnv/snp/indels, so we let it here
	// $(document).on("click",".delFileBtn", function (event) {
	// 	var par = $(this).parent()
	// 	var id=  $($($(par).parent()).parent()).attr("id")
	// 	switch (id){
	// 		case "CNV": {
	// 			divNumber[0]--
	// 		}break;
	// 		case "SNP": {
	// 			divNumber[1]--
	// 		} break;
	// 		case "INDEL":{
	// 			divNumber[2]--
	// 		} break;
	// 	}
	// 	$(par).parent().remove();
	// })

	//zoomIn function is common
	$(document).on("click", ".zoomIn", function (event) {
		event.preventDefault();
		// var buttonId = $(this).attr("id")
		var buttonParentclass  = $($(this).parent()).attr("class");
		buttonParentclass = buttonParentclass.replace("row col s12 l9 m9 offset-s3 ","");
		switch (buttonParentclass) {
			case "cnvZoomButtons" : {
				var number = $('.cnvZoomButtons').attr("id");
				number = number.replace("cnvZommButtons","");
				var panZoom = svgPanZoom("#svg"+number)
				panZoom.zoomIn();

			} break;
			case "snpZoomButtons" : {
				var number = $('.snpZoomButtons').attr("id");
				number = number.replace("snpZommButtons","");
				var panZoom = svgPanZoom("#svgSNP"+number);
				panZoom.zoomIn();

			} break;
			case "indelZoomButtons" : {
				var number = $('.indelZoomButtons').attr("id");
				number = number.replace("indelZommButtons","");
				var panZoom = svgPanZoom("#svgINDEL"+number)
				panZoom.zoomIn();

			}
		}
	} )

	//ZoomOut function is common
	$(document).on("click", ".zoomOut", function (event) {
		event.preventDefault();
		var buttonParentclass  = $($(this).parent()).attr("class");
		buttonParentclass = buttonParentclass.replace("row col s12 l9 m9 offset-s3 ","");
		switch (buttonParentclass) {
			case "cnvZoomButtons" : {
				var number = $('.cnvZoomButtons').attr("id");
				number = number.replace("cnvZommButtons","");
				var panZoom = svgPanZoom("#svg"+number)
				panZoom.zoomOut();

			} break;
			case "snpZoomButtons" : {
				var number = $('.snpZoomButtons').attr("id");
				number = number.replace("snpZommButtons","");
				var panZoom = svgPanZoom("#svgSNP"+number)
				panZoom.zoomOut();

			} break;
			case "indelZoomButtons" : {
				var number = $('.indelZoomButtons').attr("id");
				number = number.replace("indelZommButtons","");
				var panZoom = svgPanZoom("#svgINDEL"+number)
				panZoom.zoomOut();

			}
		}
	} )

	//zoomReset is common for all
	$(document).on("click", ".zoomReset", function (event) {
		event.preventDefault();
		var buttonParentclass  = $($(this).parent()).attr("class");
		buttonParentclass = buttonParentclass.replace("row col s12 l9 m9 offset-s3 ","");
		switch (buttonParentclass) {
			case "cnvZoomButtons" : {
				var number = $('.cnvZoomButtons').attr("id");
				number = number.replace("cnvZommButtons","");
				var panZoom = svgPanZoom("#svg"+number)
				panZoom.resetZoom();
				panZoom.pan({x:60, y:10})
				$('html,body, .svgg').animate({
	                    scrollTop: $('.svgg').offset().top -400
	            }, 1000)
	            $('#svg'+number).scrollLeft(0)

			} break;
			case "snpZoomButtons" : {
				var number = $('.snpZoomButtons').attr("id");
				number = number.replace("snpZommButtons","");
				var panZoom = svgPanZoom("#svgSNP"+number)
				panZoom.resetZoom();
				panZoom.pan({x:60, y:10})
				$('html,body, .svggSnp').animate({
	                    scrollTop: $('.svggSnp').offset().top -400
	            }, 1000)
	            $('#svgSnp'+number).scrollLeft(0)

			} break;
			case "indelZoomButtons" : {
				var number = $('.indelZoomButtons').attr("id");
				number = number.replace("indelZommButtons","");
				var panZoom = svgPanZoom("#svgINDEL"+number)
				panZoom.resetZoom();
				panZoom.pan({x:60, y:10})
				$('html,body, .svggIndel').animate({
	                    scrollTop: $('.svggIndel').offset().top -400
	            }, 1000)
	            $('#svgIndel'+number).scrollLeft(0)

			}
		}
	} )

	//hidind and showing the svg is common for all 
	$(document).on("change", ".checkIs", function (event) {
		console.log("the id is", this.id)
		var prop = $("#"+this.id).prop("checked");
		var number = this.id[((this.id).length)-1]//attention quand il ya 10 isolats, ceci ne marche pas
		var parent = $("#"+this.id).parent().attr("class");
		if (prop === false) {
			if (parent === "checkBoxCnv") {
				$('#svgCnv'+number).hide();
				$("#cnvZommButtons"+number).hide()
			} else if (parent === "checkBoxSnp") {
				$('#svgSnp'+number).hide();
				$("#snpZommButtons"+number).hide()
			} else if (parent === "checkBoxIndel") {
			//	$('#svgIndel'+number).hide();
			// $("#indelZommButtons"+number).hide()
			}

		} else {
			if (parent === "checkBoxCnv") {
				$('#svgCnv'+number).show();
				$("#cnvZommButtons"+number).show()
			} else if (parent === "checkBoxSnp") {
				$('#svgSnp'+number).show();
				$("#snpZommButtons"+number).show()
			} else if (parent === "checkBoxIndel") {
				//$('#svgIndel'+number).show();
				// $("#indelZommButtons"+number).hide()
			}
		}
	})

	//chromosomes select function is common for all : cnv/snp/indel
	$(document).on("change", ".selectChr", function (event) {
		var id = $(this).attr("id");
		var selectedVal= $(event.target).val();
		console.log("the id is", id)
		console.log(selectedVal)
		var  l = selectedVal.length;
		console.log("the l is =", l)
		var chr = $('select#'+id+' option').length -1
		console.log('le nombre de chr =', chr)
		var tempo = 0;
		switch (id) {
			case "selChrCnv" : {
				var v = $('#contcnv').children().length;
				console.log("le nombdre de div =", v);
				v= v/2;
				for (var j=1; j<=chr; j++) {
					if (l===0) {
						for (k=1; k<=v; k++) {
							$('rect#ref'+""+k+""+j).show();
							$('rect#cadre'+""+k+""+j).show();
							$('rect#chr'+""+k+""+j).show();
							$("text#txt"+""+k+""+j).show();
							$("#Ref_Chr"+""+k+""+j).show();
						
						}

					} else {
						if (tempo === l) {
						for (k=1; k<=v; k++) {
							$('rect#ref'+""+k+""+j).hide();
							$('rect#cadre'+""+k+""+j).hide();
							$('rect#chr'+""+k+""+j).hide();
							$("text#txt"+""+k+""+j).hide();
							$("#Ref_Chr"+""+k+""+j).hide();
						//hiding all the chr(j)
						}
					} else {
						if (j === parseInt(selectedVal[tempo])) {
						tempo++;
						for(var k=1; k<=v; k++) {
							$('rect#chr'+""+k+""+j).show();
							$('rect#cadre'+""+k+""+j).show();
							$('rect#ref'+""+k+""+j).show();
							$("text#txt"+""+k+""+j).show();
							$("#Ref_Chr"+""+k+""+j).show();
							//showing all the rect and texts
						}
						} else {
							for (k=1; k<=v; k++) {
								$('rect#ref'+""+k+""+j).hide();
								$('rect#cadre'+""+k+""+j).hide();
								$('rect#chr'+""+k+""+j).hide();
								$("text#txt"+""+k+""+j).hide();
								$("#Ref_Chr"+""+k+""+j).hide();
							//hiding all the chr(j)
							}
						}
					}	

					}
					
				}
			}
			break;
			case "selChrSnp" : {
				var v = $('#contsnp').children().length;
				console.log("le nombdre de div =", v);
				for (var j=1; j<=chr; j++) {
					if (tempo === l) {
						for (k=1; k<=(v/2); k++) {
							// $('rect#ref'+""+k+""+j).hide();
							$('rect#cadre'+""+k+""+j).hide();
							$('#g'+""+k+""+j).hide();
							$("text#txt"+""+k+""+j).hide();
						//hiding all the chr(j)
						}
					} else {
						if (j === parseInt(selectedVal[tempo])) {
						tempo++;
						for(var k=1; k<=(v/2); k++) {
							$('rect#cadre'+""+k+""+j).show();
							$('#g'+""+k+""+j).show();
							$("text#txt"+""+k+""+j).show();
							//showing all the rect and texts
						}
						} else {
							for (k=1; k<=(v/2); k++) {
								$('rect#cadre'+""+k+""+j).hide();
								$('#g'+""+k+""+j).hide();
								$("text#txt"+""+k+""+j).hide();
							//hiding all the chr(j)
							}
						}
					}	
				}
			}
			break;
			case "selChrIndel": {
				var v = $('#contindl').children().length;
				console.log("le nombdre de div =", v)
			}
			break;
		}
    })
}

// //one function for adding the files input of each type.
// function plusButtonEffect(sendButtonId, addButtonId, formClass,divAddFile, divIdName, generalClass, internSelect, divNumber ) {
// 	$("#"+sendButtonId).remove();
// 	$("#"+addButtonId).remove();
// 	$('.'+ formClass).append(divAddFile);
// 	$(".Divv").attr('id', divIdName + divNumber);
// 	$('.Divv').attr("class", "input-field col s10 type "+generalClass +""+ divNumber );
// 	$(".selectType").attr("id", internSelect+ ""+ divNumber )
// 	$('.selectType').attr("class", "selectType"+ divNumber)
// 	$(".big").attr("class", "col s6 big"+""+internSelect+""+divNumber)
// 	$(".big"+""+internSelect+""+""+ (divNumber-1)).append(delButton)
// 	$('select').material_select();
// }

//modify y position 
function modifyPositionY(numberChrShown) {
}

//goto x position 
function GoToPositionX(begin, end) {
}

function checkUser() {
	$.get('/current_user', function (response) {
		if (response.user) {
			getFilesSelect(response.user._id)
			return response.user
		} else if (response.user === null) {
			$.get('/', function (response) {	
			})
		}
	})
}


function getFilesSelect(id) {
	$.get("/getFilesInfo/"+id, function (response) {
		console.log(response)
		debugger
		if (response.message === "Error") {
			console.log('error')
		} else if (response.message ==="file not found") {
			var select = document.getElementById("selectGff");
			select.options[select.options.length] = new Option("No Gff file uploaded");
			var select1 = document.getElementById("selectCNV");
			select1.options[select1.options.length] = new Option("No CNV file uploaded");
			var select2 = document.getElementById("selectSNP");
			select2.options[select2.options.length] = new Option("No SNP file uploaded");
			var select3 = document.getElementById("selectIndel");
			select3.options[select3.options.length] = new Option("No INDEL file uploaded");
			select3.options[select3.options.length]

			$('select').material_select();
		} else {
			var l = response.message.length,
			    Gnumber = 0,
				CnvNumber=0,
				snpNumber=0,
				indelNumber=0;
			for (var i =0 ;i <l ; i++) {
				var type = response.message[i].metadata.type	
				switch (type) {
					case "Gff": {
						var select = document.getElementById("selectGff");
						select.options[select.options.length] = new Option(response.message[i].filename);
						var select2 = document.getElementById("selectGffRelated");
						select2.options[select2.options.length] = new Option(response.message[i].filename)
						Gnumber++
					} break;
					case "SNP": {
						var select = document.getElementById("selectSNP");
						select.options[select.options.length] = new Option(response.message[i].filename);
						snpNumber++;
					} break;
					case "Indels": {
						var select = document.getElementById("selectIndel");
						select.options[select.options.length] = new Option(response.message[i].filename);
						indelNumber++
					} break;
					case "CNV": {
						var select = document.getElementById("selectCNV");
						select.options[select.options.length] = new Option(response.message[i].filename);
						CnvNumber++;

					} break;
				}
			}
			$('select').material_select();
			if (Gnumber ===0) {
				var select = document.getElementById("selectGff");
				select.options[select.options.length] = new Option("No Gff file uploaded");
				$(select).material_select();
			}
			if (CnvNumber ===0) {
				var select = document.getElementById("selectCNV");
				select.options[select.options.length] = new Option("No CNV file uploaded");
				$(select).material_select();
			}
			if (snpNumber ===0) {
				var select1 = document.getElementById("selectSNP");
				select1.options[select1.options.length] = new Option("No SNP file uploaded");
				$(select).material_select();
			}
			if (indelNumber ===0) {
				var select2 = document.getElementById("selectIndel");
				select2.options[select2.options.length] = new Option("No Indel file uploaded");
				$(select).material_select();
			}
			
		}
	})
}