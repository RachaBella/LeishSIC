var l_major_chr_length = [268988, 355712, 384502, 472852, 465823, 516869, 596352, 574960, 573434, 570865, 
						  582573, 675346, 654595, 622644, 629517, 714651, 684829, 739748, 702208, 742537,
						  772972, 716602, 772565, 840950, 912845, 1091540, 1130424, 1160104, 1212663, 1403434,
						  1484328, 1604637, 1583653, 1866748, 2090474, 2682151];

var svgDivINDEL='<div id="svgIndel" class="card-panel col s12 l9 m9" style="margin-top:50px"></div>'
var checkBoxeIsolatINDEL='<input type="checkbox" id="isolat" class="checkIs" checked=""/><label id="lab" for="isolat">Isolat</label>'
var exportButtonINDEL ='<div style="position: relative; height: 70px;"><div class="fixed-action-btn horizontal click-to-trigger" style="position: absolute; right: 24px;"><a class="btn-floating btn-large Menu"><i class="material-icons">menu</i></a><ul><li><a class="btn-floating red modal-trigger" id="callModalINDEL" href="" style="transform: scaleY(1) scaleX(1) translateY(0px) translateX(0px); opacity: 1;"><i class="material-icons">insert_chart</i></a></li><li><a class="btn-floating yellow darken-1 exportButtonINDEL" style="transform: scaleY(1) scaleX(1) translateY(0px) translateX(0px); opacity: 1;"><i class="material-icons">get_app</i></a></li></ul></div></div>'
var chartsDivIndel='<div class="modal myModal bigChartDivINDEL"><div class="col s12" id="chartdivINDEL" style=" height:500px"></div><div class="card-panel myCard center" ><span class="white-text" style="font-size:12px"> This chart represents the total number of insertions and deletions in the chosen file </span></div><div class="col s12" id="chartnbrChrINDEL" style=" height:500px"></div><div class="card-panel myCard2 center" ><span class="white-text" style="font-size:12px"> This chart represents the number of insertions and deletions for each chromosome.</span></div><div class="col s12" id="chartBasePercentRepINDEL" style=" height:500px"></div><div class="card-panel myCard2 center" ><span class="white-text" style="font-size:12px"> This chart represents how many A,C,G or T bases replaced the normal bases, and also calculate the total number of each replacing base in the sample isolat.</span></div><div class="col s12" id="chartBasePercentRepINDEL" style=" height:500px"></div><div class="card-panel myCard2 center" ><span class="white-text" style="font-size:12px"> This chart represents how many A,C,G or T bases replaced the normal bases, and also calculate the total number of each replacing base in the sample isolat.</span></div></div>'


$(document).ready(function() {
	pageLoadIndel();
	$('.tooltipped').tooltip({delay: 50});
});

function pageLoadIndel() {
	//representing the indel
	$(document).on("submit", ".INDELInput", function (event) {
		event.preventDefault();
		var data = new FormData(this);
		var propINDEL = $("#selectIndel").prop("checked")
		if (propINDEL === false){
			sweetAlert("oups..","No file is chosen, please choose at least one file", "error");
		} else {
			$(".echelleINDEL").css("display", "none")
			$(".uploader").css("display","block");
			$(".BIG").css("opacity", "0.5")
			$('.svggIndel').remove();
			$.ajax('/IndelData', {
				type: 'POST',
				data: data,
				processData: false,
				contentType: false,
				success: function (response) {
					$(".uploader").css("display","none");
					$(".BIG").css("opacity", "1")
					var l = response.length;
					for (var k =0; k<l; k++) {
						console.log(response[k][0])
						console.log("length = ", response[k][0][2].length)
						debugger
						appendChartDivINDEL(k)
						drawINDEL(response[k],k)
						$(".checkBoxIndel").append(checkBoxeIsolatINDEL)
						$('#isolat').attr('id', "isolatINDEL"+k);
						$("#lab").attr('id', "lab"+k);
						$("#lab"+k).text("Isolat "+ (k+1));
						$("#lab"+k).attr("for", "isolatINDEL"+k)
						// implementChartINDEL(response[k],k)
					}
					$(".echelleINDEL").css("display", "block")
				    $(".echelleINDEL").pushpin( {
						top: $('#contindel').offset().top,
						bottom: $('#contindel').offset().top + $("#contindel").outerHeight() -300
					})

				},  error: function (response) {

				},
				complete :function (resultat, statut) {

				}
			})
		}
	})

	//if we want to move to a position 
	$(document).on("click", ".moveINDEL", function (event) {
		event.preventDefault();
		var position = $("#beginINDEL").val()
		var chromosome = $("#chromosomeNINDEL").val()
		var isolat = $("#endINDEL").val()
		if (chromosome >realChr) {
			sweetAlert("Oups", "No such number of chromosome", "error")
		} else {
			movetoINDEL(position, chromosome, isolat);
		}
	})

	$(document).on("click", ".exportButtonINDEL", function (event) {
			console.log("clicked")
			var id = $($($($($($($($(this).parent()).parent())).parent())).parent()).parent()).attr("id")
			var svg = $("#"+id).children()[2]
			var serializer = new XMLSerializer();
			var source = serializer.serializeToString(svg);
			source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
			var v = id.replace('svgIndel',"")
			var svgBlob = new Blob([source], {type:"image/svg+xml;charset=utf-8"});
			var svgUrl = URL.createObjectURL(svgBlob);
			// canvg('canvas', '<svg>'+$(svg).html()+"</svg>");
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


}

//Counting the chromosome number present in the file
var realChr=0
function CountChrNumberINDEL(file, indice) {
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

function appendChartDivINDEL(i) {
	$(".chartsINDEL").append(chartsDivIndel) //+"" +matriceTable +"" +qualityChart +""+ qualityChartChr);
	$(".bigChartDivINDEL").attr("class", "modal bigChartINDEL"+i);
	$('.bigChartINDEL'+i).attr('id', "bigChartDivINDEL"+i);
	$('#chartdivINDEL').attr("id","chartdivINDEL"+""+i);
	//i should put the charts button to have an href the charts
	$("#chartnbrChrINDEL").attr('id',"chartnbrChrINDEL" +""+i);
	$("#chartBasePercentRepINDEL").attr('id',"chartBasePercentRepINDEL" +""+i);
	// $("#chartQuality").attr("id", "chartQuality"+""+i);
	// $('#matriceBase').attr("id", "matriceBase"+""+i);
	// $('#chartQualityChr').attr('id', "chartQualityChr" +i);
}

//appending the svg div
function appendSvgDivINDEL(containerType, type, v,className) {
	// $("div#"+ containerType).append("<canvas class='canvasSNP' style='display:none'></canvas>")
	// $('.canvasSNP').attr("id", "canvasSNP"+v);
	$("div#"+ containerType).append(svgDivINDEL);
	$("div#"+ containerType).append('<div class="row col s12 l9 m9 offset-s3 indelZoomButtons" id="indelZommButtons'+v+'"><a class="btn-floating waves-effect waves-light smallButton zoomOut" id="indelZoomOut'+v+'"><i class="material-icons">remove</i></a><button id="indelZoomReset'+v+'" class="btn btn2 zoomReset">Reset</button><a class="btn-floating waves-effect waves-light smallButton zoomIn" id="indelZoomIn'+v+'"><i class="material-icons">add</i></a></div>')
	$("div#svgIndel").attr("id",""+type +v);
    $("div#"+ ""+ type +v).attr("class","card-panel " +" col s12 l9 m9 "+ className );
    $("div#"+""+ type +v).append("<h5>" + $("#selectIndel").val()[v] + "</h5>")
    $("#"+""+ type+"" +v).append(exportButtonINDEL);
    $('#callModalINDEL').attr("id","callModalINDEL"+v)
    $("#callModalINDEL"+v).attr('href',"#bigChartDivINDEL"+v)
    $('.exportButtonINDEL').attr("id", "exportButtonINDEL"+""+v);
    $('.modal-trigger').leanModal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      in_duration: 300, // Transition in duration
      out_duration: 200, // Transition out duration
    });

}

	//****************************GLOBAL VARIABLES FOR CHARTS************************//
   	var insertion=0,
   		deletion=0,
   		numberInsChr=0,
   		numberDelChr=0;
   	var varChr= [];
   	var qualityChartChr=[];
   	var multipleInsertChr=[];
   	var modifierCpt=0;
   	var highCpt=0;
   	var lowCpt=0;
   	var nothingCpt=0;
   	var moderateCpt=0;
   	var lowQualCpt=0;
   	var multipleInsertions=0;
   	//******************************************************************************//
//drawing the indels
function drawINDEL(INDELfile, v) {
	var chr = CountChrNumber(INDELfile, 0);
	appendSvgDivINDEL("contindel", "svgIndel", v, "svggIndel");
	//to create the select only one time...
	if (v ===0) {
		//here we will add the multiple selection option dependeing on the chromosome number
		var select1 = document.getElementById("selChrIndel");
	    for (var j=0; j< chr.length; j++) {
	    	select1.options[select1.options.length] = new Option('Chromosome '+ chr[j] , (j+1));
	    }
	    $(select1).material_select();
	    $("#divSelectIndel").css("display", "block");
	}
	//displaying the positions input : 
	$("#inputINDEL").css("display", "block");
	var svg = d3.select("div#svgIndel"+v)
            .append("svg")
            .attr("id", "svgINDEL"+v)
            .attr("width", 5000)
            .attr("height", chr.length* 100 +100)

    var ch = [];
    ch.length = chr.length;
    console.log("chr =", chr)
    //drawing the labels for chromosomes :
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
			return "txt"+(v+1)+ chr[i]
		})
    	.attr("font-family", "century gothic")
   		.attr("border-radius", "16px")
   		.attr('background-color','#e4e4e4')
   		.attr("font-size","13px")
   		.attr("font-weight","500")
   		.attr("height", "32px")
   		.attr("color","rgba(0, 0, 0, 0.6)")
   		.attr("padding","0 12px")

   	//drawing the labels for the references
   	svg.selectAll("text.ref")
    	.data(ch)
    	.enter()
    	.append("text")
    	.text( function (d, i) {
    		return "Ref_" +  chr[i]; 
    	})
    	.attr("x",10) 
    	.attr("y", function (d, i){
    		return (i+1.5)* 100 + 10;
    	})
    	.attr('id', function (d, i) {
			return "Reftxt"+(v+1)+ chr[i]
		})
    	.attr("font-family", "century gothic")
   		.attr("border-radius", "16px")
   		.attr('background-color','#e4e4e4')
   		.attr("font-size","13px")
   		.attr("font-weight","500")
   		.attr("height", "32px")
   		.attr("color","rgba(0, 0, 0, 0.6)")
   		.attr("padding","0 12px")

   	//we put each position on a g tag
   	
   	var y1=1;
   	var y2=0;
   	var xBefore=60;

   	svg.selectAll("rect")
   		.data(ch)
   		.enter()
   		.append("rect")
   		.attr("x", 60)
   		.attr('y', function (d,i) {
   			return (i+1)* 100;
   		})
   		.attr("height", 20)
   		.attr('id', function (d, i){
   			return 'cadreI'+(v+1)+ chr[i]
   		})
   		.attr("width", function (d,i) {
   			return (l_major_chr_length[i]/500)
   		})
   		.attr('fill','grey')

   	svg.selectAll("rect.ref")
   		.data(ch)
   		.enter()
   		.append("rect")
   		.attr("x", 60)
   		.attr('y', function (d,i) {
   			return (i+1.5)* 100;
   		})
   		.attr("height", 20)
   		.attr('id', function (d, i){
   			return 'cadreIref'+(v+1)+ chr[i]
   		})
   		.attr("width", function (d,i) {
   			return (l_major_chr_length[i]/500)
   		})
   		.attr('fill',"grey")

   	var lon= INDELfile.length;
   	var current = INDELfile[0][0]; 
   	var before = INDELfile[0][0];
   	var g= svg.append("g")
   			.data(INDELfile[1])
   			.attr("x", xBefore)
   			.attr("y", y1 *100)
   			.attr("id","g"+chr[y1-1])

   	//Reference
   	var g2= svg.append("g")
   			.data(INDELfile[1])
   			.attr("x", xBefore)
   			.attr("y", 1.5 *100)
   			.attr("id","gRef"+chr[y1-1])	

   	var X=60;
   	var check = 0;
   	for (var k =0; k< lon; k++) {
   		if (INDELfile[k][3].length< INDELfile[k][2].length) {
   			deletion = deletion +1
   		} else {
   			insertion =insertion+1
   		}
		var alternative=[]; 
		if (INDELfile[k][3].match(/,/g) !== null) {
			multipleInsertions++;
			alternative = INDELfile[k][3].split(',');
			var hell = INDELfile[k][3]
			check=1;
			var LON = alternative.length
			var max=0
			var index = 0
			for (var b=0; b< LON; b++) {
				if (alternative[b].length > max) {
					max = alternative[b].length
					index=b;
				}
			}
			var leAlt = max
		} else {
			var leAlt = INDELfile[k][3].length;
		}
		var leRef = INDELfile[k][2].length;
   		current = INDELfile[k][0]; 
   		if (current !== before) {
   			y1++;
   			y2++;
   			X=60;
   			xBefore=60;
   			multipleInsertChr.push({
   				chromosome: chr[y1-1],
   				multiple: multipleInsertions
   			})
   			varChr.push({ chromosome: chr[y1-1],
   						  insertion: numberInsChr,
   						  deletion: numberDelChr
   						});
   			multipleInsertions =0;
   			numberInsChr=0;
   			numberDelChr=0;
   			before = current
   		 	var g= svg.append("g")
		   			.data([1])
		   			.attr("x", xBefore)
		   			.attr("y", y1 *100)
		   			.attr("id","g"+chr[y1-1])
		    //Reference
		   	var g2= svg.append("g")
		   			.data([1])
		   			.attr("x", xBefore)
		   			.attr("y", (y2+1.5) *100)
		   			.attr("id","gRef"+chr[y1-1])

		   	//Reference
			var rect2= g2.append("rect")
   						.data([INDELfile[k]])
   						.attr("id","RECTRef"+chr[y1-1]+ INDELfile[k][1])
   						.attr("x", xBefore)
		   				.attr("y", (y2+1.5) *100)
			   			.attr("fill", function (d,i) {
			   				if (leAlt > leRef) {
			   					return "#FF7F50"
			   				} else {
			   					return "#5F9EA0"
			   				}
			   			})
			   			.attr("height", 20)
			   			.attr("width", function (d,i) {
			   				if (leAlt < leRef) {
			   					//we take then the leRef
		
			   					return (2*leRef)+ 1
			   				} else {
			   					//we take then the leAlt
			   				
			   					return (2*leAlt)+ 1
			   				}
			   			})

		   	var rect= g.append("rect")
   						.data([INDELfile[k]])
   						.attr("id","RECT"+chr[y1-1]+ INDELfile[k][1])
   						.attr("x", xBefore)
		   				.attr("y", y1 *100)
			   			.attr("fill", function (d,i) {
			   				var value = INDELfile[k][5]
							if (value.match(/LOW/) !== null) {
								lowCpt++; 
							} else if (value.match(/MODERATE/) !== null) {
								moderateCpt++
							} else if (value.match(/HIGH/) !== null) {
								highCpt++
							} else if (value.match(/MODIFIER/) !== null) {
								modifierCpt++;
							}else {
								nothingCpt++
							}
			   				if (leAlt > leRef) {
			   					return "#FF7F50"
			   				} else {
			   					return "#5F9EA0"
			   				}
			   			})
			   			.attr("height", 20)
			   			.attr("width", function (d,i) {
			   				if (leAlt < leRef) {
			   					//we take then the leRef
			   					numberDelChr++
			   					xBefore += (2*leRef)+1
			   					return 2*leRef+ 1
			   				} else {
			   					//we take then the leAlt
			   					numberInsChr++
			   					xBefore+= (2*leAlt)+1
			   					return 2*leAlt+ 1
			   				}
			   			})
   		} else {
   			before =current

   			//Reference
			var rect2= g2.append("rect")
   						.data([INDELfile[k]])
   						.attr("id","RECTRef"+chr[y1-1]+ INDELfile[k][1])
   						.attr("x", xBefore)
		   				.attr("y", (y2+1.5) *100)
			   			.attr("fill", function (d,i) {
			   				if (leAlt > leRef) {
			   					return "#FF7F50"
			   				} else {
			   					return "#5F9EA0"
			   				}
			   			})
			   			.attr("height", 20)
			   			.attr("width", function (d,i) {
			   				if (leAlt < leRef) {
			   					//we take then the leRef
			   					
			   					return (2*leRef)+ 1
			   				} else {
			   					//we take then the leAlt
			   					
			   					return (2*leAlt)+ 1
			   				}
			   			})
   			var rect= g.append("rect")
   						.data([INDELfile[k]])
   						.attr("id","RECT"+chr[y1-1]+ INDELfile[k][1])
   						.attr("x", xBefore)
		   				.attr("y", y1 *100)
			   			.attr("fill", function (d,i) {
			   				var value = INDELfile[k][5]
							if (value.match(/LOW/) !== null) {
								lowCpt++; 
							} else if (value.match(/MODERATE/) !== null) {
								moderateCpt++
							} else if (value.match(/HIGH/) !== null) {
								highCpt++
							} else if (value.match(/MODIFIER/) !== null) {
								modifierCpt++;
							}else {
								nothingCpt++
							}
							//*****************//
			   				if (leAlt > leRef) {
			   					return "#FF7F50"
			   				} else {
			   					return "#5F9EA0"
			   				}
			   				if (leAlt > leRef) {
			   					return "#FF7F50"
			   				} else {
			   					return "#5F9EA0"
			   				}
			   			})
			   			.attr("height", 20)
			   			.attr("width", function (d,i) {
			   				if (leAlt < leRef) {
			   					//we take then the leRef
			   					numberDelChr++
			   					xBefore+= (2*leRef)+1
			   					return (2*leRef)+ 1
			   				} else {
			   					//we take then the leAlt
			   					numberInsChr++
			   					xBefore+= (2*leAlt)+1
			   					return (2*leAlt)+ 1
			   				}
			   			})
			
   		}

   		X = X+1;
   		//we take then the leAlt to draw
   		if (alternative.length ===0) {
			for (var z=0; z< leAlt; z++) {
				g.append("rect")
					.data([1])
					.attr("x", X+ (2*z))
					.attr("y", y1*100)
					.attr("fill", "black")
					.attr("width",1)
					.attr("height", 20)	
				g.append("text")
					.data([1])
					.attr('x', X+ (2*z) +0.3)
					.attr('y', (y1*100)-1)
					.text(INDELfile[k][3][z])
					.style("color", "black")
					.style("font-size", '1px')			
			}
   		} else {
   			 	
   			for (var z=0; z< leAlt; z++) {
				g.append("rect")
					.data([1])
					.attr("x", X+ (2*z))
					.attr("y", y1*100)
					.attr("fill", "black")
					.attr("width",1)
					.attr("height", 20)
				$('svg rect#RECT'+chr[y1-1]+INDELfile[k][1]).tipsy({ 
			        gravity: 's', 
			        html: true, 
			        title: function() {
			        	var d = this.__data__;
				        if ( d === undefined) {
				         	return "Nan"
				        } else {
				        	return '<h5>'+d[3]+'</h5>'	
				        }
			        }
			    });
				g.append("text")
					.data([1])
					.attr('x', X+ (2*z) +0.3)
					.attr('y', (y1*100)-1)
					.text(alternative[index][z])
					.style("color", "black")
					.style("font-size", '1px')						
			}
   			
   		}
		//Reference
		for (var t=0; t< leRef; t++) {
			g2.append("rect")
				.data([1])
				.attr("x", X+ 2*t)
				.attr("y", (y2+1.5)*100)
				.attr("fill", "black")
				.attr("width",1)
				.attr("height", 20)
			g2.append("text")
					.data([1])
					.attr('x', X+ (2*t) +0.3)
					.attr('y', ((y2+1.5)*100)-1)
					.text(INDELfile[k][2][t])
					.style("color", "black")
					.style("font-size", '1px')	
		}
		X= xBefore;
   		
   	}
   	multipleInsertChr.push({
   				chromosome: chr[y1-1],
   				multiple: multipleInsertions
   			})
   	varChr.push({ 
   				chromosome: chr[y1-1],
	     		insertion: numberInsChr,
   				deletion: numberDelChr
   				});
   	console.log(varChr)
 var zoom = svgPanZoom('#svgINDEL'+v, {
		  panEnabled: true
		, controlIconsEnabled: false
		, zoomEnabled: true
		, dblClickZoomEnabled: true
		, mouseWheelZoomEnabled: true
		, preventMouseEventsDefault: true
		, zoomScaleSensitivity: 0.3
		, maxZoom: 100
		, center: false
		, fit: false
		, contain: false
		, refreshRate: 'auto'
		});
    zoom.zoom(1)

    implementChartINDEL(insertion,deletion,v)
    implementNumberINDEL(varChr, v) 
    implementQualINDEL(lowCpt,highCpt,moderateCpt, modifierCpt, nothingCpt, v)
    implementMultipleInser(multipleInsertions,v)
    

}

function implementNumberINDEL(varChr, i) {
	var chart = AmCharts.makeChart("chartnbrChrINDEL"+i, {
    "type": "serial",
    "theme": "light",
    "legend": {
        "useGraphSettings": true
    },
    "dataProvider":varChr,
    "synchronizeGrid":true,
    "valueAxes": [{
        "id":"v1",
        "axisColor": "#FF6600",
        "axisThickness": 2,
        "axisAlpha": 1,
        "position": "left"
    }, {
        "id":"v2",
        "axisColor": "#FCD202",
        "axisThickness": 2,
        "axisAlpha": 1,
        "position": "right"
    }],
    "graphs": [{
        "valueAxis": "v1",
        "lineColor": "#FF6600",
        "bullet": "round",
        "bulletBorderThickness": 1,
        "hideBulletsCount": 30,
        "title": "Deletions",
        "valueField": "deletion",
		"fillAlphas": 0
    }, {
        "valueAxis": "v2",
        "lineColor": "#FCD202",
        "bullet": "triangleUp",
        "bulletBorderThickness": 1,
        "hideBulletsCount": 30,
        "title": "Insertions",
        "valueField": "insertion",
		"fillAlphas": 0
    }],
    "chartScrollbar": {},
    "chartCursor": {
        "cursorPosition": "mouse"
    },
    "categoryField": "chromosome",
    "categoryAxis": {
        "axisColor": "#DADADA",
        "minorGridEnabled": true
    },
    "export": {
    	"enabled": true,
        "position": "bottom-right"
     }
});
}

function implementChartINDEL(insertion, deletion, i) {
	var chart = AmCharts.makeChart("chartdivINDEL"+i,
	{
	    "type": "serial",
	    "theme": "light",
	    "dataProvider": [{
	        "name": "Insertions",
	        "total": insertion,
	        "color": "#7F8DA9"
	    }, {
	        "name": "Deletions",
	        "total": deletion,
	        "color": "#FEC514"
	    }],
	    "valueAxes": [{
	        "maximum": 10000,
	        "minimum": 0,
	        "axisAlpha": 0,
	        "dashLength": 4,
	        "position": "left"
	    }],
	    "startDuration": 1,
	    "graphs": [{
	        "balloonText": "<span style='font-size:13px;'>[[category]]: <b>[[value]]</b></span>",
	        "bulletOffset": 10,
	        "bulletSize": 52,
	        "colorField": "color",
	        "cornerRadiusTop": 8,
	        "fillAlphas": 0.8,
	        "lineAlpha": 0,
	        "legendValueText": "[[value]] substitution quality",
        	"title": "Type of Variation",
	        "type": "column",
	        "valueField": "total"
	    }],
	    "categoryField": "name",
	    "categoryAxis": {
	        "axisAlpha": 0,
	        "gridAlpha": 0,
	        "inside": true,
	        "tickLength": 0
	    },
	    "export": {
	    	"enabled": true
	     }
	});
}

function implementQualINDEL(low,high,moderate,modifier,nothing, i) {

}

function implementMultipleInser(multipleInsertions, i) {
	var chart = AmCharts.makeChart("chartdiv", {
    "type": "serial",
    "theme": "light",
    "marginRight": 80,
    "dataProvider": multipleInsertions,
    "valueAxes": [{
        "axisAlpha": 0.1
    }],

    "graphs": [{
        "balloonText": "[[title]]: [[value]]",
        "columnWidth": 20,
        "fillAlphas": 1,
        "title": "daily",
        "type": "column",
        "valueField": "value2"
    }, {
        "balloonText": "[[title]]: [[value]]",
        "lineThickness": 2,
        "title": "intra-day",
        "valueField": "value1"
    }],
    "zoomOutButtonRollOverAlpha": 0.15,
    "chartCursor": {
        "categoryBalloonDateFormat": "MMM DD JJ:NN",
        "cursorPosition": "mouse",
        "showNextAvailable": true
    },
    "autoMarginOffset": 5,
    "columnWidth": 1,
    "categoryField": "date",
    "categoryAxis": {
        "minPeriod": "hh",
        "parseDates": true
    },
    "export": {
        "enabled": true
    }
});

}

function movetoIndel(pos, chr, isolat) {

}