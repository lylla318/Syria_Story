/* Get the instance data from the json file. */
queue()
	.defer(d3.csv, "data/russian_attacks.csv")
	.awaitAll(function(error, results){ 
		var data = results[0];
    parseData(data);
3	}); 

/* Parse the data into a dictionary with cities as keys. */
function parseData (results) {
  var attacksByCity = {};
  for(var i = 0 ; i < results.length ; i++) {
    var location = (results[i]).location;
    var arr = location.split(' ', 1);
    location = (arr[0]).trim();
    if(attacksByCity[location]) {
      (attacksByCity[location]).push(results[i]);
    } else {
      if(location!="") attacksByCity[location] = [results[i]];
    }
  }
  //drawCircles(attacksByCity);
  drawGrid(results);
}

function drawGrid(data) {
  var ctr = 0;
  for(var i = 0 ; i < data.length ; i++) {    
    $(".video-data").append("<img src='https://img.youtube.com/vi/" + (data[i]).youtube_id + "/mqdefault.jpg' class='col-md-2 vid' height='145' alt='thumbnail'/></a>");
  }
}



/* Helper functions. */
function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

truncateDecimals = function (number, digits) {
    var multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
};






