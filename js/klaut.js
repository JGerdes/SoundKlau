(function(){
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

})();