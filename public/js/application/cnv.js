var l_major_chr_length = [268988, 355712, 384502, 472852, 465823, 516869, 596352, 574960, 573434, 570865, 
						  582573, 675346, 654595, 622644, 629517, 714651, 684829, 739748, 702208, 742537,
						  772972, 716602, 772565, 840950, 912845, 1091540, 1130424, 1160104, 1212663, 1403434,
						  1484328, 1604637, 1583653, 1866748, 2090474, 2682151];

var color_panel = ["blue", "red", "yellow", "green", " purple lighten-5", "red accent-1", "cyan lighten-4", "grey lighten-3"];
var svgDiv='<div id="svgCnv" class="card-panel blue lighten-5 col s6" style="margin-top:50px"></div>'
var checkBoxRef='<input type="checkbox" id="reference" class="refIs" checked=""/><label id="lab" for="reference">Ref</label>'
var checkBoxeIsolatCNV='<input type="checkbox" id="isolat" class="checkIs" checked=""/><label id="lab" for="isolat">Isolat</label>'

$(document).ready(function() {
	pageLoadCnv();
});

function pageLoadCnv(){

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
							 	//refactor this, and send this treatment to the drawCNV function
						 	}
							drawCNV(response[i],i);
							$(".checkBoxCnv").append(checkBoxeIsolatCNV);
							$('#isolat').attr('id', "isolatCNV"+i);
							$("#lab").attr('id', "lab"+i);
							$("#lab"+i).text("Isolat "+ (i+1));
							$("#lab"+i).attr("for", "isolatCNV"+i)
						}
						$(".checkBoxCnv").append(checkBoxRef);
						// $('.refIs').attr("id","refOfCnv")
					// 
				},
				error: function (response) {

				}, 
				complete : function (resultat, statut) {

				}
			})
		}
	})

	//hiding the reference exists only in cnv 
	$(document).on("change", ".refIs", function (event) {
		var prop = $("#"+this.id).prop("checked");
		var id= $(this).attr("id")
		var v = $('#contcnv').children().length;
		if (prop === true) {
			$(".refer").show();
		} else {
			$(".refer").hide();
		}

	})
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

//appending the svg div
function appendSvgDiv(containerType, type, v, random, className) {
	$("div#"+ containerType).append(svgDiv);
    $("div#svgCnv").attr("id",""+type +v);
    $("div#"+ ""+ type +v).attr("class","card-panel "+ color_panel[random] +" col s6 "+ className );
    $("div#"+""+ type +v).append("<h4 class='center'> Isolat " + (v+1) + "</h4>")
}

//appending the input positions
function appendPositionsInput () {

}

//Drawing CNVs function
function drawCNV(CnvData, v) {
    CnvData.splice(0,1);
    var random =  Math.floor((Math.random() *8))
    appendSvgDiv("contcnv", "svgCnv", v, random, "svgg")
    var l = CnvData.length;
	var chr = CountChrNumber(CnvData,1)
	if (v ===0) {
		//here we will add the multiple selection option dependeing on the chromosome number
		var select1 = document.getElementById("selChrCnv");
		// select1.options[select1.options.length] = new options('Tous');
	    for (var j=0; j< chr; j++) {
	    	select1.options[select1.options.length] = new Option('Chromosome '+ (j+1) , (j+1));
	    }
	    $(select1).material_select();
		$("#divSelectCnv").css("display", "block");
	}
	//displaying the positions input : 
	$("#inputCNV").css("display", "block");
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
    		return "" +  (i+1); 
    	})
    	.attr("x",10) 
    	.attr("y", function (d, i){
    		return (i+1)* 100 + 10;
    	})
    	.attr('id', function (d, i) {
			return "txt"+(v+1)+(i+1)
		})
    	.attr("font-family", "century gothic")
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
		} else {
			before = current;
			y1++;
		}
		if (number === 1) {
			svg.append("rect")
				.data([CnvData[i]])
				.attr("x",(60+ CnvData[i][4]/500))
				.attr("y", (y1+1)*100)
				.attr("width", (CnvData[i][5]- CnvData[i][4])/500)
				.attr("height",20)
				.attr("fill","blue")
				.attr('id','chr'+(v+1)+(y1+1));

		} else if ((number > 1) && (number <= (CnvData[i][5]-CnvData[i][4]))) {
			for (var j =0; j<number; j++) {
				svg.append("rect")
				    .data([CnvData[i]])
					.attr("x", 60+ CnvData[i][4]/500 + x1)
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
					.attr("x",(60+ CnvData[i][4]/500))
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
				.attr("x",(60+ CnvData[i][4]/500))
				.attr("y", (y1+(3/2))*100)
				.attr("width", (CnvData[i][5]- CnvData[i][4])/500)
				.attr("height",20)
				.attr("fill","blue")
				.classed("refer",true)
				.attr('id', "ref"+(v+1)+(y1+1));
		} else if (normal > 1) {
			for (j =0; j < normal; j++) {
				svg.append("rect")
				    .data([CnvData[i]])
					.attr("x", 60+ CnvData[i][4]/500 + x2)
					.attr("y", (y1+(3/2))*100)
					.attr("width", ((CnvData[i][5]-CnvData[i][4])/number)/500)
					.attr('height',20)
					.attr("fill", "yellow")
					.classed("refer",true)
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

	svg.selectAll("text.ref")
    	.data(ch)
    	.enter()
    	.append("text")
    	.text( function (d, i) {
    		return "Ref_" +  (i+1); 
    	})
    	.attr("x",5) 
    	.attr("y", function (d, i){
    		return (i+ 1.5)* 100 + 10;
    	})
    	.attr("id", function (d, l) {
    		return "Ref_Chr"+(v+1)+(l+1)
    	})
    	.classed("refer",true)
    	.attr("font-family", "century")
   		.attr("border-radius", "16px")
   		.attr('background-color','#e4e4e4')
   		.attr("font-size","13px")
   		.attr("font-weight","500")
   		.attr("height", "32px")
   		.attr("color","rgba(0, 0, 0, 0.6)")
   		.attr("padding","0 12px")
 
}
