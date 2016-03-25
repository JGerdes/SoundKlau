(function(){
	const CLIENT_ID ="02gUJC0hH2ct1EGOcYXQIzRFU91c72Ea";

	function get(url, callback){
		var d = new XMLHttpRequest;
		d.addEventListener("load", function(a) {
			callback(a.target.responseText)
		});
		d.open("GET", url);
		d.send();
	}

	function downloadInBufferArray(url, callback){
		var d = new XMLHttpRequest();
		d.responseType = "arraybuffer";
		d.addEventListener("load", function(a) {
			callback(d.response);
		});
		d.open("GET", url, true);
		d.send();
	}

	function download(file, name) {
	    var link = document.createElement('a');
	    link.download = name;
	    link.href = file;
	    link.click();
	}

	function fetchSound(trackInfo, callback){
		var url = "https://api.soundcloud.com/i1/tracks/"
			+ trackInfo.id
			+ "/streams?client_id="
			+ CLIENT_ID 
			+ "&app_version=cc53575";
		get(url, function(data){
			var url = JSON.parse(data).http_mp3_128_url;
			downloadInBufferArray(url, function(blob){
				var result = {};
				result.info = trackInfo;
				result.data = blob;
				callback(result);
			});
		});

	}

	function fetchSoundFromUrl(url, callback){
		//fetch track id
		var encodedURL = encodeURI(url);
		get("https://api.soundcloud.com/resolve.json?url="
				+ encodedURL
				+ "&client_id="
				+ CLIENT_ID
			, function(data){
				var resolveData = JSON.parse(data);
				fetchSound(resolveData, callback);
		});
	}


	var buttonContainer = document.querySelector(".sc-button-group.sc-button-group-medium");
	if(buttonContainer === null){
		return;
	}
	var existingButtons = buttonContainer.childNodes;
	for(var i=0; i<existingButtons.length; i++){
		if(existingButtons[i].title === "Download"){
			return;
		}
	}

	var downloadButton = document.createElement("button");
	downloadButton.className = "sc-button sc-button-medium sc-button-responsive sc-button-download sc-button-klau";
	downloadButton.title = "Download";
	downloadButton.innerHTML = "Download";
	buttonContainer.appendChild(downloadButton);

	fetchSoundFromUrl(document.location.href, function(result){
		console.log(result.info);
		if(result.info.artwork_url !== undefined && result.info.artwork_url !== null) {
			var coverUrl = result.info.artwork_url.replace("large", "original");
			downloadInBufferArray(coverUrl, function(cover){
				result.cover = cover;
				processTagsAndDownload(result);
			});
		}else{
			processTagsAndDownload(result);
		}
		
	});


	function processTagsAndDownload(result) {
		var tags = assembleTags(result.info);
		var writer = new ID3Writer(result.data);
		writer.setFrame('TIT2', tags.title);
		writer.setFrame('TPE1', tags.artists);
		if(tags.year !== undefined) {
			writer.setFrame('TYER', tags.year);
		}
		if(tags.genres !== undefined) {
			writer.setFrame('TCON', tags.genres);
		}
		if(tags.label !== undefined) {
			writer.setFrame('TPUB', tags.label);
		}
		if(result.cover !== undefined) {
			writer.setFrame('APIC', result.cover);
		}
		writer.addTag();
		downloadButton.addEventListener('click', function(){
			var url = writer.getURL();
			download(url, tags.artists + " - " + tags.title + ".mp3");
		});
	}

	function assembleTags(info){
		var result = {};
		if(info.title.indexOf("-") !== -1){
			var splitted = info.title.split("-");
			result.artists = [splitted.shift().trim()];
			result.title = splitted.join("-").trim();

		}else{
			result.title = info.title;
			result.artists = [info.user.username];
		}

		if(info.release_year !== undefined 
			&& info.release_year !== null){
			result.year = info.release_year;
		}else{
			var domElement = document.querySelector(".fullListenHero__uploadTime.sc-type-medium > time");
			if(domElement !== undefined){
				var dateString = domElement.getAttribute("datetime"),
				date = new Date(dateString);
				result.year = date.getYear() + 1900;
			}
		}

		if(info.genre !== undefined 
			&& info.genre !== null){
			result.genres = [info.genre];
		}

		if(info.label_name !== undefined 
			&& info.label_name !== null){
			result.label = [info.label_name];
		}

		return result;

	}



	

})();