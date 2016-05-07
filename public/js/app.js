console.log("sanity check");
var l_major_chr_length = [268988, 355712, 384502, 472852, 465823, 516869, 596352, 574960, 573434, 570865, 
						  582573, 675346, 654595, 622644, 629517, 714651, 684829, 739748, 702208, 742537,
						  772972, 716602, 772565, 840950, 912845, 1091540, 1130424, 1160104, 1212663, 1403434,
						  1484328, 1604637, 1583653, 1866748, 2090474, 2682151];
var color_panel = ["blue", "red", "yellow", "green", " purple lighten-5", "red accent-1", "cyan lighten-4", "grey lighten-3"];
var svgDiv='<div id="svgCnv" class="card-panel blue lighten-5 col s6" style="margin-top:50px"></div>'
var divAddFileCnv ='<div class= "col s12 offset-s3"><div class="file-field input-field  Divv" id="CnvDiv"><div class="btn btn1"><span>CNV File</span><input type="file" id="fileinputCNV" name="file" multiple></div><div class="file-path-wrapper col s3"><input class="file-path validate" type="text"></div></div><a class="btn-floating btn-small waves-effect waves-light addFileBtn" id="addFileCNV"><i class="material-icons">add</i></a><button id="sendCnvFile" class="btn btn1" type="submit">Send</button></div>'
var divAddFileSnp ='<div class= "col s12 offset-s3"><div class="file-field input-field  Divv" id="SnpDiv"><div class="btn btn1"><span>SNP File</span><input type="file" id="fileinputSNP" name="file" multiple></div><div class="file-path-wrapper col s3"><input class="file-path validate" type="text"></div></div><a class="btn-floating btn-small waves-effect waves-light addFileBtn" id="addFileSNP"><i class="material-icons">add</i></a><button id="sendSNPFile" class="btn btn1" type="submit">Send</button></div>'
var divAddFileIndel ='<div class= "col s12 offset-s3"><div class="file-field input-field  Divv" id="IndelDiv"><div class="btn btn1"><span>INDEL File</span><input type="file" id="fileinputINDEL" name="file" multiple></div><div class="file-path-wrapper col s3"><input class="file-path validate" type="text"></div></div><a class="btn-floating btn-small waves-effect waves-light addFileBtn" id="addFileINDEL"><i class="material-icons">add</i></a><button id="sendIndelFile" class="btn btn1" type="submit">Send</button></div>'
var delButton ='<a class="btn-floating btn-small waves-effect waves-light delFileBtn"><i class="material-icons">highlight_off</i></a>'
var checkBoxeIsolatCNV='<input type="checkbox" id="isolat" class="checkIs" checked=""/><label id="lab" for="isolat">Isolat</label>'

$(document).ready(function() {
	pageLoad();
});

function pageLoad() {

	$('select').material_select();
	//adding files input
	var divNumber=[0,0,0]
	$(document).on("click",'.addFileBtn', function (event) {
		event.preventDefault();
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
		// $("#sendCnvFile").remove();
		// $(".addFileBtn").remove();
		// $(".CnvInput").append(divAddFile);
		// $(".Divv").attr("id", "CnvDiv"+ divNumber);
		// $(".Divv").attr("class", "file-field input-field Divv"+ divNumber);
		// $('#CnvDiv'+(divNumber-1)).append(delButton);
	})

	//one function for adding the files input of each type.
	function plusButtonEffect(sendButtonId, addButtonId, formClass,divAddFile, divIdName, generalClass, divNumber ) {
		$("#"+sendButtonId).remove();
		$("#"+addButtonId).remove();
		$('.'+ formClass).append(divAddFile);
		$(".Divv").attr('id', divIdName + divNumber);
		$('.Divv').attr("class", "file-field input-field "+generalClass +""+ divNumber );
		$("#"+divIdName+""+(divNumber-1)).append(delButton)
	}

	//deleting file's input
	$(document).on("click",".delFileBtn", function (event) {
		var par = $(this).parent()
		$(par).parent().remove();
	})

	//gff representation 
	$(".gffInput").on('submit', function (event) {
		event.preventDefault();
		var data = new FormData(this)
		$.ajax('/GffData', {
	      type: 'POST',
	      data: data,
	      processData: false,
	      contentType: false,
	      success : function (response) {
	      	if (response ==="ERROR") {
	      		alert("Une erreur s'est produite, veuillez re Uploader votre fichier !");
	      	}
	      	else {
	      		drawChromosomes(response);
	      	}
	      },
	      error : function (response) {
	      	console.log(response);
	      	alert("Une erreur s'est produite, veuillez re Uploader votre fichier !");
	      },
	      complete : function(resultat, statut){
	      	console.log(resultat);
       	  }
	    })
	    
	})

	$(document).on("submit",".CnvInput", function (event) {
		event.preventDefault();
		var data = new FormData(this);
		if ( document.getElementById('fileinputCNV').files.length === 0) {
			sweetAlert("oups..","No file is uploaded, please upload at least one file", "error");
		} else {
			$('.svgg').remove();
			$.ajax('/CnvData', {
				type: 'POST',
				data: data,
				processData: false,
				contentType: false,
				success: function (response) {
					var l = response.length
					console.log("the length is", l)
						for (var i=0; i< l; i++) {
						 	var ll= response[i].length
						 	for (var j=0; j<ll; j++) {
						 		response[i][j][2]= parseInt(response[i][j][2])
							 	response[i][j][3]= parseInt(response[i][j][3])
							 	response[i][j][4]= parseInt(response[i][j][4])
							 	response[i][j][5]= parseInt(response[i][j][5])
							 	response[i][j][9]= parseInt(response[i][j][9])
							 	response[i][j][10] = parseInt(response[i][j][10])
						 	}
							drawCNV(response[i],i);
							$(".checkBoxCnv").append(checkBoxeIsolatCNV);
							$('#isolat').attr('id', "isolatCNV"+i);
							$("#lab").attr('id', "lab"+i);
							$("#lab"+i).text("Isolat "+ (i+1));
							$("#lab"+i).attr("for", "isolatCNV"+i)
						}
					// 
				},
				error: function (response) {

				}, 
				complete : function (resultat, statut) {

				}
			})
		}
		

	})

	$(document).on("submit", ".SNPInput", function (event) {
		event.preventDefault();
		var data = new FormData(this);
		if ( document.getElementById('fileinputSNP').files.length === 0) {
			sweetAlert("oups..","No file is uploaded, please upload at least one file", "error");
		} else {
			$.ajax('/SnpData', {
				type: 'POST',
				data: data,
				processData: false,
				contentType: false,
				success: function (response) {
					var l = response.length
					for (var k =0; k<l; k++) {
						drawSNP(response[k],k)
					
					}


				}, error: function (response) {

				},
				complete :function (resultat, statut) {

				}
			})
		} 
			
	})

	//hidind and showing the svg
	$(document).on("change", ".checkIs", function (event) {
		console.log("the id is", this.id)
		var prop = $("#"+this.id).prop("checked");
		var number = this.id[((this.id).length)-1]
		var parent = $("#"+this.id).parent().attr("class");
		if (prop === false) {
			if (parent === "checkBoxCnv") {
				$('#svgCnv'+number).hide();
			} else if (parent === "checkBoxSnp") {

			} else if (parent === "checkBoxIndel") {

			}

		} else {
			if (parent === "checkBoxCnv") {
				$('#svgCnv'+number).show();
			} else if (parent === "checkBoxSnp") {

			} else if (parent === "checkBoxIndel") {

			}

		}
	})

	$(document).on("change", "#selChrCnv", function (event) {
		var selectedVal= $(event.target).val();
		console.log(selectedVal)
		var  l = selectedVal.length;
		var chr = $('select#selChrCnv option').length -1
		console.log('le nombre de chr =', chr)
		var v = $('#contcnv').children().length;
		console.log("le nombdre de div =", v)
		var tempo = 0
		for (var j=1; j<=chr; j++) {
			if (tempo === l) {
				for (k=1; k<=v; k++) {
					$('rect#ref'+""+k+""+j).hide();
					$('rect#cadre'+""+k+""+j).hide();
					$('rect#chr'+""+k+""+j).hide();
					$("text#txt"+""+k+""+j).hide();
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
					//showing all the rect and texts
				}
				} else {
					for (k=1; k<=v; k++) {
						$('rect#ref'+""+k+""+j).hide();
						$('rect#cadre'+""+k+""+j).hide();
						$('rect#chr'+""+k+""+j).hide();
						$("text#txt"+""+k+""+j).hide();
					//hiding all the chr(j)
					}
				
				}

			}
			
			
		}
})

}


//this function is to correct the data (the chromosome numbers)
function correctGff(gffData) {
	var length = gffData.length;
	var chromosome = gffData[0][0];
	var current;
	var next;
	for (var i=0; i<length; i++) {
		current = gffData[i][0];
		if(i <= length-2) {
			next = gffData[i+1][0];
		}
		if ((current !== next) && (chromosome === next)) {
			gffData[i][0] = chromosome;
		}
		chromosome = gffData[i][0];
	}
}

//this function will be able to draw chromosomes for any organism
function drawChromosomes(gffData) {
	correctGff(gffData);
	var length = gffData.length;
	var chr=1;
	var chromosome = gffData[0][0];
	for (var i=0; i< length; i++) {
		var current = gffData[i][0]; 
		if (chromosome !== current) {
			chromosome = current;
			chr++;
		} else {
			chromosome = current;
		}
	}
	console.log("the number is : ", chr);
	//Create SVG element
	var y1= 0;
	var lmjfCurrent;
	var lmjfBefore = gffData[0][0][gffData[0][0].length-2] + gffData[0][0][gffData[0][0].length-1];
	var svg = d3.select("div#svg")
            .append("svg")
            .attr("width", 3000)
            .attr("height", 3500);

    //Drawing the lines :
    var ch = [];
    ch.length = chr;
    svg.selectAll("line")
    	.data(ch)
    	.enter()
    	.append("line")
    	.attr("x1",60)
    	.attr("y1" , function (d, i) {
    		return i * (3000/chr) + 10;
    	})
    	.attr("x2", function (d, i) {
    		return 60 + l_major_chr_length[i]/500;
    	})
    	.attr("y2", function (d, i) {
    		return i * (3000/chr) + 10;
    	})
    	.attr("stroke","black")
    	.attr("strokeWidth","10px");

    //Writing some labels :
    svg.selectAll("text")
    	.data(ch)
    	.enter()
    	.append("text")
    	.text( function (d, i) {
    		return "Chr " +  (i+1); 
    	})
    	.attr("x",10) 
    	.attr("y", function (d, i){
    		return i * (3000/chr) + 10;
    	})
    	.attr("font-family", "century")
   		.attr("font-size", "15px")
   		.classed("text", true)

    //Drawing the CDS position in a shape of circles
    svg.selectAll("circle")
    	.data(gffData)
    	.enter()
    	.append("circle")
    	.classed('circle',true)
    	.attr("id", function (d,i) {
    		return i;
    	})
    	.attr("cx", function (data) {
    		lmjfCurrent = data[0][data[0].length -2] + data[0][data[0].length -1];
    		return (60 + data[2]/500);
    	})
    	.attr('cy', function (data) {
    		lmjfCurrent = data[0][data[0].length -2] + data[0][data[0].length -1];
    		if (lmjfCurrent === lmjfBefore) {
    			// console.log("y1 =", y1);
    			lmjfBefore = lmjfCurrent;
    			return y1 * (3000/chr) + 10
    		} else {
    			lmjfBefore = lmjfCurrent;
    			// console.log("they are not equal anymore !!")
    			y1++;
    			return y1 * (3000/chr) + 10;
    		}
    	})
    	.attr('r', function (data) {
    		return (((data[3]- data[2])/2)/500);
		})
		.attr("fill", function(data) {
			r= ((data[3]- data[2])/2)/500
			if ((r> 0) && (r<=15)) {
				return "yellow"
			} else if ((r>15)&& (r<=25)) {
				return "orange"
			}else if (r>25) {
				return "red"
			}
		})
    
    //Description of the circles : 
    y1=0;
    lmjfBefore = gffData[0][0][gffData[0][0].length-2] + gffData[0][0][gffData[0][0].length-1];
    
    	 $('svg circle').tipsy({ 
	        gravity: 'w', 
	        html: true, 
	        title: function() {
	          var d = this.__data__;
    		  var newArray = d[4].split(';')
	         // console.log("the data is d = :", d);
	          debugger;
	          return newArray[0] + '<br>' + newArray[1] + '<br>' + newArray[2] + '<br>' + newArray[3] + '<br>' + newArray[4]
	          + '</span>'; 
	        }
        });
}

//Drawing CNVs function
function drawCNV(CnvData, v) {
    CnvData.splice(0,1);
    var random =  Math.floor((Math.random() *8))
    $("div#contcnv").append(svgDiv);
    $("div#svgCnv").attr("id","svgCnv"+v);
    $("div#svgCnv"+v).attr("class","card-panel "+ color_panel[random] +" col s6 svgg" );
    $("div#svgCnv"+v).append("<h4 class='center'> Isolat " + (v+1) + "</h4>")
    
    var l = CnvData.length;
 //    var current;
 //    console.log(l);
	// var chr=1;
	// var chromosome = CnvData[0][1];
	// for (var i=0; i<l; i++) {
	// 	current = CnvData[i][1]; 
	// 	if (chromosome !== current) {
	// 		chromosome = current;
	// 		chr++;
	// 	} else {
	// 		chromosome = current;
	// 	}
	// }
	var chr = CountChrNumber(CnvData,1)
	if (v ===0) {
		//here we will add the multiple selection option dependeing on the chromosome number
		var select1 = document.getElementById("selChrCnv");
	    for (var j=0; j< chr; j++) {
	    	select1.options[select1.options.length] = new Option('Chromosome '+ (j+1) , (j+1));
	    }
	    $(select1).material_select();
		$(".selectChr").css("visibility", "visible");
	}


	//Starting drawing the svg
	var svg = d3.select("div#svgCnv"+v)
            .append("svg")
            .attr("width", 1000)
            .attr("height", chr* 100 +100);

	var ch = [];
    ch.length = chr;
    console.log("chr =", chr)
	// svg.selectAll("rect")
	// 	.data(ch)
	// 	.enter()
	// 	.append("rect")
	// 	.attr("x", 60)
	// 	.attr("y", function (d,i) {
	// 		return ((i+1) * 100);
	// 	})
	// 	.attr("width", function (d,i) {
	// 		return (l_major_chr_length[i]/1000)
	// 	})
	// 	.attr("height", 20)
	// 	.attr('fill', "white")

	 //Writing some labels :
    svg.selectAll("text")
    	.data(ch)
    	.enter()
    	.append("text")
    	.text( function (d, i) {
    		return "Chr " +  (i+1); 
    	})
    	.attr("x",10) 
    	.attr("y", function (d, i){
    		return (i+1)* 100 + 10;
    	})
    	.attr('id', function (d, i) {
			return "txt"+(v+1)+(i+1)
		})
    	.attr("font-family", "century")
   		.attr("border-radius", "16px")
   		.attr('background-color','#e4e4e4')
   		.attr("font-size","13px")
   		.attr("font-weight","500")
   		.attr("height", "32px")
   		.attr("color","rgba(0, 0, 0, 0.6)")
   		.attr("padding","0 12px");

   

	ch = [];
    ch.length = chr;
	svg.selectAll("rect")
		.data(ch)
		.enter()
		.append("rect")
		.attr("x", 60)
		.attr("y", function (d,i) {
			return ((i+1) * 100);
		})
		.attr("width", function (d,i) {
			return (l_major_chr_length[i]/1000)
		})
		.attr("height", 20)
		.attr('id', function (d,i) {
			return 'cadre'+(v+1)+(i+1)
		})
		.attr('fill', "white");

   	y1 = 0;
   	var current;
   	var before = CnvData[0][1];
   	var avant = CnvData[0][1];
	var chromo = 1
	var x1=0;
	var x2=0;
	var lon= CnvData.length
	for (i=0; i<lon; i++) {
		x1=0
		x2=0
		var number = CnvData[i][9];
		var normal = CnvData[i][3];
		//console.log("the number is =", number)
		current = CnvData[i][1];
		if (current === before) {
			before = current;
		}else {
			before = current;
			y1++;
		}
		if (number === 1) {
			svg.append("rect")
				.data([CnvData[i]])
				.attr("x",(60+ CnvData[i][4]/1000))
				.attr("y", (y1+1)*100)
				.attr("width", (CnvData[i][5]- CnvData[i][4])/500)
				.attr("height",20)
				.attr("fill","blue")
				.attr('id','chr'+(v+1)+(y1+1));

		} else if ((number > 1) && (number <= (CnvData[i][5]-CnvData[i][4]))) {
			for (var j =0; j<number; j++) {
				svg.append("rect")
				    .data([CnvData[i]])
					.attr("x", 60+ CnvData[i][4]/1000 + x1)
					.attr("y",  (y1+1)*100)
					.attr("width", ((CnvData[i][5]-CnvData[i][4])/number)/500)
					.attr('height',20)
					.attr("fill", "yellow")
					.attr('id', 'chr'+(v+1)+(y1+1))
					.attr("stroke", "black")
					.attr("stroke-width", 1)
					x1= x1+ ((CnvData[i][5]-CnvData[i][4])/number)/500;
			}

		} else if ((number >1) && (number > (CnvData[i][5]-CnvData[i][4]))) {
			console.log("reeeed yaaw !!")
			for (j = 0; j< number; j++) {
				svg.append("rect")
					.data([CnvData[i]])
					.attr("x",(60+ CnvData[i][4]/1000))
					.attr("y", (y1+1)*100)
					.attr("width", (CnvData[i][5]- CnvData[i][4])/500)
					.attr("height",20)
					.attr("fill","red")
					.attr("stroke", "black")
					.attr("stroke-width", 3)
					.attr('id', 'chr'+(v+1)+(y1+1));
			}
		}

		if (normal ===1) {
			svg.append("rect")
				.data([CnvData[i]])
				.attr("x",(60+ CnvData[i][4]/1000))
				.attr("y", (y1+(3/2))*100)
				.attr("width", (CnvData[i][5]- CnvData[i][4])/500)
				.attr("height",20)
				.attr("fill","blue")
				.attr('id', "ref"+(v+1)+(y1+1));
		} else if (normal > 1) {
			for (j =0; j < normal; j++) {
				svg.append("rect")
				    .data([CnvData[i]])
					.attr("x", 60+ CnvData[i][4]/1000 + x2)
					.attr("y", (y1+(3/2))*100)
					.attr("width", ((CnvData[i][5]-CnvData[i][4])/number)/500)
					.attr('height',20)
					.attr("fill", "yellow")
					.attr('id', "ref"+(v+1)+(y1+1))
					.attr("stroke", "black")
					.attr("stroke-width", 1)
					x2= x2+ ((CnvData[i][5]-CnvData[i][4])/number)/500;
			}
		}
	}
	$('svg rect').tipsy({ 
	        gravity: 'w', 
	        html: true, 
	        title: function() {
		        var d = this.__data__;
		        if( d=== undefined) {
		         	return "Nothing to report in this position"
		        } else {
			         return "Orthomcl Id:"+ d[0] + '<br>' + "Chromosome CNV :"+ d[1] + '<br>' + "Single genome number :"+ d[9] + '<br>' + "Description:" +d[8] + '<br>' 
			          + '</span>'; 	
		        }
	        }
        });

	$('svg rect#ref').tipsy({ 
	        gravity: 'w', 
	        html: true, 
	        title: function() {
		        var d = this.__data__;
		        if( d=== undefined) {
		         	return "Nothing to report in this position"
		        } else {
			         return "Orthomcl Id:"+ d[0] ; 	
		        }
	        }
        });

	svg.selectAll("text")
    	.data(ch)
    	.enter()
    	.append("text")
    	.text( function (d, i) {
    		return "Ref_Chr" +  (i+1); 
    	})
    	.attr("x",5) 
    	.attr("y", function (d, i){
    		return (i+ 1.5)* 100 + 10;
    	})
    	.attr("font-family", "century")
   		.attr("border-radius", "16px")
   		.attr('background-color','#e4e4e4')
   		.attr("font-size","13px")
   		.attr("font-weight","500")
   		.attr("height", "32px")
   		.attr("color","rgba(0, 0, 0, 0.6)")
   		.attr("padding","0 12px")
 
}

//drawing the snps
function drawSNP(SNPfile, v) {
	var chr = CountChrNumber(SNPfile, 0);
	
}


//Counting the chromosome number present in the file
function CountChrNumber(file, indice) {
	var chr=1;
	var current;
	var chromosome = file[0][indice];
	var l = file.length;
	for (var i=0; i<l; i++) {
		current = file[i][indice]; 
		if (chromosome !== current) {
			chromosome = current;
			chr++;
		} else {
			chromosome = current;
		}
	}
	return chr;
}