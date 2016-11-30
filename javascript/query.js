/* Get the instance data from the json file. */
queue()
	.defer(d3.json, "data/tv_person_data.json")
	.awaitAll(function(error, results){ 
		renderInterface(results);
	}); 

/* Global Variables */
var filterItems = [];
var fields = ["Name", "Nationality", "Gender", "Update_Date", "Communication_Outlets", "Focus_Topics"];

function renderInterface (results) {
	$(".query-button").click(function() {
		$(".results").remove();
		$(".result-info-text").remove();
		var data = results[0];
		var name = $("#name").val();
		var nationality = $("#nationality").val();
		var genderM = $('#gender-m').is(":checked");
		var genderF = $('#gender-f').is(":checked");
		var genderO = $('#gender-o').is(":checked");
		
		var threatYear = $("#threat-year").val();
		var focusAreas = $("#focus-area").val();
		var commOutlets = $("#comm-outlets").val();

		var isFiltered = false;
		var filteredData = data;

		if(name){

		   	for(var j=0 ; j < data.length ; j++) {
		    	if(data[j]["Name"].includes(name)) {
		    		filteredData.push(data[j]);
		    	}
		    }
		}

		if(nationality){
			isFiltered = true;
			var temp = [];
			for(var j=0 ; j < filteredData.length ; j++) {
				for(var k=0 ; k < nationality.length ; k++) {
					if(filteredData[j]["Nationality"].includes(nationality[k])) {
		    			temp.push(filteredData[j]);
		    		}
				}
		    }
		    filteredData = temp;
		}

		if(genderM && !genderF && !genderO) {
			isFiltered = true;
			var temp = [];
			for(var j=0 ; j < filteredData.length ; j++) {
				if(filteredData[j]["Gender"].includes("Male")) {
		    		temp.push(filteredData[j]);
		    	}
		    }
		    filteredData = temp;

		} else if (!genderM && genderF && !genderO) {
			isFiltered = true;
			var temp = [];
			for(var j=0 ; j < filteredData.length ; j++) {
				if(filteredData[j]["Gender"].includes("Female")) { 
		    		temp.push(filteredData[j]);
		    	}
		    }
		    filteredData = temp;
		} else if (!genderM && !genderF && genderO) {
			isFiltered = true;
			var temp = [];
			for(var j=0 ; j < filteredData.length ; j++) {
				if(filteredData[j]["Gender"].includes("Other")) {
		    		temp.push(filteredData[j]);
		    	}
		    }
		    filteredData = temp;
		}

		console.log("huh: ", filteredData);

		if(threatYear.length > 0){
			isFiltered = true;
			var temp = [];
			for(var j=0 ; j < filteredData.length ; j++) {
				for(var k=0 ; k < threatYear.length ; k++) {
					if(filteredData[j]["Update_Date"].includes(threatYear[k])) {
		    			temp.push(filteredData[j]);
		    		}
				}
		    }
		    filteredData = temp;
		}

		if(focusAreas){
			console.log("here");
			isFiltered = true;
			var temp = [];
			for(var j=0 ; j < filteredData.length ; j++) {
				for(var k=0 ; k < focusAreas.length ; k++) {
					if(filteredData[j]["Focus_Topics"].includes(focusAreas[k])) {
		    			temp.push(filteredData[j]);
		    		}
				}
		    }
		    filteredData = temp;
		}

		if(commOutlets.length > 0){
			console.log("com");
			isFiltered = true;
			var temp = [];
			for(var j=0 ; j < filteredData.length ; j++) {
				for(var k=0 ; k < commOutlets.length ; k++) {
					if(filteredData[j]["Communication_Outlets"].includes(commOutlets[k])) {
		    			temp.push(filteredData[j]);
		    		}
				}
		    }
		    filteredData = temp;
		}

		console.log("Filtered Data: ", filteredData);

		if(!isFiltered) {
			var resultsString = "<p class='result-info-text'>No results match your query.</p>";
			$(resultsString).appendTo(".result-info");
		} else {
			var resultsString = "<p class='result-info-text'>Your query found " + filteredData.length + " results.</p>";
			$(resultsString).appendTo(".result-info");
		}

		for(var j=0 ; j < filteredData.length ; j++) {
			var availableFields = [];
			for(var k=0 ; k < fields.length ; k++) {
			    if(filteredData[j][fields[k]] != "" && filteredData[j][fields[k]] != "-") { availableFields.push(fields[k]); }
			}
			var resultsString = "<p>";
			for(var k=0 ; k < availableFields.length ; k++) {
			    resultsString += (filteredData[j][availableFields[k]] + "<br>")
			}
			resultsString += "<hr></p>";
			resultsDiv = "<div style='positon:relative;' class='results'>" + resultsString + "</div>";
			$(resultsDiv).appendTo(".results-section");
		}
	});
}
  



/*
$(".article-query").addClass("hideSection");
$(".instance-query").addClass("hideSection");

$(".personQuery").on("click", function(){
	$(".person-query").removeClass("hideSection");
	$(".article-query").addClass("hideSection");
	$(".instance-query").addClass("hideSection");
});

$(".articleQuery").on("click", function(){
	$(".person-query").addClass("hideSection");
	$(".article-query").removeClass("hideSection");
	$(".instance-query").addClass("hideSection");
});

$(".instanceQuery").on("click", function(){
	$(".person-query").addClass("hideSection");
	$(".article-query").addClass("hideSection");
	$(".instance-query").removeClass("hideSection");
});
*/
