console.log("sanity check");

var l_major_chr_length = [268988, 355712, 384502, 472852, 465823, 516869, 596352, 574960, 573434, 570865, 
						  582573, 675346, 654595, 622644, 629517, 714651, 684829, 739748, 702208, 742537,
						  772972, 716602, 772565, 840950, 912845, 1091540, 1130424, 1160104, 1212663, 1403434,
						  1484328, 1604637, 1583653, 1866748, 2090474, 2682151];
var divAddFileCnv ='<div class= "col s12 offset-s3"><div class="file-field input-field  Divv" id="CnvDiv"><div class="btn btn1"><span>CNV File</span><input type="file" id="fileinputCNV" name="file" multiple></div><div class="file-path-wrapper col s3"><input class="file-path validate" type="text"></div></div><a class="btn-floating btn-small waves-effect waves-light addFileBtn" id="addFileCNV"><i class="material-icons">add</i></a><button id="sendCnvFile" class="btn btn1" type="submit">Send</button></div>'
var divAddFileSnp ='<div class= "col s12 offset-s3"><div class="file-field input-field  Divv" id="SnpDiv"><div class="btn btn1"><span>SNP File</span><input type="file" id="fileinputSNP" name="file" multiple></div><div class="file-path-wrapper col s3"><input class="file-path validate" type="text"></div></div><a class="btn-floating btn-small waves-effect waves-light addFileBtn" id="addFileSNP"><i class="material-icons">add</i></a><button id="sendSNPFile" class="btn btn1" type="submit">Send</button></div>'
var divAddFileIndel ='<div class= "col s12 offset-s3"><div class="file-field input-field  Divv" id="IndelDiv"><div class="btn btn1"><span>INDEL File</span><input type="file" id="fileinputINDEL" name="file" multiple></div><div class="file-path-wrapper col s3"><input class="file-path validate" type="text"></div></div><a class="btn-floating btn-small waves-effect waves-light addFileBtn" id="addFileINDEL"><i class="material-icons">add</i></a><button id="sendIndelFile" class="btn btn1" type="submit">Send</button></div>'
var delButton ='<a class="btn-floating btn-small waves-effect waves-light delFileBtn"><i class="material-icons">highlight_off</i></a>'

$(document).ready(function() {
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
})

function pageLoad() {
	//adding files input
	var divNumber=[0,0,0]
	$(document).on("click",'.addFileBtn', function (event) {
		event.preventDefault();
		console.log("clicked")
		var typeId = $(this).attr('id'); 
		switch (typeId) {
			case "addFileCNV": {
				divNumber[0]++;
				plusButtonEffect("sendCnvFile", typeId, "CnvInput", divAddFileCnv, "CnvDiv", "DivC", divNumber[0]);
			}
			break;
			case "addFileSNP": {
				divNumber[1]++;
				plusButtonEffect("sendSNPFile", typeId, "SNPInput",divAddFileSnp, "SNPDiv", "DivS", divNumber[1]);
			} 
			break;
			case "addFileINDEL": {
				divNumber[2]++;
				plusButtonEffect("sendIndelFile", typeId, "INDELInput",divAddFileIndel, "IndelDiv", "DivI", divNumber[2]);
			} 
			break;
		}
	})

	//deleting file's input is common to cnv/snp/indels, so we let it here
	$(document).on("click",".delFileBtn", function (event) {
		var par = $(this).parent()
		$(par).parent().remove();
	})

	//hidind and showing the svg is common for all 
	$(document).on("change", ".checkIs", function (event) {
		console.log("the id is", this.id)
		var prop = $("#"+this.id).prop("checked");
		var number = this.id[((this.id).length)-1]//attention quand il ya 10 isolats, ceci ne marche pas
		var parent = $("#"+this.id).parent().attr("class");
		if (prop === false) {
			if (parent === "checkBoxCnv") {
				$('#svgCnv'+number).hide();
			} else if (parent === "checkBoxSnp") {
				$('#svgSnp'+number).hide();
			} else if (parent === "checkBoxIndel") {
			//	$('#svgIndel'+number).hide();
			}

		} else {
			if (parent === "checkBoxCnv") {
				$('#svgCnv'+number).show();
			} else if (parent === "checkBoxSnp") {
				$('#svgSnp'+number).show();
			} else if (parent === "checkBoxIndel") {
				//$('#svgIndel'+number).show();
			}

		}
	})

	//chromosomes select function is common for all : cnv/snp/indel
	$(document).on("change", ".selectChr", function (event) {
		var id = $(this).attr("id");
		var selectedVal= $(event.target).val();
		console.log(selectedVal)
		var  l = selectedVal.length;
		console.log("the l is =", l)
		var chr = $('select#'+id+' option').length -1
		console.log('le nombre de chr =', chr)
		var tempo = 0;
		switch (id) {
			case "selChrCnv" : {
				var v = $('#contcnv').children().length;
				console.log("le nombdre de div =", v)
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
						for (k=1; k<=v; k++) {
							// $('rect#ref'+""+k+""+j).hide();
							$('rect#cadre'+""+k+""+j).hide();
							$('#g'+""+k+""+j).hide();
							$("text#txt"+""+k+""+j).hide();
						//hiding all the chr(j)
						}
					} else {
						if (j === parseInt(selectedVal[tempo])) {
						tempo++;
						for(var k=1; k<=v; k++) {
							$('rect#cadre'+""+k+""+j).show();
							$('#g'+""+k+""+j).show();
							$("text#txt"+""+k+""+j).show();
							//showing all the rect and texts
						}
						} else {
							for (k=1; k<=v; k++) {
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

//one function for adding the files input of each type.
function plusButtonEffect(sendButtonId, addButtonId, formClass,divAddFile, divIdName, generalClass, divNumber ) {
	$("#"+sendButtonId).remove();
	$("#"+addButtonId).remove();
	$('.'+ formClass).append(divAddFile);
	$(".Divv").attr('id', divIdName + divNumber);
	$('.Divv').attr("class", "file-field input-field "+generalClass +""+ divNumber );
	$("#"+divIdName+""+(divNumber-1)).append(delButton)
}

//modify y position 
function modifyPositionY(numberChrShown) {
}

//goto x position 
function GoToPositionX(begin, end) {
}
