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


var attack_sites = [], total = 0;

var margin = {top: 10, left: 10, bottom: 10, right: 10},
    width = parseInt(d3.select('#viz').style('width')),
    width = width - margin.left - margin.right,
    mapRatio = .7,
    centered,
    r = 40;
    height = width * mapRatio,
    mapRatioAdjuster = 5; // adjust map ratio here without changing map container size.
    syria_center = [38, 35]; // Syria's geographical center

//Define map projection
var projection = d3.geoMercator()
     .center(syria_center) // sets map center to Syria's center
     .translate([width/2, height/2])
     .scale(width * [mapRatio + mapRatioAdjuster]);

var russianAttacksColorMap = {"Aleppo": "#DD2611", "Homs": "#AC2319", "Idlib": "#93221C", "Hama": "#7B2120", "Damascus": "#621F24", "Daraa": "#491E27", "Lattakia": "#311C2B", "Deir Ezzor": "#181B2F", "Other":"#001A33"};

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
}

// when window size changes, resize the map
d3.select(window).on('resize', resize);

// create SVG element
var svg = d3.select("#viz")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

var svg2 = d3.select("#viz2")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

//Define path generator
var path = d3.geoPath()
    .projection(projection);

//Group SVG elements together
var features = svg.append("g");

var features2 = svg2.append("g");


//Load TopoJSON data
d3.json("data/syria-districts-topojson.json", function(error, syr) {

  if (error) return console.error(error);

  queue()
    .defer(d3.csv, "data/russian_attacks.csv")
    .awaitAll(function(error, results) { 
      var attacksByDay = parseAttacks(results);
      playAttacks(attacksByDay);
      //drawLineGraph();
    });

  function parseAttacks(results) {

    var attacksByDay = {};

    for(var i = 0 ; i < results.length ; i++) {
      for(var j = 0 ; j < results[i].length ; j++) {
        if(results[i][j].location_latitude != "" && results[i][j].location_longitude != ""){
          var longitude = parseFloat(results[i][j].location_longitude);
          var latitude = parseFloat(results[i][j].location_latitude);
          var coords = [longitude, latitude, results[i][j]];
          attack_sites.push(coords);
        }
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

    return attacksByDay;
  }

  function playAttacks(attacksByDay) {
    var subunits = topojson.feature(syr, syr.objects.SYR_adm2);

    // Bind data and create one path per TopoJSON feature
    features.selectAll("path")
      .data(topojson.feature(syr, syr.objects.SYR_adm2).features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#e8d8c3")
      .attr("stroke", "#404040")
      .attr("stroke-width", .3);

    // Bind data and create one path per TopoJSON feature
    features2.selectAll("path")
      .data(topojson.feature(syr, syr.objects.SYR_adm2).features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#001A33")
      .attr("stroke", "#ddd")
      .attr("stroke-width", .3);

    var time1 = 1, attackDay = 0;
    var interval1 = setInterval(function() { 
      if (time1 <= (Object.keys(attacksByDay)).length) { 
        var date = (Object.keys(attacksByDay))[attackDay];
        $(".date").empty();
        $(".date").append(date);
        var dayData = (attacksByDay[((Object.keys(attacksByDay))[attackDay])]);
        var time2 = 0, k = 0;
        var interval2 = setInterval(function(){
          if (time2 <= dayData.length-1) {

            var loc = ((((dayData[time2]).location).split(" "))[0]).toLowerCase();
            var amt = parseInt(($("#"+loc)).text());
            amt++;
            total ++;
            $("#"+loc).empty();
            $("#"+loc).append(amt);
            $("#total").empty();
            $("#total").append(total);   

            var longitude = parseFloat(dayData[k].location_longitude),
                latitude = parseFloat(dayData[k].location_latitude),
                attackCoords = projection([longitude, latitude]);
    
              /*svg.append("circle")
                .data([(Object.keys(attacksByDay))[attackDay]])
                .attr("class","circ"+attackDay)
                .attr("cx", attackCoords[0])
                .attr("cy", attackCoords[1])
                .attr("r", 0)
                .attr("fill", "none")
                .style("stroke-width", 5 / (1))
                .style("stroke","#cc0000") 
                .transition()
                  .delay(Math.pow(1, 2.5) * 10)
                  .duration(300)
                  .on("start", function(){
                    d3.active(this)
                      .attr("r", r)
                    .transition()
                      .on("start", function(){
                        d3.select(this).remove();
                      })
                  });*/

            svg2.append("circle")
                .data([(Object.keys(attacksByDay))[attackDay]])
                .attr("class","circ"+attackDay)
                .attr("cx", attackCoords[0])
                .attr("cy", attackCoords[1])
                .attr("r", 5)
                .attr("fill", "orangered")
                .style("stroke-opacity","0") 
                .style("opacity", "0.3");
                  

            k++;
            time2++;
          } else {
            clearInterval(interval2);
          }
        }, 500/dayData.length);
        attackDay++;
        time1++;
      }
      else { 
         clearInterval(interval1);
      }
    }, 500);
  }
});

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
