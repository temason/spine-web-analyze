
/**
* Editor
*/

function download(filename, data) {
	var blob = new Blob([data], { type: 'text/csv' });
	if (window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveBlob(blob, filename);
	}
	else {
		var elem = window.document.createElement('a');
		elem.href = window.URL.createObjectURL(blob);
		elem.download = filename;
		document.body.appendChild(elem);
		elem.click();
		document.body.removeChild(elem);
	}
}


class Editor {
	constructor() {
		Editor.installLoadFileHandler();
		this.draw_svg = function (svg_code) {
			if(document.getElementById("lines") !== null) {
				document.getElementById("lines").remove();
			}
			var svg = document.createElement('DIV');
			svg.setAttribute('id', 'lines');
			svg.innerHTML = svg_code;
			console.log(svg_code);
			document.body.appendChild(svg);
			console.log("svg html");
		};
	}
	open(url) {
		this.loadImage(url);
	}
	loadImage(url) {
		this.$image().load( function() {
			console.log("Image loaded.");
			Editor.getEditor().imageLoaded();
		});
		this.$image().attr("src", url );
	}
	imageLoaded() {
		console.log("Editor::imageLoaded()");
		var buttons = document.createElement("div");
		buttons.className = "end_buttons";
		document.body.appendChild(buttons);
		var measure_button = document.createElement("button");
		measure_button.innerHTML = "measure deviation";
		measure_button.id = "measure_button";
		buttons.appendChild(measure_button);
		measure_button.addEventListener ("click", 
		function() {
			Editor_theEditor.requestSVG();
			console.log("finished svg part");
		});
		console.log("created measure_button");
		var download_button = document.createElement("button");
		download_button.innerHTML = "download measurements";
		download_button.id = "download_button";
		buttons.appendChild(download_button);
		download_button.addEventListener ("click",
		function() {
			document.getElementById('link').click();
			// // code from https://stackoverflow.com/questions/11620698/how-to-trigger-a-file-download-when-clicking-an-html-button-or-javascript/11620761
		});
		var download_template_button = document.createElement("button");
		download_template_button.innerHTML = "download template";
		download_template_button.id = "download_template_button";
		buttons.appendChild(download_template_button);
		download_template_button.addEventListener ("click",
		function() {
			var json = {
				"height": Editor_theEditor.$image().height(),
				"width": Editor_theEditor.$image().width(), // BETER NOT DO THIS but I do not want to accer the image the right way.....
				"projection": document.getElementById("projection_switch").innerHTML + "",
				"points": Editor_theEditor.marker_obj.values()
			};
			download("template---TODO_specificName.txt",JSON.stringify(json));
		});


		let points = makePointsFromTemplate();
		let marker = new Marker();
		this.marker_obj = marker;
		document.body.appendChild(marker.element);
		marker.markPoints(points);
		// HURRAY!! oject with values outputed to access from outside use: 
		// Editor_theEditor.marker_obj.values()
		// console.log(marker.pointsToJSON(points));
		this.scrollToStart();
		//TODO: We got this url from uploaded file don't need it anymore, so revoke blob 
		//In fact we may need this image file later (i.e. for saving with poins) so let's keep it at least for now
		//if( url.startsWith("blob:") ) { 
		//	window.URL.revokeObjectURL(this.src); // Revoke blob file
		//}
	}
	scrollToStart() {
		let imageWidth = this.$image().width();
		let imageHeight = this.$image().height();
		if( $(window).width() < imageWidth ) {
			this.$image().scrollLeft((imageWidth-$(window).width())/2);
		}
		if( $(window).height() < imageHeight ) {
			this.$image().scrollTop(0.06*$(window).height());
		}
	}
	$image() {
		return $("img#theimage");

	}
	static installLoadFileHandler() {
		window.URL = window.URL || window.webkitURL;

		var fileSelect = document.getElementById("fileSelect"),
		    fileElem = document.getElementById("fileElem"),
		    fileList = document.getElementById("fileList");

		fileSelect.addEventListener("click", 
			function (e) {
				if (fileElem) {
					fileElem.click();
				}
				e.preventDefault(); // prevent navigation to "#"
			}, false
		);
	}
	static handleFiles(files) {
		if (!files.length) {
			//TODO fileList.innerHTML = "<p>No files selected!</p>";
		} 
		else {
			//TODO fileList.innerHTML = "";
 			const imageURL = window.URL.createObjectURL(files[0]);
			Editor_theEditor.open(imageURL);
			document.getElementById("fileSelect").style.visibility = "hidden";
		}
	}


	static getEditor() {
		return Editor_theEditor; 
	}
	requestSVG() {
		var getJSON = function(marker_obj, successHandler, image) {
			var svg_code;
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '../../svg', true);
			xhr.setRequestHeader('Conten-type', 'application/json');
			xhr.onload = function() {
				if(this.status == 200){
					// console.log(this.responseText);
					successHandler && successHandler(xhr.responseText);
					// TODO understand how this works |^|
					// console.log(svg_code);
					// Editor_theEditor.drawSVG(svg_code);
				}
			};
			let marker_list = marker_obj.values();
			let imageWidth = image.width();
			let imageHeight = image.height();
			let json_to_send = {
				"marker_list": marker_list,
				"resolution": [imageWidth, imageHeight],
				"projection": document.getElementById("projection_switch").innerHTML
		 	};
			// json_to_send.resolution = ;
			console.log(json_to_send);
			xhr.send(JSON.stringify(json_to_send));
			console.log("end of xhr");
		};
		getJSON(this.marker_obj, this.draw_svg, this.$image());
			// this.drawSVG(svg_code)
		// this.drawSVG(xhr.responseText)
	}
	
}

var Editor_theEditor = new Editor();

