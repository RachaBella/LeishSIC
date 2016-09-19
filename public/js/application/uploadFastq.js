
console.log("checking test")

var SelectedFile;
var socket = io.connect();
var FReader;
var Name;
$(document).ready(function() {
	loadPageUp();
})
    function loadPageUp() {
		if(window.File && window.FileReader){ //These are the relevant HTML5 objects that we are going to use 
			console.log("heeeeeeeeeeeeeeeere")
	        $(document).on("click", "#sendFile2",  function() {
				console.log("SELECTED FIle", SelectedFile.name)
				if(document.getElementById('FileBox').value != "") {
					$(".progr2").css("display","block")
					$(".uploader2").css("display","block");
			        $(".percent2").css("display","block");
			        $(".MB").css("display","block");
			        $(".goTo").css("display","none")
			        FReader = new FileReader();
			        Name = SelectedFile.name
			        var Content = "<span id='NameArea'>Uploading " + SelectedFile.name + " as " + Name + "</span>";
			        // Content += '<div id="ProgressContainer"><div id="ProgressBar"></div></div><span id="percent">0%</span>';
			        Content += "<span id='Uploaded'> - <span id='MB'>0</span>/" + Math.round(SelectedFile.size / 1048576) + "MB</span>";
			        
			        // document.getElementById('UploadArea').innerHTML = Content;
			        FReader.onload = function(evnt){
			            socket.emit('Upload', { 'Name' : Name, Data : evnt.target.result });
			        }
			        socket.emit('Start', { 
			        	'Name' : Name, 
			        	'Size' : SelectedFile.size 
			        });

			        socket.on('MoreData', function (data){
					    UpdateBar(data['Percent']);
					    var Place = data['Place'] * 524288; //The Next Blocks Starting Position
					    var NewFile; //The Variable that will hold the new Block of Data
					    if(SelectedFile.webkitSlice) 
					        NewFile = SelectedFile.webkitSlice(Place, Place + Math.min(524288, (SelectedFile.size-Place)));
					    else
					        NewFile = SelectedFile.slice(Place, Place + Math.min(524288, (SelectedFile.size-Place)));
					    FReader.readAsBinaryString(NewFile);
					    
					});
					socket.on('Done', function (data){
						 swal("Done!", "Uploaded with success", "success")
						 $('.percentage2').text("100%")
						 UpdateBar(100)
						 $(".uploader2").hide();
						 $(".goTo").css("display","block")
						var Content = "<button	type='button' name='Upload' value='' id='Restart' class='Button'>Upload Another</button>";
						// document.getElementById('UploadArea').innerHTML = Content;
						// document.getElementById('Restart').addEventListener('click', location.reload(true));
					});	
			    } else {
		       		 swal("Error","Please choose a file", "error" )
		    	}

			});

	        $("#FileBox").on("change", function FileChosen( event) {
					console.log("file chosen")
					SelectedFile = event.target.files[0];
			});
    }
    else
    {
        document.getElementById('UploadArea').innerHTML = "Your Browser Doesn't Support The File API Please Update Your Browser";
    }
	}
	
	
	

	function UpdateBar(percent){
	 $(".determinate2").css("width", percent + "%")
	 $(".determinate2").css("background-color","#8b0000");
	 $('.percentage2').text( (Math.round(percent*100)/100) +"%")
    // document.getElementById('ProgressBar').style.width = percent + '%';
    // document.getElementById('percent').innerHTML = (Math.round(percent*100)/100) + '%';
    var MBDone = Math.round(((percent/100.0) * SelectedFile.size) / 1048576);
    $("#MB").html( 'Downloaded : <b>'+ MBDone+ "</b>/"+ Math.round(SelectedFile.size / 1048576) + "MB");
    
}