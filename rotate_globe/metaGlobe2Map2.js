var sample_data = {"Germany":{"coauthors":440,"count":"eudeu"},"China":{"coauthors":325,"count":"aschn"},"United Kingdom":{"coauthors":291,"count":"eugbr"},"France":{"coauthors":224,"count":"eufra"},"South Korea":{"coauthors":216,"count":"askor"},"Taiwan":{"coauthors":145,"count":"astwn"},"Italy":{"coauthors":139,"count":"euita"},"Japan":{"coauthors":134,"count":"asjpn"},"Canada":{"coauthors":126,"count":"nacan"},"Switzerland":{"coauthors":123,"count":"euche"},"Australia":{"coauthors":120,"count":"ocaus"},"Netherlands":{"coauthors":114,"count":"eunld"},"Chile":{"coauthors":89,"count":"aschl"},"Greece":{"coauthors":75,"count":"eugrc"},"Spain":{"coauthors":75,"count":"euesp"},"Russia":{"coauthors":74,"count":"asrus"},"Singapore":{"coauthors":73,"count":"assgp"},"Denmark":{"coauthors":70,"count":"eudnk"},"Israel":{"coauthors":62,"count":"asisr"},"Czech Republic":{"coauthors":61,"count":"eucze"},"Argentina":{"coauthors":49,"count":"saarg"},"India":{"coauthors":48,"count":"asind"},"Saudi Arabia":{"coauthors":46,"count":"assau"},"Brazil":{"coauthors":41,"count":"sabra"},"Norway":{"coauthors":38,"count":"eunor"},"Belgium":{"coauthors":32,"count":"eubel"},"Peru":{"coauthors":24,"count":"saper"},"Slovenia":{"coauthors":22,"count":"eusvn"},"New Zealand":{"coauthors":21,"count":"ocnzl"},"Sweden":{"coauthors":18,"count":"euswe"},"Turkey":{"coauthors":18,"count":"astur"},"Austria":{"coauthors":16,"count":"euaut"},"Finland":{"coauthors":15,"count":"eufin"},"Mexico":{"coauthors":12,"count":"samex"},"Thailand":{"coauthors":12,"count":"astha"},"Malaysia":{"coauthors":9,"count":"asmys"},"Bolivia":{"coauthors":7,"count":"eubol"},"Colombia":{"coauthors":7,"count":"sacol"},"Uganda":{"coauthors":6,"count":"afuga"},"Iceland":{"coauthors":5,"count":"euisl"},"Panama":{"coauthors":5,"count":"napan"},"Portugal":{"coauthors":5,"count":"euprt"},"South Africa":{"coauthors":5,"count":"afzaf"},"Costa rica":{"coauthors":4,"count":"nacri"},"Ethiopia":{"coauthors":4,"count":"afeth"},"Ireland":{"coauthors":4,"count":"euirl"},"Lithuania":{"coauthors":4,"count":"eultu"},"Qatar":{"coauthors":4,"count":"asqat"},"Venezuela":{"coauthors":4,"count":"saven"},"Iran":{"coauthors":3,"count":"asirn"},"Morocco":{"coauthors":3,"count":"afmar"},"Algeria":{"coauthors":2,"count":"afdza"},"Cote Ivoire":{"coauthors":2,"count":"afciv"},"Hungary":{"coauthors":2,"count":"euhun"},"Indonesia":{"coauthors":2,"count":"asidn"},"Kenya":{"coauthors":2,"count":"afken"},"Libya":{"coauthors":2,"count":"aflby"},"Philippines":{"coauthors":2,"count":"asphl"},"Sri lanka":{"coauthors":2,"count":"aslka"},"Surinam":{"coauthors":2,"count":"sasur"},"Uruguay":{"coauthors":2,"count":"saury"},"Cameroon ":{"coauthors":1,"count":"afcmr"},"Croatia":{"coauthors":1,"count":"euhrv"},"Guatemala":{"coauthors":1,"count":"nagtm"},"Guinea":{"coauthors":1,"count":"afgin"},"Honduras":{"coauthors":1,"count":"nahnd"},"Lebanon":{"coauthors":1,"count":"aslbn"},"Mauritania":{"coauthors":1,"count":"afmrt"},"Nepal":{"coauthors":1,"count":"asnpl"},"Nicaragua":{"coauthors":1,"count":"nanic"},"Oman":{"coauthors":1,"count":"asomn"},"Poland":{"coauthors":1,"count":"eupol"},"Serbia":{"coauthors":1,"count":"eusrb"},"Sierra Leone":{"coauthors":1,"count":"afsle"},"Ukraine":{"coauthors":1,"count":"euukr"}};

var noCoauthors = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,114,12,12,120,123,126,134,139,145,15,16,18,18,2,2,2,2,2,2,2,2,2,2,21,216,22,224,24,291,3,3,32,325,38,4,4,4,4,4,4,41,440,46,48,49,5,5,5,5,6,61,62,7,7,70,73,74,75,75,89,9];

noCoauthors.sort(function(a, b){return a-b});

var mapWidth = 960,
mapHeight = 500,
focused = false,
ortho = true, 
sens = 0.25;

var projectionGlobe = d3.geo.orthographic()
.scale(240)
.rotate([0, 0])
.translate([mapWidth / 2, mapHeight / 2])
.clipAngle(90);

var projectionMap = d3.geo.equirectangular()
.scale(145)
.translate([mapWidth / 2, mapHeight / 2])

var projection = projectionGlobe;

var path = d3.geo.path()
.projection(projection);

var svgMap = d3.select("div#map").append("svg")
.attr("overflow", "hidden")
.attr("width", mapWidth)
.attr("height", mapHeight);

var zoneTooltip = d3.select("div#map").append("div").attr("class", "zoneTooltip"),
infoLabel = d3.select("div#map").append("div").attr("class", "infoLabel");

colors = ['#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026'];

var g = svgMap.append("g");

//Get the Co-authors associated with a country

function getCoauthors(name) {
  if(sample_data[name]) { 
    return (sample_data[name]).coauthors;
  } else {
    return 0; 
  }
}

// Get fill color for country

function getFill(num, arr, colors) {
  var range = (arr[arr.length-1] / colors.length);
  if(num >= 0 && num <= range) { return colors[0]; }
  for (var i = 1 ; i < (parseInt(range) + 1) ; i++) {
    if (num >= (range * i) && num <= (range * (i + 1))) { return colors[i]; }
  }
}

// Check if element has class

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

//Rotate to default before animation

function defaultRotate() {
  d3.transition()
  .duration(1500)
  .tween("rotate", function() {
    var r = d3.interpolate(projection.rotate(), [0, 0]);
    return function(t) {
      projection.rotate(r(t));
      g.selectAll("path").attr("d", path);
    };
  })
};

//Loading data

queue()
.defer(d3.json, "world-110m.v1.json")
.defer(d3.tsv, "world-110m-country-names.tsv")
.await(ready);


function ready(error, world, countryData) {

  var countryById = {},
  countries = topojson.feature(world, world.objects.countries).features;

  //Adding countries by name

  countryData.forEach(function(d) {
    countryById[d.id] = d.name;
  });

  //Drawing countries on the globe

  var world = g.selectAll("path").data(countries);
  world.enter().append("path")
  .attr("class", "mapData")
  .attr("d", path)
  .classed("ortho", ortho = true)
  .style("stroke", "white")
  .style("fill", function(d, i) { 
    if(sample_data[countryById[d.id]]) {
      var numCoauthors = (sample_data[countryById[d.id]]).coauthors;
      return getFill(numCoauthors, noCoauthors,colors);
    } else {
      return getFill(0, noCoauthors,colors);
    }
  });

  //Drag event

  world.call(d3.behavior.drag()
    .origin(function() { var r = projection.rotate(); return {x: r[0] / sens, y: -r[1] / sens}; })
    .on("drag", function() {
      var λ = d3.event.x * sens,
      φ = -d3.event.y * sens,
      rotate = projection.rotate();
      //Restriction for rotating upside-down
      φ = φ > 30 ? 30 :
      φ < -30 ? -30 :
      φ;
      projection.rotate([λ, φ]);
      g.selectAll("path.ortho").attr("d", path);
      g.selectAll(".focused").classed("focused", focused = false);
    }))

  //Events processing

  world.on("mouseover", function(d) {
    d3.select(this).style("fill", "#66C2FF");
    if (ortho === true) {
      infoLabel.html(countryById[d.id] + "<br>" + "Co-authorships: " + getCoauthors(countryById[d.id]))
      .style("display", "inline");
    } else {
      zoneTooltip.text(countryById[d.id])
      .style("left", (d3.event.pageX + 7) + "px")
      .style("top", (d3.event.pageY - 15) + "px")
      .style("display", "block");
    }
  })
  .on("mouseout", function(d) {
    d3.select(this).style("fill", function(d,i){
      if(!hasClass(d3.select(this), "focused")) {
        if(sample_data[countryById[d.id]]) {
          var numCoauthors = (sample_data[countryById[d.id]]).coauthors;
          return getFill(numCoauthors, noCoauthors,colors);
        } else {
          return getFill(0, noCoauthors,colors);
        }
      }
    });
    if (ortho === true) {
      infoLabel.style("display", "none");
    } else {
      zoneTooltip.style("display", "none");
    }
  })
  .on("mousemove", function() {
    if (ortho === false) {
      zoneTooltip.style("left", (d3.event.pageX + 7) + "px")
      .style("top", (d3.event.pageY - 15) + "px");
    }
  })
  .on("click", function(d) {
    //console.log(d3.select(this));
    d3.select(this).style("fill", "#66C2FF");
    if (focused === d) return reset();
    g.selectAll(".focused").classed("focused", false);
    d3.select(this).classed("focused", focused = d);
    //infoLabel.text(countryById[d.id])
    infoLabel.html(countryById[d.id] + "<br>" + "Co-authorships: " + getCoauthors(countryById[d.id]))
    .style("display", "inline");

    //Transforming Globe to Map
    
    /*if (ortho === true) {
      defaultRotate();
      setTimeout(function() {
        g.selectAll(".ortho").classed("ortho", ortho = false);
        projection = projectionMap;
        path.projection(projection);
        g.selectAll("path").transition().duration(5000).attr("d", path);
      }
      , 1600);   
    }*/
  });

  //Adding extra data when focused

  function focus(d) {
    if (focused === d) return reset();
    g.selectAll(".focused").classed("focused", false);
    d3.select(this).classed("focused", focused = d);
  }

  function reset() {
    g.selectAll(".focused").classed("focused", focused = false);
    infoLabel.style("display", "none");
    zoneTooltip.style("display", "none");

    //Transforming Map to Globe
    /*
    projection = projectionGlobe;
    path.projection(projection);
    g.selectAll("path").transition().duration(5000).attr("d", path)
    g.selectAll("path").classed("ortho", ortho = true);*/
    
  }
};