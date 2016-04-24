console.log("sanity check");
var l_major_chr_length = [268988, 355712, 384502, 472852, 465823, 516869, 596352, 574960, 573434, 570865, 
						  582573, 675346, 654595, 622644, 629517, 714651, 684829, 739748, 702208, 742537,
						  772972, 716602, 772565, 840950, 912845, 1091540, 1130424, 1160104, 1212663, 1403434,
						  1484328, 1604637, 1583653, 1866748, 2090474, 2682151]
$(document).ready(function() {
	pageLoad();
});

function pageLoad() {

	$(".gffInput").on('submit', function (event) {
		event.preventDefault();
		var data = new FormData(this)
		$.ajax('/GffData', {
	      type: 'POST',
	      data: data,
	      processData: false,
	      contentType: false,
	      success : function (response) {
	      	drawChromosomes(response);
	      },
	      error : function (response) {
	      	console.log(response);
	      },
	      complete : function(resultat, statut){
	      	console.log(resultat);
       	  }
	    })
	    
	})

	$(".CnvInput").on("submit", function (event) {
		event.preventDefault();
		var data = new FormData(this);
		$.ajax('/CnvData', {
			type: 'POST',
			data: data,
			processData: false,
			contentType: false,
			success: function (response) {
				drawCNV(response);
			},
			error: function (response) {

			}, 
			complete : function (resultat, statut) {

			}
		})
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
            .attr("height", 3000);

    //Drawing the lines :
    var ch = [];
    ch.length = 36;
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
    // svg.selectAll("text")
    // 	.data(gffData)
    // 	.enter()
    // 	.append("text")
    // 	.text( function (d,i ) {
    // 		var data=""
    // 		// for(i = 0; i< 21; i++) {
    // 		// 	data = data + d[4][i]
    // 		// }
    // 		// console.log("el data ", data)
    // 		// debugger;
    // 		console.log("the data 1 : ", d[4])
    // 		debugger;
    // 		return d[4];
    // 	})
    // 	.attr("id", function (d, i) {
    // 		return "cD" + i;
    // 	})
    // 	.attr("x", function (data, i) {
    // 		lmjfCurrent = data[0][data[0].length -2] + data[0][data[0].length -1];
    // 		$("#cD"+i).hide();
    // 		return (60 + data[2]/1000);
    // 	})
    // 	.attr("y" ,function (data, i) {
    // 		lmjfCurrent = data[0][data[0].length -2] + data[0][data[0].length -1];
    // 		if (lmjfCurrent === lmjfBefore) {
    // 			lmjfBefore = lmjfCurrent;
    // 			return y1 * (3000/chr) + 10
    // 		} else {
    // 			lmjfBefore = lmjfCurrent;
    // 			// console.log("they are not equal anymore !!")
    // 			y1++;
    // 			return y1 * (3000/chr) + 10;
    // 		}
    // 	})
    // 	.attr("font-family", "century")
   	// 	.attr("font-size", "5px")
    	
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
function CNV(CnvData) {
   
}