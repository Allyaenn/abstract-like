shapes = null //utile ?
counter = 1
var squareSize = 50,
n = 15,
data = d3.range(n).map(rand);
var svg = d3.select("svg"),
margin = {top: 20, right: 20, bottom: 20, left: 40},
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom,
g = svg.append("g");
var x = d3.scaleLinear()
          .domain([0, n - 1])
          .range([0, width]);
var y = d3.scaleLinear()
          .domain([-1, 1])
          .range([height, 0]);
drawShapes()
document.getElementById("add").onclick = tick;

function tick() {
  // Push a new data point onto the back.
  console.log("ticks")
  data.push(rand());

  // Redraw the line.
  g.remove();
  g = svg.append("g")
  drawShapes()

  g.transition()
  .attr("transform", "translate(" + x(-1) + ",0)")

  data.shift()
}

function rand() {
  return Math.random() * 2 | 0
}

// function drawShapes(){
//   shapes = g.selectAll('shapes')
//               .data(data)
//               .enter().append('rect')
//                       .attr('width', squareSize - 1)
//                       .attr('height', squareSize - 1)
//                       .attr('x', function(d, i) { return x(i); })
//                       .attr('y', function(d, i) { return 0; })
//                       .attr('fill', function (d) {
//                           if (d == 0) {
//                             return d3.rgb("red");
//                           }
//                           else if (d == 1) {
//                             return d3.rgb("green");
//                           }
//                           else if (d == 2){
//                             return d3.rgb("blue");
//                           }
//                           else {
//                             return d3.rgb("orange");
//                           }
//                       })
// }

function drawShapes(){
  shapes = g.selectAll("shapes")
                    .data(data)
                    .enter().append("path")
                    .attr("d",function(d,i){
                                var path,
                                    s = i*50,
                                    r = 10,
                                    w = r*2;
                                if (data[i] == 0){
                                 path =  "M" + s + " " + s + " L" + s + " " + (s+w) +
                                     " L" + (s+w) + " " + (s+w) + " L" + (s+w) + " " + s + "Z"
                                }
                                else if (data[i] == 1){
                                 path =  "M" + s + " " + s + " m" + -r + ", 0 " +
                                     " a " + r + "," + r + " 0 1,0 " + r*2 + ",0" +
                                     " a " + r + "," + r + " 0 1,0 "+ -r*2 + ",0"
                                }
                                return path;
                            })
                      .attr('fill', function (d) {
                          if (d == 0) {
                            return d3.rgb("#43a2ca");
                          }
                          else if (d == 1) {
                            return d3.rgb("#2ca25f");
                          }
                      })
}
