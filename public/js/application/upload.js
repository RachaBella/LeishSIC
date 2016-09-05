console.log("upload checked")
var divUpload = '<div class="col s12 containerUpload" id="new"><div class="input-field col s2 type offset-s3" id=""><select class="selectType" id="selectType0" name="selectValue"><option value="" disabled selected>Choose File type</option><option value="Fasta">Fasta</option><option value="Fastq">Fastq</option><option value="Gff">Gff</option><option value="CNV">CNV</option><option value="SNP">SNP</option><option value="Indels">Indels</option></select></div><div class="file-field input-field col s8 uploadInput"><div class="file-path-wrapper col s4"><input class="file-path validate" type="text" placeholder="Upload one or more files"></div><div class="btn btn1"><span>Choose your file</span><input type="file" id="fileToUpload0" name="fileUploaded"></div></div>'
var delButton ='<a class="btn-floating btn-small waves-effect waves-light delFileUploadBtn" style="margin-left:5px"><i class="material-icons myCard">highlight_off</i></a>' 
var divFileDetails='<div class="details filesDetails row" style="display:none"><p class="nameFile">Name : </p><p class="sizeFile">Size : </p></div>'
var divFileDetails2='<div class="details filesDetails row col s12 l6 m6 offset-s3" style="display:none"> <ul class="collection"><li class="collection-item avatar myCol"><i class="material-icons circle">folder</i><span class="title nameFile">Name: </span><p class="sizeFile">Size:  <br> Second Line</p><p class="typeFile"></p></li></ul>'
var inputPath= '<input type="text" name="filePath" id="filePath0" style="display: none">'
var divNumber = 0;
var files = [];
$(document).ready(function() {
	$('ul.tabs').tabs();
	pageUpload();

})

function pageUpload() {
	$("select").material_select();
	$("#addFiles").on("click", function (event) {
		event.preventDefault();
		divNumber++;
		console.log("divNumber =", divNumber);
		addFileInputEffect(divNumber)
	})

	$(document).on("click", ".delFileUploadBtn", function (event) {
		event.preventDefault();
		$($($(this).parent()).parent()).remove()
		divNumber--;
	})

	$(".uploadForm").on("submit", function(event) {
		event.preventDefault();
		$('.details').remove();
		$(".determinate").css("width", 0+ "%");
		$('.percentage').text(0 +"%")
		console.log(divNumber)
		if (document.getElementById('fileToUpload0').files.length ===0) {
			sweetAlert("oups..","No file is uploaded, please upload at least one file", "error");
		} else {
			console.log(" values :" + $($( ".selectType option:selected" )[0]).val() + " " + $($( ".selectType option:selected" )[1]).val())
			var file = document.getElementById('fileToUpload0').files[0];
			var f = file.length;
			for (var i =0 ; i<=divNumber; i++) {
				$('.contDiv').prepend(divFileDetails2);
				var file = document.getElementById('fileToUpload'+i).files[0];
				$(".filesDetails").attr('class', "details col s12 l6 m6 offset-s3 filesDetails"+ i);
				$('.filesDetails'+i).attr("style", "margin-left: 25% !important")
				$(".filesDetails"+ i).css('display', "block");
				$(".nameFile").attr('class', "title nameFile"+ i);
				$('.typeFile').attr('class', "title typeFile"+ i);
				$('.nameFile'+i).text(file.name)
				
				$('.typeFile'+i).text($($( "#selectType"+i+ " option:selected" )).val())
				$('.nameFile'+i).css("color", 'black')
				$(".sizeFile").attr('class', "sizeFile"+ i);
				$('.sizeFile'+i).css("color", "black");
				$('.sizeFile'+i).text(Math.round(file.size * 100 / (1024 * 1024)) / 100 + ' MB')
				// $('.pathFile'+i).text('Path:'+ document.getElementById('fileToUpload'+i).value)
				
			}

			$(".progr").css("display","block")
			$(".uploader").css("display","block");
			$(".percent").css("display","block");
			var name = ($("#uName").text()).replace("account_circle","")
			name=name.replace(" ","")
			$(this).ajaxSubmit({
				url: "/users/"+name+ "/upload/files" ,
				beforeSubmit: function() {
					
                },
                uploadProgress: function (event, position, total, percentComplete) {
                	$(".determinate").css("width", percentComplete+ "%")
                	$('.percentage').text(percentComplete +"%")
                	//$(".filesDetails").append('<p id="progress-status">' + percentComplete +' %</p>')
                },
                success: function( response) {
                	if (response.message ==="Success") {
                		$(".uploader").hide();
                		 swal("Done!", "Uploaded with success", "success")
                	}
                },
                error: function(xhr) {
                	$(".uploader").hide();
		        	alert('Error: ' + xhr.status + " " + xhr.message);
		        },
                resetForm:true
			})
		}
		return false;
	})
}

function addFileInputEffect(divNumber) {
	$('.uploadForm').prepend(divUpload);
	$(".uploadInput").append(delButton);
	$(".uploadInput").attr("class", "file-field input-field col s7 uploadInput"+ divNumber)
	$('#fileToUpload0').attr("id", "fileToUpload"+divNumber);
	$('#selectType0').attr("id", "selectType"+divNumber);
	$('#new').attr("class", "col s12 containerUpload"+ divNumber)
	$(".containerUpload"+ divNumber).attr("id", "new"+ divNumber);
	$('select').material_select();

}