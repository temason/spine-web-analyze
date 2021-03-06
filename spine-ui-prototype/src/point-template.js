

/**
* Templates
*/


var poinsTemplateJson_side_rl = '{\
"width": 2130, "height": 1542, "projection": "SIDE", "points": [\
  {\
    "x": 863,\
    "y": 196,\
    "id": "C3.r"\
  },\
  {\
    "x": 987,\
    "y": 161,\
    "id": "C3.l"\
  },\
  {\
    "x": 883,\
    "y": 325,\
    "id": "C4.r"\
  },\
  {\
    "x": 1013,\
    "y": 300,\
    "id": "C4.l"\
  },\
  {\
    "x": 892.9895935058594,\
    "y": 445.9895820617676,\
    "id": "C5.r"\
  },\
  {\
    "x": 1045,\
    "y": 419.97916412353516,\
    "id": "C5.l"\
  },\
  {\
    "x": 904.9895935058594,\
    "y": 561.98958587646484,\
    "id": "C6.r"\
  },\
  {\
    "x": 1062,\
    "y": 540,\
    "id": "C6.l"\
  },\
  {\
    "x": 899,\
    "y": 693,\
    "id": "C7.r"\
  },\
  {\
    "x": 1055,\
    "y": 633,\
    "id": "C7.l"\
  },\
  {\
    "x": 589,\
    "y": 4336,\
    "id": "S1.r"\
  }\
]\
}';

var poinsTemplateJson_front_rl = '{\
"width": 2130, "height": 1542, "projection": "FRONT", "points": [\
  {\
    "x": 1072,\
    "y": 422,\
    "id": "C5.c"\
  },\
  {\
    "x": 962.9895935058594,\
    "y": 355.9895820617676,\
    "id": "C5.r"\
  },\
  {\
    "x": 1171,\
    "y": 345.97916412353516,\
    "id": "C5.l"\
  },\
  {\
    "x": 1074,\
    "y": 529,\
    "id": "C6.c"\
  },\
  {\
    "x": 957.9895935058594,\
    "y": 478.98958587646484,\
    "id": "C6.r"\
  },\
  {\
    "x": 1182,\
    "y": 491,\
    "id": "C6.l"\
  },\
  {\
    "x": 1064,\
    "y": 666,\
    "id": "C7.c"\
  },\
  {\
    "x": 958,\
    "y": 609,\
    "id": "C7.r"\
  },\
  {\
    "x": 1191,\
    "y": 604,\
    "id": "C7.l"\
  },\
  {\
    "x": 1076,\
    "y": 788,    \
    "id": "Th1.c"},\
  {\
    "x": 955,\
    "y": 725,\
    "id": "Th1.r"\
  },\
  {\
    "x": 1191,\
    "y": 723,\
    "id": "Th1.l"\
  },\
  {\
    "x": 1081,\
    "y": 923,\
    "id": "Th2.c"\
  },\
  {\
    "x": 972,\
    "y": 878,\
    "id": "Th2.r"\
  },\
  {\
    "x": 1186,\
    "y": 863,\
    "id": "Th2.l"\
  }\
]\
}';

// {
// \
//   x: 126, \
//   y: 964, \
//   id: "Klu.r"\
// }, \
// {
// \
//   x: 1990, \
//   y: 952, \
//   id: "Klu.l"\
// } \

document.forms['myform'].elements['myfile'].onchange = function (evt) {
  if (!window.FileReader) return; // Browser is not compatible

  var reader = new FileReader();

  reader.onload = function (evt) {
    if (evt.target.readyState != 2) return;
    if (evt.target.error) {
      alert('Error while reading file');
      return;
    }

    filecontent = evt.target.result;
    var projection = document.getElementById("projection_switch").innerHTML;
    if (projection == "FRONT") {
      poinsTemplateJson_front_rl = filecontent;
      console.log(poinsTemplateJson_front_rl)
    }
    else if (projection == "SIDE") {
      poinsTemplateJson_side_rl = filecontent;
      console.log(poinsTemplateJson_side_rl)
    }
    console.log("template changed")
    
    // document.forms['myform'].elements['text'].value = evt.target.result;
  };

  reader.readAsText(evt.target.files[0]);
};


function pointId2place(id) {
	const suffix2place = { "l":"left", "r": "right", "c":"center"};
	let place = suffix2place[id.split(".").slice(-1)]; 
	return place ? place : "other"; 
}

function pointTemplate_parse() {
	if(1) {
    var projection = document.getElementById("projection_switch").innerHTML;
    if(projection == "FRONT"){
      var pmap = JSON.parse(poinsTemplateJson_front_rl);  
    }
    else if(projection == "SIDE") {
      var pmap = JSON.parse(poinsTemplateJson_side_rl);  
    } 
		pmap.points.forEach( function(element, index) {
			element.place = pointId2place(element.id);
		});
		return pmap;
	}
	else { //TODO: Auto point generator may be needed 
		let vertebraLabels = ["C5","C6","C7","Th1","Th2","Th3","Th4","Th5","Th6","Th7"];

		let points = [
			{ 
				id: "test", 
				x: 0,
				y: 0,
				place: "center"
      }      
		];

		const minY=400;
		const maxY=1700;
		const cX=1060;
		const dX=110;
		const dY = (maxY-minY)/vertebraLabels.length;

		//right is on the left on image
		for( let i=0; i < vertebraLabels.length; i++ ) {
			points[3*i] = { "id": vertebraLabels[i]+".c", "y": minY+dY*i, "x": cX, place: "center" };
			points[3*i+1] = { "id": vertebraLabels[i]+".r", "y": minY+dY*i, "x": cX-dX, place: "right" };
			points[3*i+2] = { "id": vertebraLabels[i]+".l", "y": minY+dY*i, "x": cX+dX, place: "left" };
		}

		return { "width": 2130, "height": 1542, "points": points  }
	}
} 

function scalePointMap(pmap, width, height) {
	return pmap;
}

function makePointsFromTemplate(width, height) {
	let scaled = scalePointMap(pointTemplate_parse());
	scaled["points"].push({"id": "test", x: 0, y: 0, place: "other"});
  if(scaled["projection"] == "FRONT") {
    scaled["points"].push({
      id: "Klu.r",
      x: 126,
      y: 964,
      place: "right"
    });
    scaled["points"].push({
      id: "Klu.l",
      x: 1990,
      y: 952,
      place: "left"
    });
  }
	return scaled["points"];
}
