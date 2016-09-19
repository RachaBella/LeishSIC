var l_major_chr_length = [268988, 355712, 384502, 472852, 465823, 516869, 596352, 574960, 573434, 570865, 
						  582573, 675346, 654595, 622644, 629517, 714651, 684829, 739748, 702208, 742537,
						  772972, 716602, 772565, 840950, 912845, 1091540, 1130424, 1160104, 1212663, 1403434,
						  1484328, 1604637, 1583653, 1866748, 2090474, 2682151];

// var color_panel = ["blue", "red", "yellow", "green", " purple lighten-5", "red accent-1", "cyan lighten-4", "grey lighten-3"];
var svgDiv='<div id="svgSnp" class="card-panel col s12 l9 m9" style="margin-top:50px"></div>'
var checkBoxeIsolatCNV='<input type="checkbox" id="isolat" class="checkIs" checked=""/><label id="lab" for="isolat">Isolat</label>'
var chartsDivSnp='<div class="modal myModal bigChartDivSNP"><div class="col s12" id="chartdivSNP" style=" height:500px"></div><div class="card-panel myCard center" ><span class="white-text" style="font-size:12px"> This chart represents how many variations are in each chromosome, whatever the replaced base is. </span></div><div class="col s12" id="chartBasePercentSNP" style=" height:500px"></div><div class="card-panel myCard2 center" ><span class="white-text" style="font-size:12px"> This chart represents how many A,C,G,T bases have been replaced in each chromosomes, and also shows the total number of each base replaced.</span></div><div class="col s12" id="chartBasePercentRepSNP" style=" height:500px"></div><div class="card-panel myCard2 center" ><span class="white-text" style="font-size:12px"> This chart represents how many A,C,G or T bases replaced the normal bases, and also calculate the total number of each replacing base in the sample isolat.</span></div>'
var qualityChart='<div class="col s12" style="height:200px"  id="chartQuality"></div><div class="card-panel myCard center" ><span class="white-text" style="font-size:12px"> This chart represents the quality of each variation. </span></div>'
var matriceTable= '<div class="col s12" style="height:260px"><table class="highlight centered myTable" id="matriceBase"><thead><tr><th data-field=""> </th><th data-field="A">A</th><th data-field="T">T</th><th data-field="C">C</th><th data-field="G">G</th><th data-field="total">Total (of substitutes)</th></tr></thead><tbody><tr class="matA"><td>A</td><td class="00"></td><td class="01"></td><td class="02"></td><td class="03"></td><td class="04"></td></tr><tr class="matT"><td>T</td><td  class="10"></td><td class="11"></td><td class="12"></td><td class="13"></td><td class="14"></td></tr><tr class="matC"><td>C</td><td class="20"></td><td class="21"></td><td class="22"></td><td class="23"></td><td class="24"></td></tr><tr class="matG"><td>G</td><td class="30"></td><td class="31"></td><td class="32"></td><td class="33"></td><td class="34"></td></tr></tbody></table></div><div class="card-panel myCard center" ><span class="white-text" style="font-size:12px"> This is a matrice showing for each base the number of the substitutes from each other base, and a total of substitutes bases. </span></div>'
var qualityChartChr='<div class="col s12" id="chartQualityChr" style=" height:500px"></div><div class="card-panel myCard center" ><span class="white-text" style="font-size:12px"> This chart represents the quality of the variation for each chromosome. </span></div></div>'
var exportButtonSNP ='<div style="position: relative; height: 70px;"><div class="fixed-action-btn horizontal click-to-trigger" style="position: absolute; right: 24px;"><a class="btn-floating btn-large Menu"><i class="material-icons">menu</i></a><ul><li><a class="btn-floating red modal-trigger" id="callModalSNP" href="" style="transform: scaleY(1) scaleX(1) translateY(0px) translateX(0px); opacity: 1;"><i class="material-icons">insert_chart</i></a></li><li><a class="btn-floating yellow darken-1 exportButtonSNP" style="transform: scaleY(1) scaleX(1) translateY(0px) translateX(0px); opacity: 1;"><i class="material-icons">get_app</i></a></li></ul></div></div>'

$(document).ready(function() {
	pageLoadSnp();
});

function moveto(position, chromosome, isolat) {
	var v = $('#contsnp').children().length /2;
	if (isolat ==="") {
		// automatically do the first isolat
		var panZoomTiger = svgPanZoom('#svgSNP0');
		if (position <= l_major_chr_length[chromosome-1]) {
			$('#svgSnp0').scrollLeft(60 + (parseInt(position)/500))
			$('html,body, .svggSnp').animate({
	                    scrollTop: parseInt(chromosome)*100
	                }, 2000)
			// Pan to rendered point x = 50, y = 50
			// panZoomTiger.pan({x: 60- (position/500) , y: parseInt(chromosome) *100 + 10})
		} else {
			sweetAlert("oups..","The position required doesn't exist in the chromosome "+ chromosome, "error");
			
		}
	} else {
		//check if the isolat exists or not
		if ((isolat <=v) && (isolat >0)) {
			if (position <= l_major_chr_length[chromosome-1]) {
				var panZoomTiger = svgPanZoom('#svgSNP'+(isolat-1));
				$('#svgSnp'+(isolat-1)).scrollLeft(60 + (parseInt(position)/500))
				$('html,body, .svggSnp').animate({
		                    scrollTop: parseInt(chromosome)*100 *parseInt(isolat)
		                }, 2000)
			} else {
				sweetAlert("oups..","The position required doesn't exist in the chromosome "+ chromosome, "error");
			}

		} else if (isolat ==0) {
			//automatically do the first isolat
			if (position <= l_major_chr_length[chromosome-1]) {
				var panZoomTiger = svgPanZoom('#svgSNP0');
				$('#svgSnp0').scrollLeft(60 + (parseInt(position)/500))
				$('html,body, .svggSnp').animate({
		                    scrollTop: parseInt(chromosome)*100
		                }, 2000)
			} else {
				sweetAlert("oups..","The position required doesn't exist in the chromosome "+ chromosome, "error");
			}

		} else if (isolat > v) {
			if (position <= l_major_chr_length[chromosome-1]) {
				var panZoomTiger = svgPanZoom('#svgSNP0');
				$('#svgSnp0').scrollLeft(60 + (parseInt(position)/500))
				$('html,body, .svggSnp').animate({
		                    scrollTop: parseInt(chromosome)*100 *v
		                }, 2000)
			} else {
				sweetAlert("oups..","The position required doesn't exist in the chromosome "+ chromosome, "error");
			}
		}
	}
	// panZoomTiger.zoom(3 ,{x: 60- (position/500) , y: parseInt(chromosome) *100 + 10} )
	
}

function pageLoadSnp(){

	//representing the snp
	$(document).on("submit", ".SNPInput", function (event) {
		event.preventDefault();
		var data = new FormData(this);
		var propSNP = $("#selectSNP").prop("checked")
		if (propSNP === false){
			sweetAlert("oups..","No file is chosen, please choose at least one file", "error");
		} else {
			$(".echelleSNP").css("display", "none")
			$(".uploader").css("display","block");
			$(".BIG").css("opacity", "0.5")
			$('.svggSnp').remove();
			$.ajax('/SnpData', {
				type: 'POST',
				data: data,
				processData: false,
				contentType: false,
				success: function (response) {
					$(".uploader").css("display","none");
					$(".BIG").css("opacity", "1")
					var l = response.length
					console.log("the response of snp sent file :",l)
					for (var k =0; k<l; k++) {
						drawSNP(response[k],k)
						$(".checkBoxSnp").append(checkBoxeIsolatCNV)
						$('#isolat').attr('id', "isolatSNP"+k);
						$("#lab").attr('id', "lab"+k);
						$("#lab"+k).text("Isolat "+ (k+1));
						$("#lab"+k).attr("for", "isolatSNP"+k)
						appendChartDivSNP(k)
						implementChartSNP(response[k],k)
					}
					$(".echelleSNP").css("display", "block")
				    $(".echelleSNP").pushpin( {
						top: $('#contsnp').offset().top,
						bottom: $('#contsnp').offset().top + $("#contsnp").outerHeight() -300
					})
					// $(".checkBoxCnv").append(checkBoxRef);
					// $('.refIs').attr("id","refOfSnp")


				}, error: function (response) {

				},
				complete :function (resultat, statut) {

				}
			})
		} 
			
	})

	//if we want to move to a position 
	$(document).on("click", ".move", function (event) {
		event.preventDefault();
		var position = $("#beginSNP").val()
		var chromosome = $("#chromosomeNSNP").val()
		var isolat = $("#endSNP").val()
		if (chromosome >realChr) {
			sweetAlert("Oups", "No such number of chromosome", "error")
		} else {
			moveto(position, chromosome, isolat);
		}
	})
			


	$(document).on("click", ".exportButtonSNP", function (event) {
			console.log("clicked")
			var id = $($($($($($($($(this).parent()).parent())).parent())).parent()).parent()).attr("id")
			var svg = $("#"+id).children()[2]
			var serializer = new XMLSerializer();
			var source = serializer.serializeToString(svg);
			source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
			var v = id.replace('svgSnp',"")
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
function CountChrNumber(file, indice) {
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

//appending the charts Div
function appendChartDivSNP(i) {
	$(".chartsSNP").append(chartsDivSnp +"" +matriceTable +"" +qualityChart +""+ qualityChartChr);
	$(".bigChartDivSNP").attr("class", "modal bigChartSNP"+i);
	$('.bigChartSNP'+i).attr('id', "bigChartDivSNP"+i);
	$('#chartdivSNP').attr("id","chartdivSNP"+""+i);
	//i should put the charts button to have an href the charts
	$("#chartBasePercentSNP").attr('id',"chartBasePercentSNP" +""+i);
	$("#chartBasePercentRepSNP").attr('id',"chartBasePercentRepSNP" +""+i);
	$("#chartQuality").attr("id", "chartQuality"+""+i);
	$('#matriceBase').attr("id", "matriceBase"+""+i);
	$('#chartQualityChr').attr('id', "chartQualityChr" +i);
}

//appending the svg div
function appendSvgDivSNP(containerType, type, v,className) {
	// $("div#"+ containerType).append("<canvas class='canvasSNP' style='display:none'></canvas>")
	// $('.canvasSNP').attr("id", "canvasSNP"+v);
	$("div#"+ containerType).append(svgDiv);
	$("div#"+ containerType).append('<div class="row col s12 l9 m9 offset-s3 snpZoomButtons" id="snpZommButtons'+v+'"><a class="btn-floating waves-effect waves-light smallButton zoomOut" id="snpZoomOut'+v+'"><i class="material-icons">remove</i></a><button id="snpZoomReset'+v+'" class="btn btn2 zoomReset">Reset</button><a class="btn-floating waves-effect waves-light smallButton zoomIn" id="snpZoomIn'+v+'"><i class="material-icons">add</i></a></div>')
	$("div#svgSnp").attr("id",""+type +v);
    $("div#"+ ""+ type +v).attr("class","card-panel " +" col s12 l9 m9 "+ className );
    $("div#"+""+ type +v).append("<h5>" + $("#selectSNP").val()[v] + "</h5>")
    $("#"+""+ type+"" +v).append(exportButtonSNP);
    $('#callModalSNP').attr("id","callModalSNP"+v)
    $("#callModalSNP"+v).attr('href',"#bigChartDivSNP"+v)
    $('.exportButtonSNP').attr("id", "exportButtonSNP"+""+v);
    $('.modal-trigger').leanModal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      in_duration: 300, // Transition in duration
      out_duration: 200, // Transition out duration
    });
}

//************************GLOBAL VARIABLES FOR CHARTS**********************************************//
var varNumber = [], // I will need this global variable for my charts, since im doing the same operation here, i'll push directly to my array an object
    baseReplaced = [], //it's the array of the bases present
    qualityNumber = [],
    baseReplacing = [], // where we'll store the the numbers of the base replacing
    matrice=[[0,0,0,0,0],
    		 [0,0,0,0,0],
    		 [0,0,0,0,0],
    		 [0,0,0,0,0]]//where we'll store the base matrice ; example matrice[0][1] : corresponds to how many T bases replace the A base , we'll have this table

   	
    // -----------------------------------------------
    //       A  |   T 	|	C 	|	G
    // --------------------------------
    //  A       |       |       |
    // -------------------------------- 
    //  T       |       |       |
    // --------------------------------
    //  C       |       |       |
    // --------------------------------
    //  G  		|       |       |
    // --------------------------------

//global variables for the qualities, will need them for the chart implementing, thos are the total
var cptHight=0;
	cptModerate=0,
	cptLow=0,
	cptNothing=0,
	cptModifier=0;

// global variables for number of replaced bases for each chromosome
var baseAReplaced =0,
	baseTReplaced =0,
	baseCReplaced =0,
	baseGReplaced =0;

// global variables for number of replacing bases for each chrmosome
var baseAReplacing =0,
	baseTReplacing =0,
	baseCReplacing =0,
	baseGReplacing =0;
//*************************************************************************************************//

//drawing the snps
function drawSNP(SNPfile, v) {
	var chr = CountChrNumber(SNPfile, 0);
	appendSvgDivSNP("contsnp", "svgSnp", v, "svggSnp");
	//to create the select only one time...
	if (v ===0) {
		//here we will add the multiple selection option dependeing on the chromosome number
		var select1 = document.getElementById("selChrSnp");
	    for (var j=0; j< chr.length; j++) {
	    	select1.options[select1.options.length] = new Option('Chromosome '+ chr[j] , (j+1));
	    }
	    $(select1).material_select();
	    $("#divSelectSnp").css("display", "block");
	}

	//displaying the positions input : 
	$("#inputSNP").css("display", "block");

	//Starting drawing the svg
	// var ggg='<g id="svg-pan-zoom-controls" transform="translate(1930 3624) scale(0.75)" class="svg-pan-zoom-control"><g id="svg-pan-zoom-zoom-in" transform="translate(30.5 5) scale(0.015)" class="svg-pan-zoom-control"><rect x="0" y="0" width="1500" height="1400" class="svg-pan-zoom-control-background"></rect><path d="M1280 576v128q0 26 -19 45t-45 19h-320v320q0 26 -19 45t-45 19h-128q-26 0 -45 -19t-19 -45v-320h-320q-26 0 -45 -19t-19 -45v-128q0 -26 19 -45t45 -19h320v-320q0 -26 19 -45t45 -19h128q26 0 45 19t19 45v320h320q26 0 45 19t19 45zM1536 1120v-960 q0 -119 -84.5 -203.5t-203.5 -84.5h-960q-119 0 -203.5 84.5t-84.5 203.5v960q0 119 84.5 203.5t203.5 84.5h960q119 0 203.5 -84.5t84.5 -203.5z" class="svg-pan-zoom-control-element"></path></g><g id="svg-pan-zoom-reset-pan-zoom" transform="translate(5 35) scale(0.4)" class="svg-pan-zoom-control"><rect x="2" y="2" width="182" height="58" class="svg-pan-zoom-control-background"></rect><path d="M33.051,20.632c-0.742-0.406-1.854-0.609-3.338-0.609h-7.969v9.281h7.769c1.543,0,2.701-0.188,3.473-0.562c1.365-0.656,2.048-1.953,2.048-3.891C35.032,22.757,34.372,21.351,33.051,20.632z" class="svg-pan-zoom-control-element"></path><path d="M170.231,0.5H15.847C7.102,0.5,0.5,5.708,0.5,11.84v38.861C0.5,56.833,7.102,61.5,15.847,61.5h154.384c8.745,0,15.269-4.667,15.269-10.798V11.84C185.5,5.708,178.976,0.5,170.231,0.5z M42.837,48.569h-7.969c-0.219-0.766-0.375-1.383-0.469-1.852c-0.188-0.969-0.289-1.961-0.305-2.977l-0.047-3.211c-0.03-2.203-0.41-3.672-1.142-4.406c-0.732-0.734-2.103-1.102-4.113-1.102h-7.05v13.547h-7.055V14.022h16.524c2.361,0.047,4.178,0.344,5.45,0.891c1.272,0.547,2.351,1.352,3.234,2.414c0.731,0.875,1.31,1.844,1.737,2.906s0.64,2.273,0.64,3.633c0,1.641-0.414,3.254-1.242,4.84s-2.195,2.707-4.102,3.363c1.594,0.641,2.723,1.551,3.387,2.73s0.996,2.98,0.996,5.402v2.32c0,1.578,0.063,2.648,0.19,3.211c0.19,0.891,0.635,1.547,1.333,1.969V48.569z M75.579,48.569h-26.18V14.022h25.336v6.117H56.454v7.336h16.781v6H56.454v8.883h19.125V48.569z M104.497,46.331c-2.44,2.086-5.887,3.129-10.34,3.129c-4.548,0-8.125-1.027-10.731-3.082s-3.909-4.879-3.909-8.473h6.891c0.224,1.578,0.662,2.758,1.316,3.539c1.196,1.422,3.246,2.133,6.15,2.133c1.739,0,3.151-0.188,4.236-0.562c2.058-0.719,3.087-2.055,3.087-4.008c0-1.141-0.504-2.023-1.512-2.648c-1.008-0.609-2.607-1.148-4.796-1.617l-3.74-0.82c-3.676-0.812-6.201-1.695-7.576-2.648c-2.328-1.594-3.492-4.086-3.492-7.477c0-3.094,1.139-5.664,3.417-7.711s5.623-3.07,10.036-3.07c3.685,0,6.829,0.965,9.431,2.895c2.602,1.93,3.966,4.73,4.093,8.402h-6.938c-0.128-2.078-1.057-3.555-2.787-4.43c-1.154-0.578-2.587-0.867-4.301-0.867c-1.907,0-3.428,0.375-4.565,1.125c-1.138,0.75-1.706,1.797-1.706,3.141c0,1.234,0.561,2.156,1.682,2.766c0.721,0.406,2.25,0.883,4.589,1.43l6.063,1.43c2.657,0.625,4.648,1.461,5.975,2.508c2.059,1.625,3.089,3.977,3.089,7.055C108.157,41.624,106.937,44.245,104.497,46.331z M139.61,48.569h-26.18V14.022h25.336v6.117h-18.281v7.336h16.781v6h-16.781v8.883h19.125V48.569z M170.337,20.14h-10.336v28.43h-7.266V20.14h-10.383v-6.117h27.984V20.14z" class="svg-pan-zoom-control-element"></path></g><g id="svg-pan-zoom-zoom-out" transform="translate(30.5 70) scale(0.015)" class="svg-pan-zoom-control"><rect x="0" y="0" width="1500" height="1400" class="svg-pan-zoom-control-background"></rect><path d="M1280 576v128q0 26 -19 45t-45 19h-896q-26 0 -45 -19t-19 -45v-128q0 -26 19 -45t45 -19h896q26 0 45 19t19 45zM1536 1120v-960q0 -119 -84.5 -203.5t-203.5 -84.5h-960q-119 0 -203.5 84.5t-84.5 203.5v960q0 119 84.5 203.5t203.5 84.5h960q119 0 203.5 -84.5 t84.5 -203.5z" class="svg-pan-zoom-control-element"></path></g></g>'
	var svg = d3.select("div#svgSnp"+v)
            .append("svg")
            .attr("id", "svgSNP"+v)
            .attr("width", 2000)
            .attr("height", chr.length* 100 +100)
        //     .call(d3.behavior.zoom().on("zoom", function () {
        // 		// svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
     		 // }))
			
            

    
     svg.append("g")
	//Writing some labels :
	var ch = [];
    ch.length = chr.length;
    console.log("chr =", chr)
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
    var L = l_major_chr_length.length
    // $("#canvasSNP"+v).attr("height", chr*100 +150)
    // $("#canvasSNP"+v).attr("width", l_major_chr_length[L-1]/500 + 200)

   	ch = [];
    ch.length = chr.length;

	// svg.selectAll("rect")
	// 	.data(ch)
	// 	.enter()
	// 	.append("rect")
	// 	.attr("x", 60)
	// 	.attr("y", function (d,i) {
	// 		return ((i+1) * 100);
	// 	})
	// 	.attr("width", function (d,i) {
	// 		return (l_major_chr_length[i]/500)
	// 	})
	// 	.attr("height", 20)
	// 	.attr('id', function (d,i) {
	// 		return 'cadre'+(v+1)+(i+1)
	// 	})
	// 	.attr('fill', "white")

	y1 = 1;
   	var current;
   	var before = SNPfile[0][0];
   	var avant = SNPfile[0][0];
	var chromo = 1
	var x1=y1;
	var lon= SNPfile.length	
	var cpt = 0;
	var g = svg.append("g")
				.data([SNPfile[i]])
				.attr("id", "g"+ (v+1)+ chr[y1-1])
	g.append("rect")
				.data([1])
				.attr("x", 60)
				.attr("y", 100)
				.attr("width", function (d) {
					return (l_major_chr_length[y1-1]/500)
				})
				.attr("height", 10)
				.attr('id', 'cadre'+(v+1)+ chr[y1-1])
				.attr('fill', "#FF7F50")
				.classed('cadre', true)

	for (var i=0; i< lon; i++) {

		var number = SNPfile[i][0];
		//console.log("the number is =", number)
		current = SNPfile[i][0];
		if (current === before) {
			before = current;
			cpt++
		}else {
			before = current;
			x1=y1
			varNumber.push({
				chromosome : chr[y1-1],
				variations : cpt
			})

			qualityNumber.push({
				chromosome: chr[y1-1],
				low: cptLow,
				moderate: cptModerate,
				hight : cptHight,
				nothing: cptNothing
			})

			baseReplaced.push({
				chromosome: chr[y1-1],
				A: baseAReplaced,
				C: baseCReplaced,
				T: baseTReplaced,
				G: baseGReplaced
			})

			baseReplacing.push({
				chromosome: chr[y1-1],
				A: baseAReplacing,
				C: baseCReplacing,
				T: baseTReplacing,
				G: baseGReplacing
			})
			y1++;
			cpt=0
			cptLow =0;
			cptModerate =0; 
			cptHight =0;
			cptNothing=0;
			baseAReplacing =0,
			baseTReplacing =0,
			baseCReplacing =0,
			baseGReplacing =0;
			baseAReplaced  =0,
			baseTReplaced  =0,
			baseCReplaced  =0,
			baseGReplaced  =0;
			var g = svg.append("g")
				.data([SNPfile[i]])
				.attr("id", "g"+ (v+1)+(chr[y1-1]))

			g.append("rect")
				.data([1])
				.attr("x", 60)
				.attr("y", function (d,o) {
					return (y1 * 100);
				})
				.attr("width", function (d,o) {
					return (l_major_chr_length[y1-1]/500)
				})
				.attr("height", 10)
				.attr('id', function (d,o) {
					return 'cadre'+(v+1)+(chr[y1-1])
				})
				.attr('fill', "#FF7F50")
				.classed('cadre', true)

		}

		var regexHight=/HIGH/;
		var regexModerate=/MODERATE/;
		var regexLow =/LOW/;
		var regexModifier = /MODIFIER/
		g.append("rect")
			.data([SNPfile[i]])
			.attr("x",(60+ SNPfile[i][1]/500))
			.attr("y", (y1)*100)
			.attr("width", 0.15)
			.attr("height",10)
			.attr("fill", function (d,t) {
				var value = SNPfile[i][5]
				if (value.match(/LOW/) !== null) {
					cptLow++; 
					return "#FFEBCD"
				} else if (value.match(/MODERATE/) !== null) {
					cptModerate++
					return "#DAA520"
				} else if (value.match(/HIGH/) !== null) {
					cptHight++
					return "#A52A2A"
				} else if (value.match(/MODIFIER/) !== null) {
					cptModifier++;
					return "cyan"
				}else {
					cptNothing++
					return "#008B8B"
				}
			})
			.attr('id','chr'+(v+1)+(chr[y1-1]));

		g.append("text")
			.data([SNPfile[i]])
			.attr("x", (60+ SNPfile[i][1]/500))
			.attr("y", function (d, f) {
		
					return ((y1)*100) - 2
			})
			.text( function (d,f) {
				//WE CAN HAVE MANY REPLACERS IN THE SAME TIME IN SNPFILE[i][3], so we need to make a for loop here
				var line = SNPfile[i][3].split(',')

				if (line.length ===1) {
					if (SNPfile[i][3] ==="A") {
						baseAReplacing++
						matrice[0][0]=''
						switch (SNPfile[i][2]) {
							case "C": {
								matrice[0][2]++
								matrice[0][4]++
							}
							break;
							case "G": {
								matrice[0][3]++
								matrice[0][4]++
							}
							break;
							case "T": {
							    matrice[0][1]++
							    matrice[0][4]++
							}
							break;
						}
						return SNPfile[i][3]
					} else if (SNPfile[i][3] ==="T") {
						baseTReplacing++
						matrice[1][1]=''
						switch (SNPfile[i][2]) {
							case "C": {
								matrice[1][2]++
								matrice[1][4]++
							}
							break;
							case "G": {
								matrice[1][3]++
								matrice[1][4]++
							}
							break;
							case "A": {
							    matrice[1][0]++
							    matrice[1][4]++
							}
							break;
						}
						return SNPfile[i][3]
					} else if (SNPfile[i][3] ==="C") {
						baseCReplacing++
						matrice[2][2]=''
						switch (SNPfile[i][2]) {
							case "T": {
								matrice[2][1]++
								matrice[2][4]++
							}
							break;
							case "G": {
								matrice[2][3]++
								matrice[2][4]++
							}
							break;
							case "A": {
							    matrice[2][0]++
							    matrice[2][4]++
							}
							break;
						}
						return SNPfile[i][3]
					} else  if (SNPfile[i][3] ==="G"){
						baseGReplacing++
						matrice[3][3]=''
						switch (SNPfile[i][2]) {
							case "C": {
								matrice[3][2]++
								matrice[3][4]++
							}
							break;
							case "T": {
								matrice[3][1]++
								matrice[3][4]++
							}
							break;
							case "A":{
							    matrice[3][0]++
							    matrice[3][4]++
							}
							break;

						}
						return SNPfile[i][3]
					}	
				} else {
					//test if it contains a lot of base in each line of the table
					for (var h=0; h< line.length; h++) {
						for (var hh=0; hh < line[h].length; hh++) {
							if (line[h][hh] ==="A") {
								baseAReplacing++
								matrice[0][0]=''
								switch (SNPfile[i][2]) {
									case "C": {
										matrice[0][2]++
										matrice[0][4]++
									}
									break;
									case "G": {
										matrice[0][3]++
										matrice[0][4]++
									}
									break;
									case "T": {
									    matrice[0][1]++
									    matrice[0][4]++
									}
									break;

								}
								
							} else if (line[h][hh] ==="T") {
								baseTReplacing++
								matrice[1][1]=''
								switch (SNPfile[i][2]) {
									case "C": {
										matrice[1][2]++
										matrice[1][4]++
									}
									break;
									case "G": {
										matrice[1][3]++
										matrice[1][4]++
									}
									break;
									case "A": {
									    matrice[1][0]++
									    matrice[1][4]++
									}
									break;

								}
								
							} else if (line[h][hh] ==="C") {
								baseCReplacing++
								matrice[2][2]=''
								switch (SNPfile[i][2]) {
									case "T": {
										matrice[2][1]++
										matrice[2][4]++
									}
									break;
									case "G": {
										matrice[2][3]++
										matrice[2][4]++
									}
									break;
									case "A": {
									    matrice[2][0]++
									    matrice[2][4]++
									}
									break;

								}
								
							} else if (line[h][hh] ==="G")  {
								baseGReplacing++
								matrice[3][3]=''
								switch (SNPfile[i][2]) {
									case "C": {
										matrice[3][2]++
										matrice[3][4]++
									}
									break;
									case "T": {
										matrice[3][1]++
										matrice[3][4]++
									}
									break;
									case "A":{
									    matrice[3][0]++
									    matrice[3][4]++
									}
									break;

								}
								
							}	
							
						}

					} return line
				}
			}) //can we calculate ???
			.style("color", "black")
			.style("font-size", '0.5px')
			.classed('chr'+(v+1)+(chr[y1-1]), true)

		g.append("text")
			.data([SNPfile[i]])
			.attr("x", (60+ SNPfile[i][1]/500))
			.attr("y", function (d, f) {
					return ((y1)*100) +11
				
			})
			.text( function (d, f) {
				if (SNPfile[i][2] ==="A") {
					baseAReplaced++
					return "A"
				} else if (SNPfile[i][2] === "T") {
					baseTReplaced++
					return "T"
				} else if (SNPfile[i][2] ==="C") {
					baseCReplaced++
					return "C"
				} else if (SNPfile[i][2] ==="G") {
					baseGReplaced++
					return "G"
				}
			})
			.style("color", "red")
			.style("font-size", '0.5px')
			.style("font-weight", "bold")
			.classed('chr'+(v+1)+chr[y1-1], true)
	
	}
	varNumber.push( {
		chromosome: chr[y1-1],
		variations: cpt
	})
	qualityNumber.push( {
		chromosome: chr[y1-1],
		low: cptLow,
		moderate: cptModerate,
		hight : cptHight,
		modifier: cptModifier,
		nothing: cptNothing
	})

	baseReplaced.push({
		chromosome: chr[y1-1],
		A: baseAReplaced,
		C: baseCReplaced,
		T: baseTReplaced,
		G: baseGReplaced
	})

	baseReplacing.push({
		chromosome: chr[y1-1],
		A: baseAReplacing,
		C: baseCReplacing,
		T: baseTReplacing,
		G: baseGReplacing
	})

	//showing the information
	$('svg rect').tipsy({ 
        gravity: 'w', 
        html: true, 
        title: function() {
        	var d = this.__data__;
	        console.log(d)
	        if(( d === undefined) || d===1) {
	         	return "Chromozome " + d[0]
	        } else {
	        	if ($(".specialSnp").children().length >= 1 ) {
	        		$(".specialSnp").children().remove()
	        	} 
	        	 $(".specialSnp").append('<p class="col s3">'+ 'Quality: '+ d[4] + '<br>' + 'Descr: '+ d[5] + '</p>')
		         return "<h5>Chromozome:"+ d[0] + '</h5><br>' + "<h5>Position :"+ d[1] + '</h5><br>' + "<h5>Quality :"+ d[4] + '</h5><br>'+ "<h5>Ref :" + d[2] + "</h5><br>" + "<h5>Alt: "+ d[3] + '</h5><br>' 
		          + '</span>'; 	
	        }
        }
    });
   
    var zoom = svgPanZoom('#svgSNP'+v, {
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
  //   d3.select("g#svg-pan-zoom-controls")
  //   	.attr("transform", "translate(50 20) scale(0.75)")
  //   // $("#svg-pan-zoom-controls").attr("transform", "translate(50 20) scale(0.75)")
  //  $('#svg-pan-zoom-controls').pushpin( {
  //  		top: $('#svg-pan-zoom-controls').offset().top
		// // bottom: $('#contsnp').offset().top + $("#contsnp").outerHeight() -300
  //  })
  //   console.log(zoom)

}

function implementChartSNP (SnpData, i) {

	console.log(varNumber)
	// CHART 1 : The number of variations in each chromosome
	var chart = AmCharts.makeChart("chartdivSNP"+i, {
	    "type": "serial",
	    "theme": "light",    
	    "legend": {
	        "equalWidths": false,
	        "useGraphSettings": true,
	        "valueAlign": "left",
	        "valueWidth": 120
	    },
	    "dataProvider": varNumber ,
	    "valueAxes": [{
	        "id": "distanceAxis",
	        "axisAlpha": 0,
	        "gridAlpha": 0,
	        "position": "left",
	        "title": "Number of Variations"
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
	        "bulletColor": "green",
	        "bulletBorderThickness": 1,
	        "dashLengthField": "dashLength",
	        "legendValueText": " : [[value]] variations",
	        "title": "Number of variations",
	        "bulletText": "[[value]] variations",
	        "fillAlphas": 0,
	        "valueField": "variations",
	        "valueAxis": "distanceAxis"
	    }],
	    "chartCursor": {
	        "cursorAlpha": 0.1,
	        "cursorColor":"#000000",
	         "fullWidth":true,
	        "valueBalloonsEnabled": false,
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
	        "gridCount": 50
	    },
	    "export": {
	    	"enabled": true
	     }
	});

	//CHART 2: The base replaced number for each chromosome
	var chart2 = AmCharts.makeChart("chartBasePercentSNP"+i, {
    "type": "serial",
    "theme": "light",
    "legend": {
        "equalWidths": false,
        "useGraphSettings": true,
        "valueAlign": "left",
        "valueWidth": 120
    },
    "dataProvider": baseReplaced,
    "valueAxes": [{
        "id": "A_Axis",
        "axisAlpha": 0,
        "gridAlpha": 0,
        "position": "left",
        "title": "Base A/Base T"
    }, {
        "id": "T_Axis",
        "axisAlpha": 0,
        "gridAlpha": 0,
        "labelsEnabled": false,
        "position": "left"
    }, {
        "id": "C_Axis",
        "axisAlpha": 0,
        "gridAlpha": 0,
        // "inside": true,
        "position": "right",
        "title": "Base C/Base G"
    }, {
    	"id": "G_Axis",
        "axisAlpha": 0,
        "gridAlpha": 0,
        // "inside": true,
        "labelsEnabled": false,
        "position": "right",
        // "title": "Base G"
    }],
    "graphs": [{
    	"bullet": "round",
    	"balloonText": "[[value]] base A replaced",
        "bulletBorderAlpha": 1,
        "useLineColorForBulletBorder": true,
        "bulletColor": "#FFFFFF",
        "dashLengthField": "dashLength",
        "fillAlphas": 0,
        "legendPeriodValueText": "total: [[value.sum]] replaced",
        "legendValueText": "[[value]] replaced",
        "title": "Base A",
        "valueField": "A",
        "valueAxis": "A_Axis"
    }, {
        "balloonText": "[[value]] base T replaced",
        "bullet": "round",
        "bulletBorderAlpha": 1,
        "useLineColorForBulletBorder": true,
        "bulletColor": "#FFFFFF",
        // "bulletSizeField": "townSize", round size
        "dashLengthField": "dashLength",
        // "descriptionField": "townName", //no need for a description next to the round
        // "labelPosition": "right",
        // "labelText": "[[townName2]]",
        "legendPeriodValueText": "total: [[value.sum]] replaced",
        "legendValueText": "[[value]] replaced",
        "title": "Base T",
        "fillAlphas": 0,
        "valueField": "T",
        "valueAxis": "T_Axis"
    }, {
        "bullet": "square",
        "bulletText": "[[value]] base C replaced",
        "bulletBorderAlpha": 1,
        "bulletBorderThickness": 1,
        "dashLengthField": "dashLength",
        "legendPeriodValueText": "total: [[value.sum]] replaced",
        "legendValueText": "[[value]] replaced",
        "title": "Base C",
        "fillAlphas": 0,
        "valueField": "C",
        "valueAxis": "C_Axis"
    }, {
    	"bullet": "square",
    	"bulletText": "[[value]] base G replaced",
        "bulletBorderAlpha": 1,
        "bulletBorderThickness": 1,
        "dashLengthField": "dashLength",
        "legendPeriodValueText": "total: [[value.sum]] replaced",
        "legendValueText": "[[value]] replaced",
        "title": "Base G",
        "fillAlphas": 0,
        "valueField": "G",
        "valueAxis": "G_Axis"
    }],
    "chartCursor": {
        "categoryBalloonDateFormat": "DD",
        "cursorAlpha": 0.1,
        "cursorColor":"#000000",
         "fullWidth":true,
        "valueBalloonsEnabled": false,
        "zoomable": true
    },
    "categoryField": "chromosome",
    "categoryAxis": {
        "autoGridCount": false,
        "axisColor": "#555555",
        "gridAlpha": 0.1,
        "gridColor": "#FFFFFF",
        "gridCount": 50
    },
    "export": {
    	"enabled": true
     },
     "chartScrollbar": {}
});

	//ChART 3: the replacing bases number for each chromosome
	var chart3 = AmCharts.makeChart("chartBasePercentRepSNP"+i, {
	    "type": "serial",
	    "theme": "light",
	    "legend": {
	        "equalWidths": false,
	        "useGraphSettings": true,
	        "valueAlign": "left",
	        "valueWidth": 120
	    },
	    "dataProvider": baseReplacing,
	    "valueAxes": [{
	        "id": "A_Axis",
	        "axisAlpha": 0,
	        "gridAlpha": 0,
	        "position": "left",
	        "title": "Base A/Base T"
	    }, {
	        "id": "T_Axis",
	        "axisAlpha": 0,
	        "gridAlpha": 0,
	        "labelsEnabled": false,
	        "position": "left"
	    }, {
	        "id": "C_Axis",
	        "axisAlpha": 0,
	        "gridAlpha": 0,
	        // "inside": true,
	        "position": "right",
	        "title": "Base C/Base G"
	    }, {
	    	"id": "G_Axis",
	        "axisAlpha": 0,
	        "gridAlpha": 0,
	        // "inside": true,
	        "labelsEnabled": false,
	        "position": "right",
	        // "title": "Base G"
	    }],
	    "graphs": [{
	    	"bullet": "round",
	    	"balloonText": "[[value]] base A substituting",
	        "bulletBorderAlpha": 1,
	        "useLineColorForBulletBorder": true,
	        "bulletColor": "#FFFFFF",
	        "dashLengthField": "dashLength",
	        "fillAlphas": 0,
	        "legendPeriodValueText": "total: [[value.sum]] substitutes",
	        "legendValueText": "[[value]] substitutes",
	        "title": "Base A",
	        "valueField": "A",
	        "valueAxis": "A_Axis"
	    }, {
	        "balloonText": "[[value]] base T substituting",
	        "bullet": "round",
	        "bulletBorderAlpha": 1,
	        "useLineColorForBulletBorder": true,
	        "bulletColor": "#FFFFFF",
	        // "bulletSizeField": "townSize", round size
	        "dashLengthField": "dashLength",
	        // "descriptionField": "townName", //no need for a description next to the round
	        // "labelPosition": "right",
	        // "labelText": "[[townName2]]",
	        "legendPeriodValueText": "total: [[value.sum]] substitutes",
	        "legendValueText": "[[value]] substitutes",
	        "title": "Base T",
	        "fillAlphas": 0,
	        "valueField": "T",
	        "valueAxis": "T_Axis"
	    }, {
	        "bullet": "square",
	        "balloonText": "[[value]] base C substituting",
	        "bulletBorderAlpha": 1,
	        "bulletBorderThickness": 1,
	        "dashLengthField": "dashLength",
	        "legendPeriodValueText": "total: [[value.sum]] substitutes",
	        "legendValueText": "[[value]] substitutes",
	        "title": "Base C",
	        "fillAlphas": 0,
	        "valueField": "C",
	        "valueAxis": "C_Axis"
	    }, {
	    	"bullet": "square",
	    	"balloonText": "[[value]] base G substituting",
	        "bulletBorderAlpha": 1,
	        "bulletBorderThickness": 1,
	        "dashLengthField": "dashLength",
	        "legendPeriodValueText": "total: [[value.sum]] substitutes",
	        "legendValueText": "[[value]] substitutes",
	        "title": "Base G",
	        "fillAlphas": 0,
	        "valueField": "G",
	        "valueAxis": "G_Axis"
	    }],
	    "chartCursor": {
	        "categoryBalloonDateFormat": "DD",
	        "cursorAlpha": 0.1,
	        "cursorColor":"#000000",
	         "fullWidth":true,
	        "valueBalloonsEnabled": false,
	        "zoomable": true
	    },
	    "categoryField": "chromosome",
	    "categoryAxis": {
	        "autoGridCount": false,
	        "axisColor": "#555555",
	        "gridAlpha": 0.1,
	        "gridColor": "#FFFFFF",
	        "gridCount": 50
	    },
	    "export": {
	    	"enabled": true
	     },
	     "chartScrollbar": {}
	});

	//Chart 4 : table of matrice
	var n = matrice.length
	for (var f=0; f<n; f++) {
		var h = matrice[f].length
		for (var v=0; v<h; v++) {
			$('.'+f +''+v).text( matrice[f][v])
		}
	}

	//Chart 5: implementing the chart of substitution quality
	//checking first if the file contains thos values or not
	var totalQuality= {
		low:0,
		moderate:0,
		hight:0,
		modifier:0,
		nothing:0
	} 
	var l = qualityNumber.length
	for (var x=0; x< l; x++) {
		totalQuality.low+= qualityNumber[x].low;
		totalQuality.moderate+= qualityNumber[x].moderate;
		totalQuality.hight+= qualityNumber[x].hight;
		totalQuality.modifier += qualityNumber[x].modifier;
		totalQuality.nothing+= qualityNumber[x].nothing
	}
	console.log(totalQuality)
	if ((totalQuality.low !=0) || (totalQuality.moderate !==0) || (totalQuality.hight !==0) || (totalQuality.modifier !==0)) {
		//we construct first our object of total values of quality
		var chart5 = AmCharts.makeChart("chartQuality"+i,
		{
		    "type": "serial",
		    "theme": "light",
		    "dataProvider": [{
		        "name": "Low",
		        "total": totalQuality.low,
		        "color": "#7F8DA9"
		    }, {
		        "name": "Moderate",
		        "total": totalQuality.moderate,
		        "color": "#FEC514"
		    }, {
		        "name": "High",
		        "total": totalQuality.hight,
		        "color": "#DB4C3C"
		    }, {
		        "name": "Modifier",
		        "total": totalQuality.modifier,
		        "color": "#DAF0FD"
		    }, {
		    	"name": "Nothing",
		        "total": totalQuality.nothing,
		        "color": "cyan"
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
	        	"title": "Quality",
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

	//CHART 6: showing the quality levels of each chromosome, it's also in the if close because we dont want to show up empty values for nothing
	var chart6 = AmCharts.makeChart("chartQualityChr"+i, {
	    "type": "serial",
	    "theme": "light",
	    "legend": {
	        "equalWidths": false,
	        "useGraphSettings": true,
	        "valueAlign": "left",
	        "valueWidth": 120
	    },
	    "dataProvider": qualityNumber,
	    "valueAxes": [{
	        "id": "Low",
	        "axisAlpha": 0,
	        "gridAlpha": 0,
	        "position": "left",
	        "title": "Low quality"
	    }, {
	        "id": "Moderate",
	        "axisAlpha": 0,
	        "gridAlpha": 0,
	        "labelsEnabled": false,
	        "position": "left"
	    }, {
	        "id": "Nothing",
	        "axisAlpha": 0,
	        "gridAlpha": 0,
	        // "inside": true,
	        "position": "right",
	        "title": "No quality"
	    }, {
	    	"id": "High",
	        "axisAlpha": 0,
	        "gridAlpha": 0,
	        // "inside": true,
	        "labelsEnabled": false,
	        "position": "right",
	        // "title": "Base G"
	    }],
	    "graphs": [{
	    	"bullet": "round",
	    	"balloonText": "[[value]]",
	        "bulletBorderAlpha": 1,
	        "useLineColorForBulletBorder": true,
	        "bulletColor": "#FFFFFF",
	        "dashLengthField": "dashLength",
	        "fillAlphas": 0,
	        "legendPeriodValueText": "total: [[value.sum]] ",
	        "legendValueText": "[[value]] ",
	        "title": "Low quality",
	        "valueField": "low",
	        "valueAxis": "Low"
	    }, {
	        "balloonText": "[[value]] ",
	        "bullet": "round",
	        "bulletBorderAlpha": 1,
	        "useLineColorForBulletBorder": true,
	        "bulletColor": "#FFFFFF",
	        // "bulletSizeField": "townSize", round size
	        "dashLengthField": "dashLength",
	        // "descriptionField": "townName", //no need for a description next to the round
	        // "labelPosition": "right",
	        // "labelText": "[[townName2]]",
	        "legendPeriodValueText": "total: [[value.sum]] ",
	        "legendValueText": "[[value]] ",
	        "title": "Moderate quality",
	        "fillAlphas": 0,
	        "valueField": "moderate",
	        "valueAxis": "Moderate"
	    }, {
	        "bullet": "square",
	        "balloonText": "[[value]]",
	        "bulletBorderAlpha": 1,
	        "bulletBorderThickness": 1,
	        "dashLengthField": "dashLength",
	        "legendPeriodValueText": "total: [[value.sum]]",
	        "legendValueText": "[[value]] ",
	        "title": "No quality",
	        "fillAlphas": 0,
	        "valueField": "nothing",
	        "valueAxis": "Nothing"
	    }, {
	    	"bullet": "square",
	    	"balloonText": "[[value]]",
	        "bulletBorderAlpha": 1,
	        "bulletBorderThickness": 1,
	        "dashLengthField": "dashLength",
	        "legendPeriodValueText": "total: [[value.sum]]",
	        "legendValueText": "[[value]] ",
	        "title": "High quality",
	        "fillAlphas": 0,
	        "valueField": "hight",
	        "valueAxis": "High"
	    }],
	    "chartCursor": {
	        "categoryBalloonDateFormat": "DD",
	        "cursorAlpha": 0.1,
	        "cursorColor":"#000000",
	         "fullWidth":true,
	        "valueBalloonsEnabled": true,
	        "zoomable": true
	    },
	    "categoryField": "chromosome",
	    "categoryAxis": {
	        "autoGridCount": false,
	        "axisColor": "#555555",
	        "title": "Chromosomes",
	        "gridAlpha": 0.1,
	        "gridColor": "#FFFFFF",
	        "gridCount": 50
	    },
	    "export": {
	    	"enabled": true
	     },
	     "chartScrollbar": {}
	});

	}




}

function fillMatrice(base,index) {
}

