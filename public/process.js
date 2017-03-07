shapes = null;
nb_symboles_max = 15
obselSize = 25;
step = 54;
data = [];
iteration_numbers = [];
width = data.length*54;
svg = d3.select("#image").append("svg").attr("width",width).attr("height", 200)
var margin = {top: 20, right: 20, bottom: 20, left: 40},
// width = +svg.attr("width") - margin.left - margin.right,
// height = +svg.attr("height") - margin.top - margin.bottom,
g = svg.append("g");

var x = d3.scaleBand().rangeRound([0, step * data.length]).domain(iteration_numbers);
r = obselSize;
w = r*2;
drawShapes()

g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + 80+ ")")
    .call(d3.axisBottom(x).ticks(data.length));

socket.on('interaction', function(data) {
    console.log("enacted_interaction : " + data)
    tick(JSON.parse(data));
});

function tick(interaction) {
    // Push a new data point onto the back.
    console.log("ticks")
    data.push(interaction);
    iteration_numbers.push(data.length-1)

    // Redraw the line.
    svg.remove()
    var width = data.length*54
    svg = d3.select("#image").append("svg").attr("width",width).attr("height", 200),
    margin = {top: 20, right: 20, bottom: 20, left: 40},
    g = svg.append("g");
    var x = d3.scaleBand().rangeRound([0, step * data.length]).domain(iteration_numbers);
    r = obselSize;
    w = r*2;
    drawShapes()
    if (data.length>nb_symboles_max){
        var xm = (nb_symboles_max-1)*54;
    }
    else{
        var xm = (data.length-1)*54;
    }

    var ym = 250;
    d3.select("#label").classed('hidden', false)
        .attr('style', 'left:' + xm +
            'px; top:' + ym + 'px')
        .html(interToString(interaction["exp"], interaction["res"]));

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + 80 + ")")
        .call(d3.axisBottom(x).ticks(data.length));

     var container = document.getElementById('image');
     sideScroll(container,'right',25,100,10);

     var div = document.getElementById('meta_data');
     div.innerHTML = 'Iteration : ' + data.length-1 + " - Interaction : " + interToString(interaction["exp"], interaction["res"]);
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

function drawShapes(){
    shapes = g.selectAll("shapes")
        .data(data)
        .enter().append("path")
        .attr("d",function(d,i){
            var path;
            console.log(d)
            if (d["exp"] == 0){
                path = drawHalfCircleUp(i)
            }
            else if (d["exp"] == 1){
                path =  drawHalfCircleDown(i)
            }
            else if (d["exp"] == 2){
                path =  drawTriangleUp(i)
            }
            else if (d["exp"] == 3){
                path =  drawTriangleDown(i)
            }
            return path;
        })
        .attr('fill', function (d) {
            if (d["res"] == 0) {
                return d3.rgb("#606060");
            }
            else if (d["res"] == 1) {
                return d3.rgb("#43B9BD");
            }
        })
        .on('mousemove', function(d, i) {
            var xm = +d3.event.pageX;
            var ym = +d3.event.pageY;
            d3.select("#tt").classed('hidden', false)
                .attr('style', 'left:' + (xm + 15) +
                    'px; top:' + (ym-70) + 'px')
                .html("Iteration : " + i + "</br>Interaction : " + interToString(d["exp"], d["res"]));
        })
        .on('mouseout', function(){
            d3.select("#tt").classed('hidden', true);
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

function interToString(exp, res){
    if (exp == 0){
        s = "head left"
    }
    else if (exp == 1){
        s = "head right"
    }
    else if (exp == 2){
        s = "arm left"
    }
    else if (exp == 3){
        s = "arm right"
    }
    if (res == 1)
    {
        s = s + " (head touch)"
    }
    return s
}
