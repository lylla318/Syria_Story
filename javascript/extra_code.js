

/* For converting to csv:

var keys = Object.keys(attacksByDay), data = [];

Want to do for each city
for (var i = 0 ; i < keys.length ; i++) {
data.push( [ keys[i], (attacksByDay[keys[i]]).length] );
}

var csvContent = "data:text/csv;charset=utf-8,";
data.forEach(function(infoArray, index){

 dataString = infoArray.join(",");
 csvContent += index < data.length ? dataString+ "\n" : dataString;

}); 

var encodedUri = encodeURI(csvContent);
window.open(encodedUri);

console.log(attackInfo);*/



function drawGrid(data) {
  var ctr = 0;
  for(var i = 0 ; i < data.length ; i++) {
    $(".video-data").append("<img src='https://img.youtube.com/vi/" + (data[i]).youtube_id + "/mqdefault.jpg' class='col-md-2 vid' height='160' alt='thumbnail'/></a>");
    if(ctr == 0) {
      $(".video-data").append("<img src='https://img.youtube.com/vi/" + (data[i]).youtube_id + "/maxresdefault.jpg' class='col-md-2 offset-md-1 vid' height='160' alt='thumbnail'/></a>");
      ctr++;
    } else if (ctr == 4) {
      $(".video-data").append("<img src='https://img.youtube.com/vi/" + (data[i]).youtube_id + "/maxresdefault.jpg' class='col-md-2 vid' height='160' alt='thumbnail'/></a>");
      ctr = 0;
    } else {
        $(".video-data").append("<img src='https://img.youtube.com/vi/" + (data[i]).youtube_id + "/maxresdefault.jpg' class='col-md-2 vid' height='160' alt='thumbnail'/></a><div class='col-md-1'></div>");
      ctr++;
    }
  }

  $(".video-data").append("<img src='https://img.youtube.com/vi/3uQhkCIseU8/maxresdefault.jpg' class='col-md-2 offset-md-1 vid' height='160' alt='thumbnail'/></a>");
  $(".video-data").append("<img src='https://img.youtube.com/vi/3uQhkCIseU8/maxresdefault.jpg' class='col-md-2 vid' height='160' alt='thumbnail'/></a>");
  $(".video-data").append("<img src='https://img.youtube.com/vi/3uQhkCIseU8/maxresdefault.jpg' class='col-md-2 vid' height='160' alt='thumbnail'/></a>");
  $(".video-data").append("<img src='https://img.youtube.com/vi/3uQhkCIseU8/maxresdefault.jpg' class='col-md-2 vid' height='160' alt='thumbnail'/></a>");
  $(".video-data").append("<img src='https://img.youtube.com/vi/3uQhkCIseU8/maxresdefault.jpg' class='col-md-2 vid' height='160' alt='thumbnail'/></a><div class='col-md-1'></div>");
}





function drawCircles(attacksByCity) {
  for(var i=0 ; i < (Object.keys(attacksByCity)).length ; i++) {
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom,
    city = (Object.keys(attacksByCity))[i],
    data = attacksByCity[city];

    var svg = d3.select("#city_" + (i+1)).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    for(var j=data.length ; j >= 0 ; j--) {
      svg.append("circle")
        .attr("class","attack")
        .attr("cx", width/2)
        .attr("cy", height/2)
        .attr("r", function() { if(j==0) { return 2; } else { return (j)+2; } })
        .style("fill",function(){ if(j==0){ return "black"; } else if (j%2 == 0) { return "black" } else { return"#ddd";} })
        .style("stroke-width","0");

    }
  }
}





///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

    var time = 1, attackDay = 0;

    var interval = setInterval(function() { 
      if (time <= (Object.keys(attacksByDay)).length) { 
          var attackCoords = projection([ attack_sites[attackNum][0], attack_sites[attackNum][1] ]);
          time++;
          for (var i = 0; i < 2; ++i) {

            var circle = svg.append("circle")
              .attr("class",".circ"+attackNum)
              .data([attack_sites[attackNum][2]])
              .attr("cx", attackCoords[0])
              .attr("cy", attackCoords[1])
              .attr("r", 0)
              .style("stroke-width", 5 / (i))
              .transition()
                  .delay(Math.pow(i, 2.5) * 50)
                  .duration(100)
                  .ease('quad-in')
              .attr("r", r)
              .style("stroke-opacity", 0)
              .each("end", function () {
                  d3.select(".circ"+attackNum).remove();
              });
            
          }
          
          attackNum++;
      }
      else { 
         clearInterval(interval);
      }
    }, 1000);
  }

});









///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

/* Get the instance data from the json file. */

var attack_sites = [];

var margin = {top: 10, left: 10, bottom: 10, right: 10},
    width = parseInt(d3.select('#viz').style('width')),
    width = width - margin.left - margin.right,
    mapRatio = .7,
    centered,
    height = width * mapRatio,
    mapRatioAdjuster = 5; // adjust map ratio here without changing map container size.
    syria_center = [38, 35]; // Syria's geographical center

//Define map projection
var projection = d3.geo.mercator()
     .center(syria_center) // sets map center to Syria's center
     .translate([width/2, height/2])
     .scale(width * [mapRatio + mapRatioAdjuster]);

// adjust map size when browser window size changes
function resize() {
    svg.selectAll("circle").remove();

    var features = svg.append("g");

    width = parseInt(d3.select('#viz').style('width'));
    width = width - margin.left - margin.right;
    height = width * mapRatio;

    // update projection
    projection.translate([width / 2, height / 2])
      .center(syria_center)
      .scale(width * [mapRatio + mapRatioAdjuster]);

    // resize map container
    svg.style('width', width + 'px')
      .style('height', height + 'px');

    // resize map
    svg.selectAll("path")
      .attr('d', path);

    /*for (var i = 0 ; i < attack_sites.length ; i++) {
        var attackCoords = projection([ attack_sites[i][0], attack_sites[i][1] ]);
        features.append("circle")
          .data([attack_sites[i][2]])
          .attr("cx", attackCoords[0])
          .attr("cy", attackCoords[1])
          .attr("r", 1)
          .attr("id","circ")
          .on("click", showAttackData);
    }

    function showAttackData(d) {
      d3.select("#attack-info")
          .style("top", (d3.event.pageY) + 20 + "px")
          .style("left", (d3.event.pageX) + 20 + "px")
          .select('#location')
          .text(d.location);

      d3.select('#coords').text(d.location_latitude + "N, " +d.location_longitude + "E"); 

      d3.select('#date').text(d.recording_date);

      d3.select('#description').text(d.description_en);

      d3.select("#attack-info").classed("hidden", false);
    }*/
}

// when window size changes, resize the map
d3.select(window).on('resize', resize);

// create SVG element
var svg = d3.select("#viz")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

//Define path generator
var path = d3.geo.path()
    .projection(projection);

//Group SVG elements together
var features = svg.append("g");


//Load TopoJSON data
d3.json("syria-districts-topojson.json", function(error, syr) {

  if (error) return console.error(error);

  queue()
    .defer(d3.csv, "russian_attacks.csv")
    .awaitAll(function(error, results){ 

      /*for(var i=0 ; i<results.length ; i++) {
        for(var j=0 ; j<results[i].length ; j++) {
          if(results[i][j].location_latitude != "" && results[i][j].location_longitude != ""){
            var longitude = parseFloat(results[i][j].location_longitude);
            var latitude = parseFloat(results[i][j].location_latitude);
            var coords = [longitude, latitude, results[i][j]];
            attack_sites.push(coords);
          }
        }
      }*/
    
      var subunits = topojson.feature(syr, syr.objects.SYR_adm2);

      // Bind data and create one path per TopoJSON feature
      features.selectAll("path")
        .data(topojson.feature(syr, syr.objects.SYR_adm2).features)
        .enter()
        .append("path")
        .attr("d", path)
        .on("click", clicked)

        // Sets colors of fill and stroke for each district. Sets stroke width, too.
        .attr("fill", "#e8d8c3")
        .attr("stroke", "#404040")
        .attr("stroke-width", .3)

        // Update tooltip and info boxes when user hovers over a district on map
        .on("mousemove", function(d) {
          d3.select("#tooltip")
            .style("top", (d3.event.pageY) + 20 + "px")
            .style("left", (d3.event.pageX) + 20 + "px")
            .select('#governorate')
            .text(d.properties.NAME_1);

          d3.select("#tooltip").select("#district").text(d.properties.NAME_2);       

          d3.select('#governorate-name').text(d.properties.NAME_1); 

          d3.select('#district-name').text(d.properties.NAME_2);

          d3.select("#tooltip").classed("hidden", false);
        })
      
        // Hide tooltip when user stops hovering over map
        .on("mouseout", function() {
          d3.select("#tooltip").classed("hidden", true);
          d3.select("#attack-info").classed("hidden", true);
        });  

      for (var i = 0 ; i < attack_sites.length ; i++) {
        var attackCoords = projection([ attack_sites[i][0], attack_sites[i][1] ]);
        features.append("circle")
          .data([attack_sites[i][2]])
          .attr("cx", attackCoords[0])
          .attr("cy", attackCoords[1])
          .attr("r", 1)
          .attr("id","circ");
          //.on("click", showAttackData);
      }

      function clicked(d) {
        
        var x, y, k;

        svg.selectAll("circle").remove();

        if (d && centered !== d) {
          var centroid = path.centroid(d);
          x = centroid[0];
          y = centroid[1];
          k = 4;
          centered = d;
        } else {
          x = width / 2;
          y = height / 2;
          k = 1;
          centered = null;
        }

        features.selectAll("path")
          .classed("active", centered && function(d) { return d === centered; });

        features.transition()
          .duration(750)
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
          .style("stroke-width", 1.5 / k + "px");

        /*for (var i = 0 ; i < attack_sites.length ; i++) {
          var attackCoords = projection([ attack_sites[i][0], attack_sites[i][1] ]);
          features.append("circle")
            .data([attack_sites[i][2]])
            .attr("cx", attackCoords[0])
            .attr("cy", attackCoords[1])
            .attr("r", 1)
            .attr("id","circ")
            .on("mousemove", showAttackData)
            .on("mouseout", hideAttackData);
        }*/
      }

      function showAttackData(d) {
        d3.select(this).attr({
          fill: "orange",
          r: 2
        });

        d3.select("#attack-info")
            .style("top", (d3.event.pageY) + 20 + "px")
            .style("left", (d3.event.pageX) + 20 + "px")
            .select('#location')
            .text(d.location);

        d3.select('#coords').text(d.location_latitude + "N, " +d.location_longitude + "E"); 

        d3.select('#date').text(d.recording_date);

        d3.select('#description').text(d.description_en);

        d3.select("#attack-info").classed("hidden", false);
      }

      function hideAttackData(d, i) {
        d3.select(this).attr({
          fill: "black",
          r: 1
        });
        d3.select("#tooltip").classed("hidden", true);
        d3.select("#attack-info").classed("hidden", true);
      }

    }); 

});


/* Get the instance data from the json file. 
queue()
  .defer(d3.csv, "data/russian_attacks.csv")
  .awaitAll(function(error, results){ 
    var data = results[0];
    //drawTimeline();
    showAttacks(data);
3 }); 


function showAttacks(data) {
  var margin = {top: 20, right: 20, bottom: 30, left: 80},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

  var svg = d3.select(".timeline").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");
}
*/
/* 

var time = 1;

var interval = setInterval(function() { 
   if (time <= 3) { 
      alert(time);
      time++;
   }
   else { 
      clearInterval(interval);
   }
}, 5000);






function drawTimeline() {
  var margin = {top: 20, right: 20, bottom: 30, left: 80},
    width = 800 - margin.left - margin.right,
    height = 2000 - margin.top - margin.bottom;


  var y = d3.scaleLinear()
            .range([height, 0]);

  var svg = d3.select(".timeline").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  d3.csv("data/russian_attacks.csv", function(error, data) {
    if (error) throw error;

    var y = d3.scaleTime()
      .domain([new Date(2015, 0, 1), new Date(2017, 0, 2)])
      .range([0, height]);

    // add the y Axis
    svg.append("g")
      .call(d3.axisLeft(y)
      .ticks(20));
  });

} 

// Parse the data into a dictionary with cities as keys. 
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
} */




