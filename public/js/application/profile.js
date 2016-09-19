console.log("sanity check profile");
var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/
var fileCard='<div class="card myCardFile"><div class="card-content"><span class="card-title mS activator grey-text text-darken-4 myCardTitle">File name<i class="material-icons right">more_vert</i></span></div><div class="card-reveal"><span class="card-title mS grey-text text-darken-4 secondTitle">File<i class="material-icons right">close</i></span><p class="type"><bold class="bold">Type : </bold></p><p class="path"><bold class="bold">Path : </bold></p><p class="size"><bold class="bold">Size : </bold></p><p class="uploadDate"><bold class="bold">Upload Date : </bold></p></div></div>'
var divFileDetails2='<div class="details filesDetails row col s12 l12 m12 offset-m2" style="margin-bottom: -13px"> <ul class="collection"><li class="collection-item avatar myCol2"><i class="material-icons circle">folder</i><span class="title actionType"> </span><p class="actionStep"> <br></p> <p class="actionDate"></p><br> <p class="actionDateEnd"></p><br> <p class="actionState"></p></li></ul>'


$(document).ready(function() {
    checkUserInfo();
	profileLoad();
	$('.modal-trigger').leanModal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      in_duration: 300, // Transition in duration
      out_duration: 200, // Transition out duration
    });
    $(".button-collapse").sideNav();
})

function profileLoad() {

	$(".edit").on("click", function (event) {
		event.preventDefault();
		$("input").prop('disabled', false);
		$('.edit').text("Cancel");
		$(".update").prop("disabled", false)
		$('.edit').attr("class", "waves-effect waves-light cyan btn cancel");
		$('.cancel').attr("data-tooltip", "Cancel your edit");

	})

	$(document).on('click',".update", function (event) {
		event.preventDefault();
		if (( $("#firstName").val() !=="") && ($("#lastName").val() !=="") && ($("#userName").val() !=="") && ($("#email").val() !=="")) {
			$.post("/"+ user.userName +"/update", $(".updateForm").serialize(), function (response) {
				if (response ==="error") {
					alert("an error occured, please try again")
				} else if (response ==="login exists") {
					alert("choose another userName")
				} else if (response ==="email exists") {
					alert("choose another email")
				} else {
					$('#firstName').val(''+response.user.firstName);
					$("#lastName").val(''+response.user.lastName);
					$("#userName").val(''+response.user.userName);
					$("#email").val(''+response.user.email);
					$(".Uname").remove();
					$(".parent").prepend('<li class="Uname"><a href="/profile/'+response.user.userName +'" id="uName"><i  class="material-icons left ">account_circle</i>'+response.user.userName+'</a></li>')
					$(".parentM").prepend('<li class="Uname"><a href="/profile/"'+response.user.userName +'" id="uNameM"><i class="material-icons left myIcon ">account_circle</i>'+response.user.userName+'</a></li>')
					user = response.user;
					window.location.href="/profile/"+ response.user.userName
				}
			})
		} else {
			alert("fuck u")
		}
	})

	$('.cancel').on("click", function (event) {
		event.preventDefault();
		$("input").prop('disabled', true);
		$(".update").prop("disabled", true)
		$('.cancel').text("Edit");
		$('.cancel').attr("class", "waves-effect waves-light cyan btn edit");
		$('.edit').attr("data-tooltip", "Click here to edit your personnal information")
	})
}

function checkUserInfo() {
	$.get('/current_user' , function (response) {
		$('#firstName').val(''+response.user.firstName);
		$("#lastName").val(''+response.user.lastName);
		$("#userName").val(''+response.user.userName);
		$("#email").val(''+response.user.email);
	})

	$.get('/current_user/Historique', function (response) {
		if (response.message === "Error") {
			console.log("error")
			
		} else if (response.message ==="Empty") {
			console.log("Empty")
		} else {
			var file= response.message.fileInformation;
			console.log(file)
			var l = file.length; 
			for (var i=0; i< l; i++) {
				$(".theFiles").append(fileCard); 
				$(".myCardTitle").attr("class", "card-title mS activator grey-text text-darken-4 myCardTitle"+i);
				$('.myCardTitle'+i).html('<i class="material-icons right">more_vert</i>' + file[i].fileName )
				
				$(".secondTitle").attr("class", "card-title mS grey-text text-darken-4 secondTitle"+i);
				$('.secondTitle'+i).html('<i class="material-icons right">close</i>' + file[i].fileName )
				

				$(".type").attr("class", "type"+i);
				$('.type'+i).html('<bold class="bold">Type : </bold>' + file[i].fileType);
				$('.path').attr("class", 'path'+i);
				$(".path"+i).html('<bold class="bold">Path : </bold>'+ file[i].filePath);
				$(".size").attr("class", "size"+i);
				$(".size"+i).html( '<bold class="bold">Size : </bold>'+ Math.round(file[i].fileSize * 100 / (1024 * 1024)) / 100 + ' MB');
				$('.uploadDate').attr("class","uploadDate"+i);
				$('.uploadDate'+i).html('<bold class="bold">Upload date : </bold>'+ file[i].uploadDate)
				switch (file[i].fileType) {
					case 'CNV': {
						$($('.myCardTitle'+i).parent()).attr("class", "card-content CNV");
						break;
					} 
					case "Gff": {
						$($('.myCardTitle'+i).parent()).attr("class", "card-content GFF")	
						break;
					} 
					case "Fasta": {
						$($('.myCardTitle'+i).parent()).attr("class", "card-content FASTA")
						break;
					}
					case 'Fastq': {
						$($('.myCardTitle'+i).parent()).attr("class", "card-content FASTQ");
						break;
					}
					case "Indels": {
						$($('.myCardTitle'+i).parent()).attr("class", "card-content INDEL");
						break;
					}
					case "Snp": {
						$($('.myCardTitle'+i).parent()).attr("class", "card-content SNP");
						break;
					}
				}


			}
		}
			
	})

 	$.get("/current_user/files", function(response) {

 	})

 	$.get("/current_user/actions", function(response) {
 		 if (response.message ==="Error") {

 		 } else {
 		 	if (response.message === null) {
 		 		//html : no analyze done
 		 	} else {
 		 		console.log("exists")
 		 		var len= response.message.length
 		 		console.log("the step ", response.message)
 		 		for (var i=0; i<len; i++ ) {
 		 			switch (response.message[i].actionStep) {
						case "dna-qc": {
							histo("analyzeHisto", response.message[i], i, 'Quality control')
						} break;
						case "dna-al": {
							histo("analyzeHisto", response.message[i], i, 'Alignment')
						}break;
						case 'dna-clf': {
							histo("analyzeHisto", response.message[i], i, 'Cleaning Fastq')
						}break;
						case "dna-cv": {
							histo("analyzeHisto", response.message[i], i, 'Convertion')
							
						}break;
						case "dna-clb" : {
							histo("analyzeHisto", response.message[i], i, 'Cleaning BAM')
						} break;
						case "dna-pr-variant": {
							histo("analyzeHisto", response.message[i], i, 'Variant Call')
						}break;
						case "dna-pr-snp": {
							histo("analyzeHisto", response.message[i], i, 'SNP Call')
						}break;
						case "dna-pr-indel": {
							 histo("analyzeHisto", response.message[i], i, 'INDEL Call')
						}break;
						case "dna-pr-cnv": {
							 histo("analyzeHisto", response.message[i], i, 'CNV Call')
						}break;
						case "dna-pr-sv": {
							histo("analyzeHisto", response.message[i], i, 'SV Call')
							
						}break;
						case "dna-ann-snp": {
							histo("analyzeHisto", response.message[i], i, 'SNP Annotation')
						}break;
						case "dna-ann-indel": {
							histo("analyzeHisto", response.message[i], i, 'INDEL Annotation')
						}break;
						case "dna-ann-del": {
							histo("analyzeHisto", response.message[i], i, 'Deletion Annotation')
						}break;
						case "dna-ann-ins": {
							histo("analyzeHisto", response.message[i], i, 'Insertion Annotation')
						}break;
						case "GFF": {
							histo("visualizeHisto", response.message[i], i, 'GFF Visualization')
						}break;
						case "SNP": {
							console.log("CNV CASE")
							histo("visualizeHisto", response.message[i], i, 'SNP Visualization')
						}break;
						case "INDEL": {
							histo("visualizeHisto", response.message[i], i, 'INDEL Visualization')
						}break;
						case "CNV": {
							console.log("CNV CASE")
							histo("visualizeHisto", response.message[i], i, 'CNV Visualization')
						}break;

					}
 		 		}
 		 	}
 		 }
 	})
}

// response.message[i] in response
function histo(div, response, i, stepName) {
	$("#"+div).append(divFileDetails2)
	$(".fileDetails").attr("class","details row col s12 l8 m8 offset-s2 filesDetails"+i);
	$(".actionType").html("<b>Name: </b>"  + "<span class='bl2'>"+ response.actionType+ "</span>");
	$(".actionType").attr("class", 'title actionType'+i);
	$(".actionStep").html('<b>Step: </b>' + "<span class='bl2'>"+  stepName +'</span>');
	$(".actionStep").attr('class',"actionStep" + i);
	$(".actionDate").html( "<span class='bl2'>"+ response.actionDate+ "</span>");
	$(".actionDate").attr("class", "actionDate"+i);
	$(".actionDateEnd").html( "<b>Ended on:" + "<span class='bl2'>"+ response.actionDateEnd +"</span>");
	$(".actionDateEnd").attr("class", "actionDateEnd"+i);
	$(".actionState").html("<b>"+ response.actionState +"</b>")
}