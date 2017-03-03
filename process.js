shapes = null;
obselSize = 25
var n = 15,
data = d3.range(n).map(generateInteractions);
var svg = d3.select("#image").append("svg").attr("width", 960).attr("height", 200),
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
    data.push(generateInteractions());

    // Redraw the line.
    g.remove();
    g = svg.append("g")
    drawShapes()

    //slide to the left
    g.transition()
    .attr("transform", "translate(" + x(-1) + ",0)")

    //pop hidden element from data
    data.shift()
}

function generateInteractions() {
    return {exp:Math.random() * 2 | 0, res:Math.random() * 2 | 0};
}

function drawShapes(){
    shapes = g.selectAll("shapes")
        .data(data)
        .enter().append("path")
        .attr("d",function(d,i){
            var path;
            if (d.exp == 0){
                path = drawTriangleDown(i)
            }
            else if (d.exp == 1){
                path =  drawHalfCircleUp(i)
            }
            return path;
        })
        .attr('fill', function (d) {
            if (d.res == 0) {
                return d3.rgb("#43a2ca");
            }
            else if (d.res == 1) {
                return d3.rgb("#2ca25f");
            }
        });
}

function drawSquare(i){
    s = x(i),
    r = obselSize,
    w = r*2;
    var path = "M" + s + " " + r +
               "L" + s + " " + (r+w) +
               "L" + (s+w) + " " + (r+w) +
               "L" + (s+w) + " " + r + "Z"
    return path
}

function drawTriangleUp(i){
    s = x(i),
    r = obselSize,
    w = r*2;
    var path = "M" + (s+r) + " " + r +
               "L" + s + " " + (r+w) +
               "L" + (s+w) + " " + (r+w) + "Z"
    return path
}

function drawTriangleDown(i){
    s = x(i),
    r = obselSize,
    w = r*2;
    var path = "M" + s + " " + r +
               "L" + (s+w) + " " + r +
               "L" + (s+r) + " " + (r+w) + "Z"
    return path
}

function drawCircle(i){
    s = x(i),
    r = obselSize,
    w = r*2;
    var path = "M" + (s+r) + " " + (r+r) +
               "m" + -r + ", 0 " +
               "a" + r + "," + r + " 0 1,0 " + r*2 + ",0" +
               "a" + r + "," + r + " 0 1,0 "+ -r*2 + ",0"
    return path
}

function drawHalfCircleUp(i){
    s = x(i),
    r = obselSize,
    w = r*2;
    var path = "M" + (s+r) + " " + (r+r) +
               "m" + r + ", 0 "+
               "a" + r + "," + r + " 0 1,0 "+ -r*2 + ",0"
    return path
}

function drawHalfCircleDown(i){
    s = x(i),
    r = obselSize,
    w = r*2;
    var path = "M" + (s+r) + " " + (r+r) +
               "m" + -r + ", 0 " +
               "a" + r + "," + r + " 0 1,0 " + r*2 + ",0"
    return path
}
