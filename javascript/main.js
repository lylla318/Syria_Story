$(document).ready(function () {
    $(window).on('load scroll', function () {
        var scrolled = $(this).scrollTop();
        $('#title').css({
            'transform': 'translate3d(0, ' + -(scrolled * 0.2) + 'px, 0)', // parallax (20% scroll rate)
            'opacity': 1 - scrolled / 400 // fade out at 400px from top
        });
        $('#hero-vid').css('transform', 'translate3d(0, ' + -(scrolled * 0.25) + 'px, 0)'); // parallax (25% scroll rate)
    });
});

/* Get the instance data from the json file. */


var attack_sites = [], attack_sites2 = [], attack_sites3 = [], total = 0;

var margin = {top: 10, left: 10, bottom: 10, right: 10},
    width = parseInt(d3.select('#map1').style('width')),
    width = width - margin.left - margin.right,
    mapRatio = .7,
    centered,
    r = 40;
    height = (width * mapRatio) + 200,
    mapRatioAdjuster = 7; // adjust map ratio here without changing map container size.
    syria_center = [38, 35]; // Syria's geographical center

//Define map projection
var projection = d3.geoMercator()
     .center(syria_center) // sets map center to Syria's center
     .translate([((width/2)-100), ((height/2)+50)])
     .scale(width * [mapRatio + mapRatioAdjuster]);

var russianAttacksColorMap = {"Aleppo": "#DD2611", "Homs": "#AC2319", "Idlib": "#93221C", "Hama": "#7B2120", "Damascus": "#621F24", "Daraa": "#491E27", "Lattakia": "#311C2B", "Deir Ezzor": "#181B2F", "Other":"#001A33"};

// when window size changes, resize the map
d3.select(window).on('resize', resize);

// create SVG element
var svg = d3.select("#map1")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var svg2 = d3.select("#map2")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var svg3 = d3.select("#map3")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

svg.append("text")
  .style("fill", "black")
  .style("font-size", "30px")
  .style("font-family", "Raleway")
  .style("font-weight","800")
  .attr("x", "170")
  .attr("y", "80")
  .attr("dy", ".35em")
  .attr("text-anchor", "middle")
  .text("Russian Attacks");

svg.append("circle")
  .attr("cx", "30")
  .attr("cy", "80")
  .attr("r", 10)
  .attr("fill", "none")
  .style("stroke","black")
  .style("stroke-width", "5px");

svg2.append("text")
  .style("fill", "black")
  .style("font-size", "30px")
  .style("font-family", "Raleway")
  .style("font-weight","800")
  .attr("x", "190")
  .attr("y", "80")
  .attr("dy", ".35em")
  .attr("text-anchor", "middle")
  .text("Chemical Attacks");

svg2.append("circle")
  .attr("cx", "30")
  .attr("cy", "80")
  .attr("r", 10)
  .attr("fill", "none")
  .style("stroke","black")
  .style("stroke-width", "5px");

svg3.append("text")
  .style("fill", "black")
  .style("font-size", "30px")
  .style("font-family", "Raleway")
  .style("font-weight","800")
  .attr("x", "190")
  .attr("y", "80")
  .attr("dy", ".35em")
  .attr("text-anchor", "middle")
  .text("Cluster Munitions");

svg3.append("circle")
  .attr("cx", "30")
  .attr("cy", "80")
  .attr("r", 10)
  .attr("fill", "none")
  .style("stroke","black")
  .style("stroke-width", "5px");

//Define path generator
var path = d3.geoPath()
    .projection(projection);

//Group SVG elements together
var features = svg.append("g");

var features2 = svg2.append("g");

var features3 = svg3.append("g");


//Load TopoJSON data
d3.json("data/syria-districts-topojson.json", function(error, syr) {

  if (error) return console.error(error);

  queue()
    .defer(d3.csv, "data/russian_attacks.csv")
    .defer(d3.csv, "data/chemical_weapons.csv")
    .defer(d3.csv, "data/cluster_munitions.csv")
    .await(function(error, russian_attacks, chemical_weapons, cluster_munitions) { 
      var data = parseAttacks(russian_attacks, chemical_weapons, cluster_munitions);
      playAttacks(data);
      //drawLineGraph();
    });

  function parseAttacks(results, chemical_weapons, cluster_munitions) {

    var attacksByDay = {};
    var chemicalAttacks = {};
    var clusterMunitions = {};

    for(var i = 0 ; i < results.length ; i++) {
      if(results[i].location_latitude != "" && results[i].location_longitude != ""){
        var longitude = parseFloat(results[i].location_longitude);
        var latitude = parseFloat(results[i].location_latitude);
        var coords = [longitude, latitude, results[i]];
        attack_sites.push(coords);
      }
    }

    for (var i = 0 ; i < attack_sites.length ; i++) {
      var date = ((attack_sites[i][2]).recording_date).split(" ");
      date = date[0];
      if(attacksByDay[date]) {
        (attacksByDay[date]).push(attack_sites[i][2]);
      } else {
        attacksByDay[date] = [attack_sites[i][2]];
      }
    }

    for(var i = 0 ; i < chemical_weapons.length ; i++) {
      if(chemical_weapons[i].location_latitude 
        && chemical_weapons[i].location_longitude
        && chemical_weapons[i].location_latitude != "" 
        && chemical_weapons[i].location_longitude != ""){
          var longitude = parseFloat(chemical_weapons[i].location_longitude);
          var latitude = parseFloat(chemical_weapons[i].location_latitude);
          var coords = [longitude, latitude, chemical_weapons[i]];
          attack_sites2.push(coords);
      }
    }

    for (var i = 0 ; i < attack_sites2.length ; i++) {
      var date = ((attack_sites2[i][2]).recording_date).split(" ");
      date = date[0];
      if(chemicalAttacks[date]) {
        (chemicalAttacks[date]).push(attack_sites2[i][2]);
      } else {
        chemicalAttacks[date] = [attack_sites2[i][2]];
      }
    }

    for(var i = 0 ; i < cluster_munitions.length ; i++) {
      if(cluster_munitions[i].location_latitude 
        && cluster_munitions[i].location_longitude 
        && cluster_munitions[i].location_latitude != "" 
        && cluster_munitions[i].location_longitude != ""){
          var longitude = parseFloat(cluster_munitions[i].location_longitude);
          var latitude = parseFloat(cluster_munitions[i].location_latitude);
          var coords = [longitude, latitude, cluster_munitions[i]];
          attack_sites3.push(coords);
      }
    }

    for (var i = 0 ; i < attack_sites3.length ; i++) {
      var date = ((attack_sites3[i][2]).recording_date).split(" ");
      date = date[0];
      if(clusterMunitions[date]) {
        (clusterMunitions[date]).push(attack_sites3[i][2]);
      } else {
        clusterMunitions[date] = [attack_sites3[i][2]];
      }
    }

    return [attacksByDay, chemicalAttacks, clusterMunitions];
  }

  function playAttacks(data) {
    var attacksByDay = data[0],
        chemicalAttacks = data[1],
        clusterMunitions = data[2];

    var subunits = topojson.feature(syr, syr.objects.SYR_adm2);

    features.selectAll("path")
      .data(topojson.feature(syr, syr.objects.SYR_adm2).features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#001A33")
      .attr("stroke", "#ddd")
      .attr("stroke-width", .3);

    features2.selectAll("path")
      .data(topojson.feature(syr, syr.objects.SYR_adm2).features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#001A33")
      .attr("stroke", "#ddd")
      .attr("stroke-width", .3);

    features3.selectAll("path")
      .data(topojson.feature(syr, syr.objects.SYR_adm2).features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#001A33")
      .attr("stroke", "#ddd")
      .attr("stroke-width", .3); 

    for(var i = 0 ; i < (Object.keys(attacksByDay)).length ; i++) {      
      var dayData = (attacksByDay[((Object.keys(attacksByDay))[i])]);
      for(var j = 0 ; j < dayData.length ; j++) { 

        var longitude = parseFloat(dayData[j].location_longitude),
            latitude = parseFloat(dayData[j].location_latitude),
            attackCoords = projection([longitude, latitude]);

        svg.append("circle")
          .attr("cx", attackCoords[0])
          .attr("cy", attackCoords[1])
          .attr("r", 7)
          .attr("fill", "orangered")
          .style("stroke-opacity","0") 
          .style("opacity", "0.2");
      } 
    }

    for(var i = 0 ; i < (Object.keys(chemicalAttacks)).length ; i++) {      
      var dayData = (chemicalAttacks[((Object.keys(chemicalAttacks))[i])]);
      for(var j = 0 ; j < dayData.length ; j++) { 

        var longitude = parseFloat(dayData[j].location_longitude),
            latitude = parseFloat(dayData[j].location_latitude),
            attackCoords = projection([longitude, latitude]);

        svg2.append("circle")
          .attr("cx", attackCoords[0])
          .attr("cy", attackCoords[1])
          .attr("r", 7)
          .attr("fill", "blue")
          .style("stroke-opacity","0") 
          .style("opacity", "0.2");
      } 
    }

    for(var i = 0 ; i < (Object.keys(clusterMunitions)).length ; i++) {      
      var dayData = (clusterMunitions[((Object.keys(clusterMunitions))[i])]);
      for(var j = 0 ; j < dayData.length ; j++) { 

        var longitude = parseFloat(dayData[j].location_longitude),
            latitude = parseFloat(dayData[j].location_latitude),
            attackCoords = projection([longitude, latitude]);

        svg3.append("circle")
          .attr("cx", attackCoords[0])
          .attr("cy", attackCoords[1])
          .attr("r", 7)
          .attr("fill", "green")
          .style("stroke-opacity","0") 
          .style("opacity", "0.2");
      } 
    }

  }
});

// Adjust map size when browser window size changes
function resize() {
    svg.selectAll("circle").remove();
    svg2.selectAll("circle").remove();
    svg3.selectAll("circle").remove();

    var features = svg.append("g");
    var features2 = svg2.append("g");
    var features3 = svg3.append("g");

    width = parseInt(d3.select('#map1').style('width'));
    width = width - margin.left - margin.right;
    height = (width * mapRatio) + 200;

    projection.translate([((width / 2)-100), ((height / 2)+50)])
      .center(syria_center)
      .scale(width * [mapRatio + mapRatioAdjuster]);

    svg.style('width', width + 'px')
      .style('height', height + 'px');

    svg.selectAll("path")
      .attr('d', path);

    svg2.style('width', width + 'px')
      .style('height', height + 'px');

    svg2.selectAll("path")
      .attr('d', path);

    svg3.style('width', width + 'px')
      .style('height', height + 'px');

    svg3.selectAll("path")
      .attr('d', path);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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


function drawLineGraph() {

  var lineGraph = d3.select("#lineGraph"),
      margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = +lineGraph.attr("width") - margin.left - margin.right,
      height = +lineGraph.attr("height") - margin.top - margin.bottom,
      g = lineGraph.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var parseTime = d3.timeParse("%d-%b-%y");

  var x = d3.scaleTime()
      .rangeRound([0, width]);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);

  var line = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });

  d3.tsv("data/attacks.csv", function(d) {
    d.date = parseTime(d.date);
    d.close = +d.close;
    return d;
  }, function(error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.close; }));

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .style("text-anchor", "end")
        .text("Price ($)");

    g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
  });

}
