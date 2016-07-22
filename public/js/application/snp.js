var l_major_chr_length = [268988, 355712, 384502, 472852, 465823, 516869, 596352, 574960, 573434, 570865, 
						  582573, 675346, 654595, 622644, 629517, 714651, 684829, 739748, 702208, 742537,
						  772972, 716602, 772565, 840950, 912845, 1091540, 1130424, 1160104, 1212663, 1403434,
						  1484328, 1604637, 1583653, 1866748, 2090474, 2682151];

var color_panel = ["blue", "red", "yellow", "green", " purple lighten-5", "red accent-1", "cyan lighten-4", "grey lighten-3"];
var svgDiv='<div id="svgCnv" class="card-panel blue lighten-5 col s6" style="margin-top:50px"></div>'
var checkBoxeIsolatCNV='<input type="checkbox" id="isolat" class="checkIs" checked=""/><label id="lab" for="isolat">Isolat</label>'

$(document).ready(function() {
	pageLoadSnp();
	$.page_zoom();
});

function moveto(position, chromosome) {
	var v = $('#contsnp').children().length;
	if (position <= l_major_chr_length[chromosome-1]) {
		for (var k=0;k<v ; k++) {
			var g= d3.select('#g'+(k+1)+''+chromosome);
			$('html,body, .svggSnp').animate({
	                    scrollTop: $('#g'+(k+1)+''+chromosome).offset().top
	                }, 1000)
			// $('#g'+(k+1)+''+chromosome).get(0).scrollIntoView();
			g.transition()
			 .attr("transform", "translate("+ (60- (position/500)) +", "+ 0+")")
			 .duration(3000)
		}
	} else {
		sweetAlert("oups..","The position required doesn't exist in the chromosome "+ chromosome, "error");
	}
}

function pageLoadSnp(){

	//representing the snp
	$(document).on("submit", ".SNPInput", function (event) {
		event.preventDefault();
		var data = new FormData(this);
		if ( document.getElementById('fileinputSNP').files.length === 0) {
			sweetAlert("oups..","No file is uploaded, please upload at least one file", "error");
		} else {
			$('.svggSnp').remove();
			$.ajax('/SnpData', {
				type: 'POST',
				data: data,
				processData: false,
				contentType: false,
				success: function (response) {
					var l = response.length
					for (var k =0; k<l; k++) {
						drawSNP(response[k],k)
						$(".checkBoxSnp").append(checkBoxeIsolatCNV)
						$('#isolat').attr('id', "isolatSNP"+k);
						$("#lab").attr('id', "lab"+k);
						$("#lab"+k).text("Isolat "+ (k+1));
						$("#lab"+k).attr("for", "isolatSNP"+k)
					}
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
		moveto(position, chromosome);
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

//drawing the snps
function drawSNP(SNPfile, v) {
	var chr = CountChrNumber(SNPfile, 0);
	var random =  Math.floor((Math.random() *8))
	appendSvgDiv("contsnp", "svgSnp", v, random, "svggSnp");
	//to create the select only one time...
	if (v ===0) {
		//here we will add the multiple selection option dependeing on the chromosome number
		var select1 = document.getElementById("selChrSnp");
	    for (var j=0; j< chr; j++) {
	    	select1.options[select1.options.length] = new Option('Chromosome '+ (j+1) , (j+1));
	    }
	    $(select1).material_select();
	    $("#divSelectSnp").css("display", "block");
	}

	//displaying the positions input : 
	$("#inputSNP").css("display", "block");

	//Starting drawing the svg
	var svg = d3.select("div#svgSnp"+v)
            .append("svg")
            .attr("width", 2000)
            .attr("height", chr* 100 +100)
            .call(d3.behavior.zoom().on("zoom", function () {
        		svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
     		 }))
            .append("g")


	//Writing some labels :
	var ch = [];
    ch.length = chr;
    console.log("chr =", chr)
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
   		.attr("padding","0 12px")

   	// var ch2 =[]
    // ch2.length = chr;

    // //zoom in button
    // 	svg.selectAll('circle.in')
   	// 	.data(ch2)
   	// 	.enter()
   	// 	.append("circle")
   	// 	.attr("cx", 15)
   	// 	.attr("cy", function (d, j) {
   	// 		return (j+1)*100 + 17
   	// 	})
   	// 	.attr("r", 5)
   	// 	.attr("fill", 'grey')
   	// 	.attr("stroke", "black")
   	// 	.attr('id', function (d, t) {
   	// 		return ""+(v+1)+""+(t+1)
   	// 	})
   	// 	.classed("in", true)

   	// //zoomout	
   	// svg.selectAll('circle.out')
   	// 	.data(ch)
   	// 	.enter()
   	// 	.append("circle")
   	// 	.attr("cx", 30)
   	// 	.attr("cy", function (d, j) {
   	// 		return (j+1)*100 + 17
   	// 	})
   	// 	.attr("r", 5)
   	// 	.attr("fill", 'grey')
   	// 	.attr("stroke", "black")
   	// 	.attr("id", function (d,t) {
   	// 		return ""+(v+1)+ ""+(t+1)
   	// 	})
   	// 	.classed("out", true)

    // svg.selectAll("line.in1")
    // 	.data(ch)
    // 	.enter()
    // 	.append("line")
    // 	.attr("x1", 12.5)
    // 	.attr("y1", function (d,i) {
    // 		return (i+1)*100 + 17
    // 	})
    // 	.attr("x2", 17.5)
    // 	.attr("y2", function (d, t) {
    // 		return (t+1)*100 + 17
    // 	})
    // 	.attr("stroke", "black")
    // 	.attr("stroke-width", "1px")

    // svg.selectAll("line.in2")
    // 	.data(ch)
    // 	.enter()
    // 	.append("line")
    // 	.attr("x1", 15)
    // 	.attr("y1", function (d,i) {
    // 		return (i+1)*100 + 14.5
    // 	})
    // 	.attr("x2", 15)
    // 	.attr("y2", function (d, t) {
    // 		return (t+1)*100 + 19.5
    // 	})
    // 	.attr("stroke", "black")
    // 	.attr("stroke-width", "1px")

    // svg.selectAll("line.out")
    // 	.data(ch)
    // 	.enter()
    // 	.append("line")
    // 	.attr("x1", 27.5)
    // 	.attr("y1", function (d,i) {
    // 		return (i+1)*100 + 17
    // 	})
    // 	.attr("x2", 32.5)
    // 	.attr("y2", function (d, t) {
    // 		return (t+1)*100 + 17
    // 	})
    // 	.attr("stroke", "black")
    // 	.attr("stroke-width", "1px")
   	

   	ch = [];
    ch.length = chr;

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
	var turn = 1;
	var g = svg.append("g")
				.attr("id", "g"+ (v+1)+(y1))
	g.append("rect")
				.data([1])
				.attr("x", 60)
				.attr("y", 100)
				.attr("width", function (d) {
					return (l_major_chr_length[y1-1]/500)
				})
				.attr("height", 20)
				.attr('id', 'cadre'+(v+1)+(1))
				.attr('fill', "white")

	for (var i=0; i< lon; i++) {

		var number = SNPfile[i][0];
		//console.log("the number is =", number)
		current = SNPfile[i][0];
		if (current === before) {
			before = current;
		}else {
			before = current;
			x1=y1
			y1++;
			var g = svg.append("g")
				.attr("id", "g"+ (v+1)+(y1))

			g.append("rect")
				.data([1])
				.attr("x", 60)
				.attr("y", function (d,i) {
					return (y1 * 100);
				})
				.attr("width", function (d,i) {
					return (l_major_chr_length[y1-1]/500)
				})
				.attr("height", 20)
				.attr('id', function (d,i) {
					return 'cadre'+(v+1)+(y1)
				})
				.attr('fill', "white")

		}

		g.append("rect")
			.data([SNPfile[i]])
			.attr("x",(60+ SNPfile[i][1]/500))
			.attr("y", (y1)*100)
			.attr("width", 0.2)
			.attr("height",20)
			.attr("fill", "red")
			.attr('id','chr'+(v+1)+(y1));

		g.append("text")
			.data([SNPfile[i]])
			.attr("x", (60+ SNPfile[i][1]/500))
			.attr("y", function (d, f) {
				if (turn === 1) {
					turn =0;
					return ((y1)*100) - 3
				} else {
					turn =1
					return ((y1)*100) +26
				}
			})
			.text(SNPfile[i][3])
			.style("color", "black")
			.style("font-size", '3px')
			.classed('chr'+(v+1)+(y1), true)
	
	}
}