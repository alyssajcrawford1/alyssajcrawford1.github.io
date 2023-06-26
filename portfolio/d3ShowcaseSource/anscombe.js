var anscombe = [
    { experiment: 1, x: 10, y: 8.04 }, 
    { experiment: 1, x:  8, y: 6.95 }, 
    { experiment: 1, x: 13, y: 7.58 }, 
    { experiment: 1, x:  9, y: 8.81 }, 
    { experiment: 1, x: 11, y: 8.33 }, 
    { experiment: 1, x: 14, y: 9.96 }, 
    { experiment: 1, x:  6, y: 7.24 }, 
    { experiment: 1, x:  4, y: 4.26 }, 
    { experiment: 1, x: 12, y: 10.84 }, 
    { experiment: 1, x:  7, y: 4.82 }, 
    { experiment: 1, x:  5, y: 5.68 }, 
    { experiment: 2, x: 10, y: 9.14 }, 
    { experiment: 2, x:  8, y: 8.14 }, 
    { experiment: 2, x: 13, y: 8.74 }, 
    { experiment: 2, x:  9, y: 8.77 }, 
    { experiment: 2, x: 11, y: 9.26 }, 
    { experiment: 2, x: 14, y: 8.1 }, 
    { experiment: 2, x:  6, y: 6.13 }, 
    { experiment: 2, x:  4, y: 3.1 }, 
    { experiment: 2, x: 12, y: 9.13 }, 
    { experiment: 2, x:  7, y: 7.26 }, 
    { experiment: 2, x:  5, y: 4.74 }, 
    { experiment: 3, x: 10, y: 7.46 }, 
    { experiment: 3, x:  8, y: 6.77 }, 
    { experiment: 3, x: 13, y: 12.74 }, 
    { experiment: 3, x:  9, y: 7.11 }, 
    { experiment: 3, x: 11, y: 7.81 }, 
    { experiment: 3, x: 14, y: 8.84 }, 
    { experiment: 3, x:  6, y: 6.08 }, 
    { experiment: 3, x:  4, y: 5.39 }, 
    { experiment: 3, x: 12, y: 8.15 }, 
    { experiment: 3, x:  7, y: 6.42 }, 
    { experiment: 3, x:  5, y: 5.73 }, 
    { experiment: 4, x:  8, y: 6.58 }, 
    { experiment: 4, x:  8, y: 5.76 }, 
    { experiment: 4, x:  8, y: 7.71 }, 
    { experiment: 4, x:  8, y: 8.84 }, 
    { experiment: 4, x:  8, y: 8.47 }, 
    { experiment: 4, x:  8, y: 7.04 }, 
    { experiment: 4, x:  8, y: 5.25 }, 
    { experiment: 4, x: 19, y: 12.5 }, 
    { experiment: 4, x:  8, y: 5.56 }, 
    { experiment: 4, x:  8, y: 7.91 }, 
    { experiment: 4, x:  8, y: 6.89 }
];

var anscombeDiv = d3.select("#anscombe");

var svg1 = anscombeDiv.append("svg");
var svg2 = anscombeDiv.append("svg");
var svg3 = anscombeDiv.append("svg");
var svg4 = anscombeDiv.append("svg");

anscombeDiv.selectAll("svg")
  .attr("width", 430)
  .attr("height", 330)
  .style("background", "linen")
  .style("margin", 10);


svg1.selectAll("circle")
  .data(anscombe.filter(function (d) {return d.experiment == 1;}))
  .enter().append("circle")
  .attr("cx", function(d) { return 20 + (20 * d.x); })
  .attr("cy", function(d) { return 330 - 20 + (-20 * d.y); });

svg2.selectAll("circle")
  .data(anscombe.filter(function (d) {return d.experiment == 2;}))
  .enter().append("circle")
  .attr("cx", function(d) { return 20 + (20 * d.x); })
  .attr("cy", function(d) { return 330 - 20 + (-20 * d.y); });

svg3.selectAll("circle")
  .data(anscombe.filter(function (d) {return d.experiment == 3;}))
  .enter().append("circle")
  .attr("cx", function(d) { return 20 + (20 * d.x); })
  .attr("cy", function(d) { return 330 - 20 + (-20 * d.y); });

svg4.selectAll("circle")
  .data(anscombe.filter(function (d) {return d.experiment == 4;}))
  .enter().append("circle")
  .attr("cx", function(d) { return 20 + (20 * d.x); })
  .attr("cy", function(d) { return 330 - 20 + (-20 * d.y); });



anscombeDiv.selectAll("circle")
  .attr("r", 3);



anscombeDiv.selectAll("svg").append("text")
  .attr("x", 215)
  .attr("y", 320)
  .text("x");

anscombeDiv.selectAll("svg").append("text")
  .attr("x", 10)
  .attr("y", 175)
  .text("y");


anscombeDiv.selectAll("svg").append("line")
  .attr("x1", 20)
  .attr("y1", 20)
  .attr("x2", 20)
  .attr("y2", 310)
  .attr("stroke", "black");

anscombeDiv.selectAll("svg").append("line")
  .attr("x1", 20)
  .attr("y1", 310)
  .attr("x2", 410)
  .attr("y2", 310)
  .attr("stroke", "black");