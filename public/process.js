shapes = null;
obselSize = 25;
step = 54;
counter = 0;
var n = 15,
width = n*54,
data = d3.range(n).map(generateInteractions);
svg = d3.select("#image").append("svg").attr("width",width).attr("height", 200)
var margin = {top: 20, right: 20, bottom: 20, left: 40},
// width = +svg.attr("width") - margin.left - margin.right,
// height = +svg.attr("height") - margin.top - margin.bottom,
g = svg.append("g");

test = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]
var x = d3.scaleBand().rangeRound([0, step * n]).domain(test);

r = obselSize;
w = r*2;

drawShapes()

g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + 80+ ")")
    .call(d3.axisBottom(x).ticks(n));

document.getElementById("add").onclick = tick;

socket.on('interaction', function() {
    console.log("mamma mia !")
});

function tick() {
    // Push a new data point onto the back.
    console.log("ticks")
    data.push(generateInteractions());
    n = n + 1
    test.push(n)

    // Redraw the line.
    svg.remove()
    var width = n*54
    svg = d3.select("#image").append("svg").attr("width",width).attr("height", 200),
    margin = {top: 20, right: 20, bottom: 20, left: 40},
    g = svg.append("g");
    var x = d3.scaleBand().rangeRound([0, step * n]).domain(test);
    r = obselSize;
    w = r*2;
    drawShapes()
    //slide to the left


    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + 80 + ")")
        .call(d3.axisBottom(x).ticks(n));

     var container = document.getElementById('image');
     sideScroll(container,'right',25,100,10);


}

function sideScroll(element,direction,speed,distance,step){
    scrollAmount = 0;
    var slideTimer = setInterval(function(){
        if(direction == 'left'){
            element.scrollLeft -= step;
        } else {
            element.scrollLeft += step;
        }
        scrollAmount += step;
        if(scrollAmount >= distance){
            window.clearInterval(slideTimer);
        }
    }, speed);
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
    s = 54*i;
    var path = "M" + s + " " + r +
               "L" + s + " " + (r+w) +
               "L" + (s+w) + " " + (r+w) +
               "L" + (s+w) + " " + r + "Z"
    return path
}

function drawTriangleUp(i){
    s = 54*i;
    var path = "M" + (s+r) + " " + r +
               "L" + s + " " + (r+w) +
               "L" + (s+w) + " " + (r+w) + "Z"
    return path
}

function drawTriangleDown(i){
    s = 54*i;
    var path = "M" + s + " " + r +
               "L" + (s+w) + " " + r +
               "L" + (s+r) + " " + (r+w) + "Z"
    return path
}

function drawCircle(i){
    s = 54*i;
    var path = "M" + (s+r) + " " + (r+r) +
               "m" + -r + ", 0 " +
               "a" + r + "," + r + " 0 1,0 " + r*2 + ",0" +
               "a" + r + "," + r + " 0 1,0 "+ -r*2 + ",0"
    return path
}

function drawHalfCircleUp(i){
    s = 54*i;
    var path = "M" + (s+r) + " " + (r+r) +
               "m" + r + ", 0 "+
               "a" + r + "," + r + " 0 1,0 "+ -r*2 + ",0"
    return path
}

function drawHalfCircleDown(i){
    s = 54*i;
    var path = "M" + (s+r) + " " + (r+r) +
               "m" + -r + ", 0 " +
               "a" + r + "," + r + " 0 1,0 " + r*2 + ",0"
    return path
}
