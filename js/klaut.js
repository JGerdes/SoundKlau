(function(){
	var buttonContainer = document.querySelector(".sc-button-group.sc-button-group-medium"),
	downloadButton = document.createElement("button");
	downloadButton.className = "sc-button sc-button-medium sc-button-responsive sc-button-download sc-button-klau";
	downloadButton.title = "Download";
	downloadButton.innerHTML = "Download";
	buttonContainer.appendChild(downloadButton);

})();