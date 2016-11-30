  function clicked(d) {
    console.log("in clicked");
    var x, y, k;

    var centroid = path.centroid(d);

    /*country.enter().append("circle")
      .attr("cx", centroid[0])
      .attr("cy", centroid[1])
      .attr("r", 1);*/

    if (d && centered !== d) {
      var centroid = path.centroid(d);
      x = centroid[0];
      y = centroid[1];
      k = 3;
      centered = d;
    } else {
      x = width / 2;
      y = height / 2;
      k = 1;
      centered = null;
    }

    country.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

    /*country.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + (-x-120) + "," + (-y-60) + ")")
      .style("stroke-width", 1.5 / k + "px");*/
  }