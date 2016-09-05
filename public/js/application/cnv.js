var l_major_chr_length = [268988, 355712, 384502, 472852, 465823, 516869, 596352, 574960, 573434, 570865, 
						  582573, 675346, 654595, 622644, 629517, 714651, 684829, 739748, 702208, 742537,
						  772972, 716602, 772565, 840950, 912845, 1091540, 1130424, 1160104, 1212663, 1403434,
						  1484328, 1604637, 1583653, 1866748, 2090474, 2682151];

// var color_panel = ["blue", "red", "yellow", "green", " purple lighten-5", "red accent-1", "cyan lighten-4", "grey lighten-3"];
var svgDivCNV='<div id="svgCnv" class="card-panel  col s12 l9 m9" style="margin-top:50px"></div>'
var checkBoxRef='<input type="checkbox" id="reference" class="refIs" checked=""/><label id="lab" for="reference">Ref</label>'
var checkBoxeIsolatCNV='<input type="checkbox" id="isolat" class="checkIs" checked=""/><label id="lab" for="isolat">Isolat</label>'
var chartsDiv='<div class="modal bigChartDiv"><div class="col s12" id="chartdivCNV" style=" height:500px"></div><div class="card-panel myCard center" ><span class="white-text" style="font-size:12px"> This chart represents the percentage of the CNV present in the sample isolat. Which means we count a variation (for example : 4 CNV in a position), and how offen it exists in the sample</span></div><div class="col s12" id="chartMinMaxCNV" style=" height:500px"></div><div class="card-panel myCard center" ><span class="white-text" style="font-size:12px"> This chart represents the number of variations present in each chromosome by comparing the number of gene in the reference, to the single number of copies found in the chormosome sample  </span></div></div>'
var exportButton ='<div style="position: relative; height: 70px;"><div class="fixed-action-btn horizontal click-to-trigger" style="position: absolute; right: 24px;"><a class="btn-floating btn-large Menu"><i class="material-icons">menu</i></a><ul><li><a class="btn-floating red modal-trigger" id="callModal" href="" style="transform: scaleY(1) scaleX(1) translateY(0px) translateX(0px); opacity: 1;"><i class="material-icons">insert_chart</i></a></li><li><a class="btn-floating yellow darken-1 exportButton" style="transform: scaleY(1) scaleX(1) translateY(0px) translateX(0px); opacity: 1;"><i class="material-icons">get_app</i></a></li></ul></div></div>'

$(document).ready(function() {
	pageLoadCnv();

});

//the file array
var FILE= [];

function movetoCNV(position, chromosome, isolat) {
	// var v = $('#contcnv').children().length;
	//we should check if there are many isolat or not
	var v = $('#contcnv').children().length /2;
	if (isolat ==="") {
		if (position <= l_major_chr_length[(chromosome-1)]) {
			// var chr= d3.select('#chr1'+''+''+chromosome);
			$('#svg0').scrollLeft(60 + (parseInt(position)/500))
			$('html,body, .svgg').animate({
	                    scrollTop: parseInt(chromosome)*100
	        }, 1000)
			// // $('#g'+(k+1)+''+chromosome).get(0).scrollIntoView();
			// chr.transition()
			//  .attr("transform", "translate("+ (60- (position/500)) +", "+ 0+")")
			//  .duration(3000)
			
		} else {
			sweetAlert("oups..","The position required doesn't exist in the chromosome "+ chromosome, "error");
		}

	} else {
			if ((isolat <=v) && (isolat >0)) {
				if (position <= l_major_chr_length[(chromosome-1)]) {
					var chr= d3.select('#chr'+''+isolat+''+chromosome);
					$('#svgCnv'+(isolat-1)).scrollLeft(60 + (parseInt(position)/500))
					$('html,body, .svgg').animate({
			                    scrollTop: parseInt(chromosome)*100
	                }, 1000)
					// $('#g'+(k+1)+''+chromosome).get(0).scrollIntoView();
					// chr.transition()
					//  .attr("transform", "translate("+ (60- (position/500)) +", "+ 0+")")
					//  .duration(3000)
			
				} else {
					sweetAlert("oups..","The position required doesn't exist in the chromosome "+ chromosome, "error");
				}
			} else  if (isolat ==0) {
				if (position <= l_major_chr_length[(chromosome-1)]) {
					// var chr= d3.select('#chr1'+''+''+chromosome);
					$('#svgCnv0').scrollLeft(60 + (parseInt(position)/500))
					$('html,body, .svgg').animate({
			                    scrollTop: parseInt(chromosome)*100 * parseInt(isolat)
			        }, 1000)
					// // $('#g'+(k+1)+''+chromosome).get(0).scrollIntoView();
					// chr.transition()
					//  .attr("transform", "translate("+ (60- (position/500)) +", "+ 0+")")
					//  .duration(3000)
					
				} else {
					sweetAlert("oups..","The position required doesn't exist in the chromosome "+ chromosome, "error");
				}

			} else if (isolat > v) {
				if (position <= l_major_chr_length[(chromosome-1)]) {
					// var chr= d3.select('#chr1'+''+''+chromosome);
					$('#svgCnv0').scrollLeft(60 + (parseInt(position)/500))
					$('html,body, .svgg').animate({
			                    scrollTop: parseInt(chromosome)*100 *v
			        }, 1000)
					// // $('#g'+(k+1)+''+chromosome).get(0).scrollIntoView();
					// chr.transition()
					//  .attr("transform", "translate("+ (60- (position/500)) +", "+ 0+")")
					//  .duration(3000)
					
				} else {
					sweetAlert("oups..","The position required doesn't exist in the chromosome "+ chromosome, "error");
				}

			}
	}

	
	
}

function pageLoadCnv(){

	//if we want to move to a position 
	$(document).on("click", ".moveCnv", function (event) {
		event.preventDefault();
		var position = $("#begin").val()
		var chromosome = $("#chromosomeN").val()
		if ((chromosome ==="") ||(chromosome > realChr)) {
			sweetAlert("Oups", "This chromosome does not exist, try again", "error")
		}
		var isolat = $("#end").val()
		movetoCNV(position, chromosome, isolat);
	})

	$(document).on("submit",".CnvInput", function (event) {
		event.preventDefault();
		var data = new FormData(this);
		var prop = $("#selectCNV").prop("checked");
		var propp = $('#selectGffRelated').val()
		if ((prop === false) || (propp ===null)){
			sweetAlert("oups..","No file is chosen, please choose at least one file", "error");
		} else {
			$(".uploader").css("display","block");
			$(".BIG").css("opacity", "0.5")
			console.log("ACCEPTED")
			$('.svgg').remove();
			$("#divSelectCnv").css("display", "none");
			$(".echelle").css("display", "none")
			$($(".checkBoxCnv").children()).remove();
			$("#inputCNV").css("display", "none");
			$.ajax('/CnvData', {
				type: 'POST',
				data: data,
				processData: false,
				contentType: false,
				success: function (response) {
					$(".uploader").css("display","none");
					$(".BIG").css("opacity", "1")
					var l = response.length
					console.log("the length is", l)
					console.log(response)
					debugger;
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
						 	FILE.push(response[i]) ;
							drawCNV(response[i],i);
							canvg('canvas'+i, '<svg>'+$("svg").html()+"</svg>");
							
								// chart code will go here
							appendChartDiv(i)
							implementChartCNV(response[i],i)
							// chartCnvMinMax()
						
							$(".checkBoxCnv").append(checkBoxeIsolatCNV);
							$('#isolat').attr('id', "isolatCNV"+i);
							$("#lab").attr('id', "lab"+i);
							$("#lab"+i).text("Isolat "+ (i+1));
							$("#lab"+i).attr("for", "isolatCNV"+i)
						}
						$(".echelle").css("display", "block")
						$(".checkBoxCnv").append(checkBoxRef);
						// $('.refIs').attr("id","refOfCnv")
					// 
				},
				error: function (response) {
					sweetAlert("oups..","An error occured, please try sending your file(s) again", "error");
				}, 
				complete : function (resultat, statut) {

				}
			})
		}
		$(document).on("click", ".exportButton", function (event) {
			console.log("clicked")
			var id = $($($($($($($($(this).parent()).parent())).parent())).parent()).parent()).attr("id")
			var svg = $("#"+id).children()[2]
			var v = id.replace('svgCnv',"")
			// canvg('canvas', '<svg>'+$(svg).html()+"</svg>");
			var canvas = document.getElementById("canvas"+v);
			var img = canvas.toDataURL("image/png");
			var svgBlob = new Blob([source], {type:"image/svg+xml;charset=utf-8"});
			var svgUrl = URL.createObjectURL(svgBlob);
			var a = document.createElement("a");
	 	    a.href = svgUrl;
	  		a.download = ""+ $($("#"+id).children()[0]).text()+'.svg';
	  		a.click();
			// var svg = document.getElementById('svg0');
			// console.log(svg)
			// var simg = new Simg(svg);
		 //    simg.replace();
			// simg.download("haha");


		})
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

	//Getting the variations of a zone
	$(document).on("click", ".getVariations", function() {
		var begin = $('#beginPosVar').val();
		var end = $("#endPosVar").val();
		var chromo = $('#chrPosVar').val();
		if ((begin ==="") || (end ==="") ||(chromo ==="")) {
			sweetAlert("Error", "You should precise the begin and the end position, and a chromosome to find the right number of variations","error")
		} else {
			//calling the function
			chromo = parseInt(chromo);
			begin = parseInt(begin);
			end = parseInt(end);
			if (begin >= l_major_chr_length[chromo-1]) {
				sweetAlert("Error", "No such begin position in the chromosome " + chromo , "error"); 
			} else {
				if (begin > end) {
					var intr = begin;
					begin = end; 
					end = intr;
					if (end > l_major_chr_length[chromo-1]) {
						end = l_major_chr_length[chromo-1];	
					}
				} else {
					if (end > l_major_chr_length[chromo-1]) {
						end = l_major_chr_length[chromo-1];	
					}
				}
				countPositionVariation(begin, end, chromo, FILE);
			}

		}
	})
}

function appendChartDiv(i) {
	$(".charts").append(chartsDiv);
	$(".bigChartDiv").attr("class", "modal bigChart"+i);
	$('.bigChart'+i).attr('id', "bigChartDiv"+i)
	$('#chartdivCNV').attr("id","chartdivCNV"+""+i);

	//i should put the charts button to have an href the charts
	$("#chartMinMaxCNV").attr('id',"chartMinMaxCNV" +""+i)
}

//Counting the chromosome number present in the file
var realChr=0
function CountChrNumberCNV(file, indice) {
	var chr=[];
	var current;
	var chromosome = file[0][indice];
	chr.push(parseInt(chromosome))
	var l = file.length;
	for (var i=0; i<l; i++) {
		current = file[i][indice]; 
		if (chromosome !== current) {
			chromosome = current;
			chr.push(parseInt(chromosome));
		} else {
			chromosome = current;
		}
	}
	realChr = chr.length
	return chr;
}

//appending the svg div
function appendSvgDivCNV(containerType, type, v, random, className) {
    $("div#"+ containerType).append("<canvas class='canvas' style='display:none'></canvas>")
    $('.canvas').attr("id", "canvas"+v);
	$("div#"+ containerType).append(svgDivCNV);
	$("div#"+ containerType).append('<div class="row col s12 l9 m9 offset-s3 cnvZoomButtons" id="cnvZommButtons'+v+'"><a class="btn-floating waves-effect waves-light smallButton zoomOut" id="cnvZoomOut'+v+'"><i class="material-icons">remove</i></a><button id="cnvZoomReset'+v+'" class="btn btn2 zoomReset">Reset</button><a class="btn-floating waves-effect waves-light smallButton zoomIn" id="cnvZoomIn'+v+'"><i class="material-icons">add</i></a></div>')
	$("div#svgCnv").attr("id",""+type+"" +v);
    $("#"+ ""+ type+"" +v).attr("class","card-panel" +" col s12 l9 m9 "+ className );
    $("#"+""+ type+"" +v).append("<h5>" + $("#selectCNV").val()[v] + "</h5>")
    $("#"+""+ type+"" +v).append(exportButton);
    $('#callModal').attr("id","callModal"+v)
    $("#callModal"+v).attr('href',"#bigChartDiv"+v)
    $('.exportButton').attr("id", "exportButton"+""+v);
    $('.modal-trigger').leanModal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      in_duration: 300, // Transition in duration
      out_duration: 200, // Transition out duration
    });
}

//appending the input positions
function appendPositionsInput () {

}

//Drawing CNVs function
function drawCNV(CnvData, v) {
    CnvData.splice(0,1);
    var random =  Math.floor((Math.random() *8))
    appendSvgDivCNV("contcnv", "svgCnv", v, random, "svgg")
    var l = CnvData.length;
	var chr = CountChrNumberCNV(CnvData,1)
	if (v ===0) {
		//here we will add the multiple selection option dependeing on the chromosome number
		var select1 = document.getElementById("selChrCnv");
		// select1.options[select1.options.length] = new options('Tous');
	    for (var j=0; j< chr; j++) {
	    	select1.options[select1.options.length] = new Option('Chromosome '+ (j+1) , (j+1));
	    }
	    $("select").material_select();
		$("#divSelectCnv").css("display", "block");
	}
	//displaying the positions input : 
	$("#inputCNV").css("display", "block");
	//Starting drawing the svg
	var L = l_major_chr_length.length
	var svg = d3.select("div#svgCnv"+v)
            .append("svg")
            .attr("width", l_major_chr_length[L-1]/500 + 200)
            .attr("height", chr.length* 100 +150)
            

	var ch = [];
    ch.length = chr.length;
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
    		return "" +  chr[i]; 
    	})
    	.attr("x",10) 
    	.attr("y", function (d, i){
    		return (i+1)* 100 + 10;
    	})
    	.attr('id', function (d, i) {
			return "txt"+(v+1)+chr[i];
		})
    	.attr("class", "textCHR");

    svg.selectAll("text.sign")
   	   .data([1])
   	   .enter()
   	   .append("text")
   	   .text( function (d,i) {
   	   		return 'LeishSIC_PasteurLab2016'
   	   })
   	   .attr("x",70)
   	   .attr('y', chr[chr.length-1]*100+140)
   	   .attr("font-family", "century")
   	   .attr("border-radius", "16px")

     $("#canvas"+v).attr("height", chr*100 +150)
     $("#canvas"+v).attr("width", l_major_chr_length[L-1]/500 + 200)
     $("svg").attr('id',"svg"+v)

    

	ch = [];
    ch.length = chr.length;
	svg.selectAll("line")
		.data(ch)
		.enter()
		.append("line")
		.attr("x1", 60)
		.attr("y1", function (d,i) {
			return ((i+1) * 100 + 10);
		})
		.attr("x2", function (d,i) {
			return (l_major_chr_length[i]/500)
		})
		.attr("y2", function (d, i) {
			return ((i+1) * 100 +10);
		})
		// .attr("height", 20)
		.attr('id', function (d,i) {
			return 'cadre'+(v+1)+chr[i]
		})
		.attr('stroke', "black")
		.attr("stroke-width", "1px");

	svg.selectAll("line.ref")
		.data(ch)
		.enter()
		.append("line")
		.attr("x1", 60)
		.attr("y1", function (d,i) {
			return ((i+(3/2)) * 100 + 10);
		})
		.attr("x2", function (d,i) {
			return (l_major_chr_length[i]/500)
		})
		.attr("y2", function (d, i) {
			return ((i+(3/2)) * 100 +10);
		})
		// .attr("height", 20)
		.attr('id', function (d,i) {
			return 'cadreRef'+(v+1)+chr[i]
		})
		.attr('stroke', "black")
		.attr("stroke-width", "1px");

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
		var pos = CnvData[i][12];
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
				.attr("y", function (d,o) {
					if (pos ==="+") {
						return (y1+1)*100-10
					}else {
						return (y1+1)*100 +10
					}
				})
				.attr("width", (CnvData[i][5]- CnvData[i][4])/500)
				.attr("height",20)
				.attr("fill", function(d,o) {
					if (pos ==="+") {
						return "#2F4F4F"
					} else {
						return "#008B8B"
					}
				})
				.attr('id','chr'+(v+1)+chr[y1]);

		} else if ((number > 1) && (number <= (CnvData[i][5]-CnvData[i][4]))) {
			for (var j =0; j<number; j++) {
				svg.append("rect")
				    .data([CnvData[i]])
					.attr("x", 60+ CnvData[i][4]/500 + x1)
					.attr("y", function (d,o) {
						if (pos==="+") {
							return (y1+1)*100 -10
						} else {
							return (y1+1)*100 +10
						}
					})
					.attr("width", ((CnvData[i][5]-CnvData[i][4])/number)/500)
					.attr('height',20)
					.attr("fill", function (d,o) {
						if (pos ==="+") {
							return "#FF7F50"
						} else {
							return "#E9967A"
						}
					})
					.attr('id', 'chr'+(v+1)+chr[y1])
					.attr("stroke","black")
					.attr("stroke-width", "0.4px")
					x1= x1+ ((CnvData[i][5]-CnvData[i][4])/number)/500;
			}

		} else if ((number >1) && (number > (CnvData[i][5]-CnvData[i][4]))) {
			console.log("reeeed yaaw !!", CnvData[i][7])
				svg.append("rect")
					.data([CnvData[i]])
					.attr("x",(60+ CnvData[i][4]/500))
					.attr("y", function(d,o) {
						if (pos==="+") {
							return (y1+1)*100 -10
						} else {
							return (y1+1)*100 +10
						}
					})
					.attr("width", (CnvData[i][5]- CnvData[i][4])/500)
					.attr("height",20)
					.attr("fill", function () {
						if (pos ==="+") {
							return 'red'
						} else {
							return 'red'
						}
					})
					.attr('id', 'chr'+(v+1)+chr[y1]);
			
		}

		if (normal ===1) {
			svg.append("rect")
				.data([CnvData[i]])
				.attr("x",(60+ CnvData[i][4]/500))
				.attr("y", function(d,o) {
						if (pos==="+") {
							return (y1+(3/2))*100 -10
						} else {
							return (y1+(3/2))*100 +10
						}
					})
				.attr("width", (CnvData[i][5]- CnvData[i][4])/500)
				.attr("height",20)
				.attr("fill", function(d,o) {
					if (pos ==="+") {
						return "#2F4F4F"
					} else {
						return "#008B8B"
					}
				})
				.classed("refer",true)
				.attr('id', "ref"+(v+1)+chr[y1]);
		} else if (normal > 1) {
			for (j =0; j < normal; j++) {
				svg.append("rect")
				    .data([CnvData[i]])
					.attr("x", 60+ CnvData[i][4]/500 + x2)
					.attr("y", function(d,o) {
						if (pos==="+") {
							return (y1+(3/2))*100 -10
						} else {
							return (y1+(3/2))*100 +10
						}
					})
					.attr("width", ((CnvData[i][5]-CnvData[i][4])/number)/500)
					.attr('height',20)
					.attr("fill", function (d,o) {
						if (pos ==="+") {
							return "#FF7F50"
						} else {
							return "#E9967A"
						}
					})
					.classed("refer",true)
					.attr('id', "ref"+(v+1)+chr[y1])
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
		        	if ($(".special").children().length >= 1 ) {
		        		$(".special").children().remove()
		        	}
		        	 $(".special").append('<p>'+ 'Start: '+ d[4] + '<br>' + 'End: '+ d[5] + '</p>')
			         return "Orthomcl Id:"+ d[0] + '<br>' + "Chromosome CNV :"+ d[1] + '<br>' + "Single genome number :"+ d[9] + '<br>' + "Description:" +d[8] + '<br>' + "Position start: " + d[4] + '<br>' 
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
		        	if ($(".special").children().length >= 1 ) {
		        		$(".special").children().remove()
		        	}
		        	 $(".special").append('<p>'+ 'Start: '+ d[4] + '<br>' + 'End: '+ d[5] + '</p>')
			         
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

   		 //making the svg zoomable
     // var panZoomTiger = svgPanZoom('#svg'+v);

     svgPanZoom('#svg'+v, {
		  panEnabled: true
		, controlIconsEnabled: false
		, zoomEnabled: true
		, dblClickZoomEnabled: true
		, mouseWheelZoomEnabled: true
		, preventMouseEventsDefault: true
		, zoomScaleSensitivity: 0.2
		, maxZoom: 10
		, fit: false
		, contain: false
		, center: false
		, refreshRate: 'auto'
		, beforeZoom: function(){}
		, onZoom: function(){}
		, beforePan: function(){}
		, onPan: function(){}
		, customEventsHandler: {}
		, eventsListenerElement: null
		});

   	



 //   	var bb = $('#chartdivCNV').offset().top
   	$(".echelle").pushpin( {
		top: $('#contcnv').offset().top,
		bottom: $('#contcnv').offset().top + $("#contcnv").outerHeight() -300
	})
 
}

var max = 0,
	maxObject={},
	min = 0,
	minObject= {};
function implementChartCNV(CnvData,i) {
 //xAxe will be my array of values, and y is the percentages
 	//this is how the chart will look like from the library
 	var lon = CnvData.length;
 	var temp =[]
 	var before = CnvData[0][9];
 	max = CnvData[0][9];
 	min = CnvData[0][9];
 	var compteur = 0;
 	temp.push({
 		value: before,
 		number: compteur
 	})

 	for (var j=0; j< lon; j++) {
 		
 		var current = CnvData[j][9];
 		// if (current > max){
 		// 	max = current
 		// 	maxObject= {

 		// 	} CnvData[j]
 		// } 
 		// if (min > current) {
 		// 	min = current
 		// 	minObject = CnvData[j]
 		// }
 		if (current === before) {
 			compteur++;
 			if (j=== (lon-1)) {
 				var ll = temp.length;
 				for (var t=0; t< ll; t++ ) {
	 				if (temp[t].value === before) {
	 					temp[t].number = temp[t].number+compteur
	 					// console.log(temp[t])
	 					break;
	 				}
	 				
	 			}
 			}

 		} else{
 			ll= temp.length
 			for (var t=0; t< ll;t++ ) {
 				if (temp[t].value === before) {
 					temp[t].number = temp[t].number+compteur
 					// console.log("the temp at the else clause: ",temp[t])
 					// debugger;
 					break;
 				}	
 			}
 			before = current;
 			temp.push( {
 				value: before,
 				number:0
 			})
 			// console.log("the final temp after pushing second new value: ",temp);
 			debugger;
 			compteur=1;
 			if (j=== (lon-1)) {
 				ll= temp.length
 				for (var t=0; t< ll;t++ ) {
	 				if (temp[t].value === before) {
	 					temp[t].number = temp[t].number+compteur
	 					// console.log(temp[t])
	 					break;
	 				}
	 				
	 			}

 			}

 		}
 	}
 	ll = temp.length; 
 	var chartData= []
 	console.log("the length =", ll)
 	for (var t=0; t< ll; t++ ) {
 		//
		if (temp[t].number !== 0) {
			temp[t].number = ((temp[t].number*100)/lon).toFixed(3)
			chartData.push(temp[t])
			
		}		
 	}
 	 chartData.sort( function (a,b) {
		if (a.value - b.value < 0) {
				return -1;
			} else if (a.value - b.value > 0) {
			    return 1;
			}  else return 0;
		})

	var chart = new AmCharts.AmSerialChart();
		chart.dataProvider = chartData;
		chart.categoryField = "value";
		var graph = new AmCharts.AmGraph();
		graph.valueField = "number";
		graph.type = "line";
		chart.theme ="patterns";
		chart.chartCursor = {
	        "categoryBalloonDateFormat": "YYYY MMM DD",
	        "cursorAlpha": 0,
	        "fullWidth": true
    	}
    	chart.valueAxes = [{
	        "stackType": "regular",
	        "gridAlpha": 0.07,
	        "position": "left",
	        "title": "Percentage"
   		 }]
   		 chart.chartScrollbar= {}
   		chart.export = {
   			"enabled" : true
   		}
   		chart.categoryAxis = { 
	        "startOnAxis": false,
	        "axisColor": "#DADADA",
	        "gridAlpha": 0.07,
	        "title": "number of copies"
   		}
		graph.bullet = "round";
		graph.lineColor = "#8d1cc6";
		graph.balloonText = "[[category]] copies: <b>[[value]] %</b>";
		chart.addGraph(graph);
 		console.log(chart)
		chart.write('chartdivCNV'+i);
		// $('.amcharts-chart-div').children()[1].remove();
	// Creating the chart number of variations in each chromosome
var chrVar = CountNumberVariationCNV(CnvData)
console.log(chrVar)
var chart = AmCharts.makeChart("chartMinMaxCNV"+i, {
    "type": "serial",
    "theme": "light",    
    "legend": {
        "equalWidths": false,
        "useGraphSettings": true,
        "valueAlign": "left",
        "valueWidth": 120
    },
    "dataProvider": chrVar ,
    "valueAxes": [{
        "id": "distanceAxis",
        "axisAlpha": 0,
        "gridAlpha": 0,
        "position": "left",
        "title": "Number"
    }],
    // , {
    //     "id": "latitudeAxis",
    //     "axisAlpha": 0,
    //     "gridAlpha": 0,
    //     "labelsEnabled": false,
    //     "position": "right"
    // }, {
    //     "id": "durationAxis",
    //     "duration": "mm",
    //     "durationUnits": {
    //         "hh": "h ",
    //         "mm": "min"
    //     },
    //     "axisAlpha": 0,
    //     "gridAlpha": 0,
    //     "inside": true,
    //     "position": "right",
    //     "title": "duration"
    // }],
    "graphs": [
     {
        "bullet": "square",
        "bulletBorderAlpha": 1,
        "bulletBorderThickness": 1,
        "dashLengthField": "dashLength",
        "legendValueText": " : [[value]] variations",
        "title": "Number of variations",
        "bulletText": "[[value]] variations",
        "fillAlphas": 0,
        "valueField": "number",
        "valueAxis": "distanceAxis"
    }],
    "chartCursor": {
        "cursorAlpha": 0.1,
        "cursorColor":"#000000",
         "fullWidth":true,
        "valueBalloonsEnabled": true,
        "zoomable": true
    },
    "categoryField": "chromosome",
    "categoryAxis": {
        "startOnAxis": true, 
	    "title": "Chromosomes",
        "autoGridCount": false,
        "axisColor": "#555555",
        "gridAlpha": 0.1,
        "gridColor": "#FFFFFF",
        "gridCount": 50,
        "zoomable":true
    },
    "export": {
    	"enabled": true
     },
     "chartScrollbar": {}
});
}

//Counting the number of variations in each chromosome
function CountNumberVariationCNV(file) {
	var compteur=0;
	var chr=1;
	var current;
	var chromosome = file[0][1];
	var objectChrVar= []
	var l = file.length;
	for (var i=0; i<l; i++) {
		current = file[i][1]; 
		if (chromosome !== current) {
			objectChrVar.push({
				chromosome:chr,
				number:compteur
			})
			chromosome = current;
			chr++;
			compteur=0;
			if (file[i][9]!== file[i][3]) {
				compteur++
			}
		} else {
			chromosome = current;
			if (file[i][9]!== file[i][3]) {
				compteur++
			}
		}
	}
	objectChrVar.push({
		chromosome:chr,
		number:compteur
	})
	return objectChrVar;
}

//counting the number of variation of a given position
function countPositionVariation(begin, end, chr, file) {
	var variations = []
	//we have to count for each sample, that's why we put all the response got for the server
	var l = file.length;
	
	variations.length = l
	for (var x=0; x<l; x++) { //for each isolat or sample
		var ll = file[x].length;
		console.log(ll)
		variations[x] =0
		for (var z=0; z< ll; z++) { //for each line in the sample , we are intersted in the index 5 and 4 of the line
			//we first look for the chromosome :
				console.log(file[x][z])

			if (chr === parseInt(file[x][z][1])) {
				var test = 1;
				console.log(file[x][z])
				debugger
				//the we look for the begin position where it's located
				if ( (begin >= file[x][z][4]) && ( begin < file[x][z][5]) ) {
					console.log('we are a the first condixtion')
					debugger
					if (end === file[x][z][5]) {
						variations[x]+= file[x][z][9];
						break;
					} else if (end < file[x][z][5]) {
						variations[x]+= file[x][z][9];
						break;
					} else {
						variations[x]+= file[x][z][9];
					}

				} else if ( begin < file[x][z][4]) {
					console.log(file[x][z])
					console.log("second condition ", z )
					console.log(" chr = ", file[x][z][1]); 
					console.log("begin = ", file[x][z][4], " my begin = ", begin)
					debugger
					if (end < file[x][z][4]) {
						// break;
					} else if (end === file[x][z][4]) {
						variations[x] = variations[x]+ file[x][z][9];
						// break;
					} else {
						if (end < file[x][z][5]) {
							variations[x] = variations[x]+ file[x][z][9];
						} else if (end === file[x][z][5]) {
							variations[x] = variations[x]+ file[x][z][9];
							// break;
						} else {
							variations[x] = variations[x]+ file[x][z][9];
						}
					}
				}
				
			} else {
				if (test ===1) {
					break;
				}
			}

		}

	}
	if ($(".special").children().length >= 1) {
		$(".special").children().remove();
		$(".special").append(' <div><b> Chromosome : </b>'+ chr + '<br>'+'<b>Position start: </b> '+ begin + '<br>' + '<b> End: </b>' + end + '<br><b> Estimated variations: </b>' + variations[0] +'</div>'); 

	} else {
		$(".special").append(' <div><b> Chromosome : </b>'+ chr + '<br>'+'<b>Position start: </b> '+ begin + '<br>' + '<b> End: </b>' + end + '<br><b> Estimated variations: </b>' + variations[0] +'</div>'); 
	}
	return variations;

} 

//ordering the 




