
var sample_data = {"Germany":{"coauthors":440,"count":"eudeu"},"China":{"coauthors":325,"count":"aschn"},"United Kingdom":{"coauthors":291,"count":"eugbr"},"France":{"coauthors":224,"count":"eufra"},"South Korea":{"coauthors":216,"count":"askor"},"Taiwan":{"coauthors":145,"count":"astwn"},"Italy":{"coauthors":139,"count":"euita"},"Japan":{"coauthors":134,"count":"asjpn"},"Canada":{"coauthors":126,"count":"nacan"},"Switzerland":{"coauthors":123,"count":"euche"},"Australia":{"coauthors":120,"count":"ocaus"},"Netherlands":{"coauthors":114,"count":"eunld"},"Chile":{"coauthors":89,"count":"aschl"},"Greece":{"coauthors":75,"count":"eugrc"},"Spain":{"coauthors":75,"count":"euesp"},"Russia":{"coauthors":74,"count":"asrus"},"Singapore":{"coauthors":73,"count":"assgp"},"Denmark":{"coauthors":70,"count":"eudnk"},"Israel":{"coauthors":62,"count":"asisr"},"Czech Republic":{"coauthors":61,"count":"eucze"},"Argentina":{"coauthors":49,"count":"saarg"},"India":{"coauthors":48,"count":"asind"},"Saudi Arabia":{"coauthors":46,"count":"assau"},"Brazil":{"coauthors":41,"count":"sabra"},"Norway":{"coauthors":38,"count":"eunor"},"Belgium":{"coauthors":32,"count":"eubel"},"Peru":{"coauthors":24,"count":"saper"},"Slovenia":{"coauthors":22,"count":"eusvn"},"New Zealand":{"coauthors":21,"count":"ocnzl"},"Sweden":{"coauthors":18,"count":"euswe"},"Turkey":{"coauthors":18,"count":"astur"},"Austria":{"coauthors":16,"count":"euaut"},"Finland":{"coauthors":15,"count":"eufin"},"Mexico":{"coauthors":12,"count":"samex"},"Thailand":{"coauthors":12,"count":"astha"},"Malaysia":{"coauthors":9,"count":"asmys"},"Bolivia":{"coauthors":7,"count":"eubol"},"Colombia":{"coauthors":7,"count":"sacol"},"Uganda":{"coauthors":6,"count":"afuga"},"Iceland":{"coauthors":5,"count":"euisl"},"Panama":{"coauthors":5,"count":"napan"},"Portugal":{"coauthors":5,"count":"euprt"},"South Africa":{"coauthors":5,"count":"afzaf"},"Costa rica":{"coauthors":4,"count":"nacri"},"Ethiopia":{"coauthors":4,"count":"afeth"},"Ireland":{"coauthors":4,"count":"euirl"},"Lithuania":{"coauthors":4,"count":"eultu"},"Qatar":{"coauthors":4,"count":"asqat"},"Venezuela":{"coauthors":4,"count":"saven"},"Iran":{"coauthors":3,"count":"asirn"},"Morocco":{"coauthors":3,"count":"afmar"},"Algeria":{"coauthors":2,"count":"afdza"},"Cote Ivoire":{"coauthors":2,"count":"afciv"},"Hungary":{"coauthors":2,"count":"euhun"},"Indonesia":{"coauthors":2,"count":"asidn"},"Kenya":{"coauthors":2,"count":"afken"},"Libya":{"coauthors":2,"count":"aflby"},"Philippines":{"coauthors":2,"count":"asphl"},"Sri lanka":{"coauthors":2,"count":"aslka"},"Surinam":{"coauthors":2,"count":"sasur"},"Uruguay":{"coauthors":2,"count":"saury"},"Cameroon ":{"coauthors":1,"count":"afcmr"},"Croatia":{"coauthors":1,"count":"euhrv"},"Guatemala":{"coauthors":1,"count":"nagtm"},"Guinea":{"coauthors":1,"count":"afgin"},"Honduras":{"coauthors":1,"count":"nahnd"},"Lebanon":{"coauthors":1,"count":"aslbn"},"Mauritania":{"coauthors":1,"count":"afmrt"},"Nepal":{"coauthors":1,"count":"asnpl"},"Nicaragua":{"coauthors":1,"count":"nanic"},"Oman":{"coauthors":1,"count":"asomn"},"Poland":{"coauthors":1,"count":"eupol"},"Serbia":{"coauthors":1,"count":"eusrb"},"Sierra Leone":{"coauthors":1,"count":"afsle"},"Ukraine":{"coauthors":1,"count":"euukr"}};

var noCoauthors = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,114,12,12,120,123,126,134,139,145,15,16,18,18,2,2,2,2,2,2,2,2,2,2,21,216,22,224,24,291,3,3,32,325,38,4,4,4,4,4,4,41,440,46,48,49,5,5,5,5,6,61,62,7,7,70,73,74,75,75,89,9];

noCoauthors.sort(function(a, b){return a-b});

/* 
var noCoauthors = [];
for (var i=0 ; i < (Object.keys(sample_data)).length ; i++) {
  noCoauthors.push( sample_data[(Object.keys(sample_data))[i]].coauthors);
}
*/

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

$(".button").on("click",function() {
  if(minimized) {
    minimized = false;
    d3.select(this).style("fill", /*"#66C2FF"*/"#9999CC"); /* Fix later */
    d3.select("svg").remove();
    setup(width,height,false);
    $("#container").css("width", "76%")
    $("#container").css("height", "76%")
  }
});

d3.select(window).on("resize", throttle);

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 8])
    .on("zoom", move);

var width = document.getElementById('container').offsetWidth-60,
    height = width / 2;

var topo,projection,path,svg,g,centered;

var tooltip = d3.select("#container").append("div").attr("class", "tooltip hidden");

var clicked = false;

var minimized = false;

setup(width,height,false, null);

function setup(width,height,clicked,selected){
  if(!clicked) {
    projection = d3.geo.mercator()
    .translate([0, 50])
    .scale(width / 2.2 / Math.PI);

    path = d3.geo.path()
        .projection(projection);

    svg = d3.select("#container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        //.call(zoom);
  } else {
    projection = d3.geo.mercator()
    .translate([-100, -30])
    .scale(width / 4.2 / Math.PI);

    path = d3.geo.path()
      .projection(projection);

    svg = d3.select("#container").append("svg")
        .attr("width", width/1.5)
        .attr("height", height/1.5)
        .append("g")
        .attr("transform", "translate(" + width / 2.5 + "," + height / 2 + ")");
        //.call(zoom);
  } 
  d3.select("svg").style("background", "#cde7f0");
  g = svg.append("g");
  d3.json("data/world-topo.json", function(error, world) {
    var countries = topojson.feature(world, world.objects.countries).features;
    topo = countries;
    if(clicked) {
      draw(topo, true);
    } else {
      draw(topo, false);
    }
    

  });
  d3.select(selected).classed("clicked",true);
}



function getCoauthors(name) {
  if(sample_data[name]) { 
    return (sample_data[name]).coauthors;
  } else {
    return 0; 
  }
}

function draw(topo, showPanel) {

  var country = g.selectAll(".country").data(topo);

  /* var colors = ['#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58']; */

  if(showPanel) { 
    $("#panel").show(); 
    $("#button").show();
  } else {
    $("#panel").hide();
    $("#button").hide();
  }

  colors = ['#fed976','#ffcc33','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026'];

  country.enter().insert("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("id", function(d,i) { return d.properties.name; })
      .attr("title", function(d,i) { return d.properties.name; })
      .style("fill", function(d, i) { 
        if(sample_data[d.properties.name]) {
          var numCoauthors = (sample_data[d.properties.name]).coauthors;
          return getFill(numCoauthors, noCoauthors,colors);
        } else {
          return getFill(0, noCoauthors,colors);
        }
      })
      .style("stroke", "white")
      .on("click", clicked);

  //ofsets plus width/height of transform, plsu 20 px of padding, plus 20 extra for tooltip offset off mouse
  var offsetL = document.getElementById('container').offsetLeft+(width/2)+40;
  var offsetT = document.getElementById('container').offsetTop+(height/2)+20;

  //tooltips
  country
    .on("mousemove", function(d,i) {
      d3.select(this).style("fill", /*"#66C2FF"*/"#9999cc");
      var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
        tooltip
          .classed("hidden", false)
          .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
          .html(d.properties.name + "<br>" + "Co-authorships: " + getCoauthors(d.properties.name))
      })
      .on("mouseout",  function(d,i) {
        if(1) {
          d3.select(this).style("fill", function(d,i) {
            if(sample_data[d.properties.name]) {
              var numCoauthors = (sample_data[d.properties.name]).coauthors;
              return getFill(numCoauthors, noCoauthors,colors);
            } else {
              return getFill(0, noCoauthors,colors);
            }
          })
        }
        tooltip.classed("hidden", true);
      }); 

  function clicked(d) {
    if(!minimized) {
      minimized = true;
      d3.selectAll(".clicked").classed("clicked", false);
      if(d3.select(this).classed("clicked", true));
      d3.select(this).style("fill", /*"#66C2FF"*/"#9999CC"); /* Fix later */
      d3.select("svg").remove();
      setup(width,height,true, this);
      $("#container").css("width", "50%");
      $("#panel").show();
    } else {
      d3.selectAll(".clicked").classed("clicked", false);
      d3.select(this).classed("clicked", true);
    }
  }
}


function move() {

  var t = d3.event.translate;
  var s = d3.event.scale;  
  var h = height / 3;
  
  t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
  t[1] = Math.min(height / 2 * (s - 1) + h * s, Math.max(height / 2 * (1 - s) - h * s, t[1]));

  zoom.translate(t);
  g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

}

function getFill(num, arr, colors) {
  var range = (arr[arr.length-1] / colors.length);
  if(num == 0) {return "#FFEC8B"; }
  if(num >= 0 && num <= range) { return colors[0]; }
  for (var i = 1 ; i < (parseInt(range) + 1) ; i++) {
    if (num >= (range * i) && num <= (range * (i + 1))) { return colors[i]; }
  }
}


var throttleTimer;

function throttle() {
  window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function() {
      redraw();
    }, 200);
}
