shapes = null;
nb_symboles_max = 15
obselSize = 25;
horizontal_gap = 54;
vertical_gap = 64;
data = [];
iteration_numbers = [];
preInteraction = [];
postInteraction = [];
weights = [];
width = data.length*horizontal_gap;
interactions = d3.select("#sequence_image").append("svg").attr("width",width).attr("height", 200);
memory = d3.select("#memory_image").append("svg");

socket.on('interaction', function(data) {
    tick(JSON.parse(data));
});

socket.on('log', function(data) {
    var div = document.getElementById('logger');
    div.innerHTML = div.innerHTML + data + '</br>';
});

socket.on('memory', function(data) {
    mem = JSON.parse(data);
    preInteraction = [];
    postInteraction = [];
    weights = [];
    for (var i = 0; i<mem.length; i++){
        preInteraction.push(mem[i].preInteraction);
        postInteraction.push(mem[i].postInteraction);
        weights.push(mem[i].weight);
    }

    //drawing of the memory
    memory.remove();
    memory = d3.select("#memory_image").append("svg").attr("width",400).attr("height", mem.length*vertical_gap);

    //drawing preInteractions :
    preInt = memory.selectAll("preInt")
        .data(preInteraction)
        .enter().append("path")
        .attr("d",function(d,i){
            var path;
            //console.log(d)
            if (d["exp"] == 0){
                path = drawHalfCircleUp(0, i*vertical_gap)
            }
            else if (d["exp"] == 1){
                path =  drawHalfCircleDown(0, i*vertical_gap)
            }
            else if (d["exp"] == 2){
                path =  drawTriangleUp(0, i*vertical_gap)
            }
            else if (d["exp"] == 3){
                path =  drawTriangleDown(0, i*vertical_gap)
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

    //drawing postInteractions :
    postInt = memory.selectAll("postInt")
        .data(postInteraction)
        .enter().append("path")
        .attr("d",function(d,i){
            var path;
            //console.log(d)
            if (d["exp"] == 0){
                path = drawHalfCircleUp(horizontal_gap, i*vertical_gap)
            }
            else if (d["exp"] == 1){
                path =  drawHalfCircleDown(horizontal_gap, i*vertical_gap)
            }
            else if (d["exp"] == 2){
                path =  drawTriangleUp(horizontal_gap, i*vertical_gap)
            }
            else if (d["exp"] == 3){
                path =  drawTriangleDown(horizontal_gap, i*vertical_gap)
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

    //Adding proclivities
    var proclivities = memory.selectAll("proclivities")
                             .data(weights)
                             .enter()
                             .append("text")
                             .attr("x", function(d) { return (2*horizontal_gap)+obselSize; })
                             .attr("y", function(d,i) { return ((i+1)*vertical_gap)-obselSize; })
                             .text( function (d,i) {
                                 console.log(postInteraction[i].val)
                                 return d * postInteraction[i].val; })
                             .attr("font-family", "sans-serif")
                             .attr("font-size", "24px")
                             .attr("fill", "black");
});

function tick(interaction) {
    // Push a new data point onto the back.
    data.push(interaction);
    iteration_numbers.push(data.length-1)

    // Redraw the line.
    interactions.remove()
    var width = data.length*54
    interactions = d3.select("#sequence_image").append("svg").attr("width",width).attr("height", 200),
    g = interactions.append("g");
    var x = d3.scaleBand().rangeRound([0, horizontal_gap * data.length]).domain(iteration_numbers);
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

     var container = document.getElementById('sequence_image');
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

function drawShapes(){
    shapes = g.selectAll("shapes")
        .data(data)
        .enter().append("path")
        .attr("d",function(d,i){
            var path;
            //console.log(d)
            if (d["exp"] == 0){
                path = drawHalfCircleUp(i*horizontal_gap, obselSize)
            }
            else if (d["exp"] == 1){
                path =  drawHalfCircleDown(i*horizontal_gap, obselSize)
            }
            else if (d["exp"] == 2){
                path =  drawTriangleUp(i*horizontal_gap, obselSize)
            }
            else if (d["exp"] == 3){
                path =  drawTriangleDown(i*horizontal_gap, obselSize)
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

function drawSquare(x,y){
    var path = "M" + x + " " + y +
               "L" + x + " " + (y+(y*2)) +
               "L" + (x+(y*2)) + " " + (y+(y*2)) +
               "L" + (x+(y*2)) + " " + y + "Z"
    return path
}

function drawTriangleUp(x,y){
    var path = "M" + (x+obselSize) + " " + y +
               "L" + x + " " + (y+(obselSize*2)) +
               "L" + (x+(obselSize*2)) + " " + (y+(obselSize*2)) + "Z"
    return path
}

function drawTriangleDown(x,y){
    var path = "M" + x + " " + y +
               "L" + (x+(obselSize*2)) + " " + y +
               "L" + (x+obselSize) + " " + (y+(obselSize*2)) + "Z"
    return path
}

function drawCircle(x,y){
    var path = "M" + (x+y) + " " + (y+y) +
               "m" + -y + ", 0 " +
               "a" + y + "," + y + " 0 1,0 " + y*2 + ",0" +
               "a" + y + "," + y + " 0 1,0 "+ -y*2 + ",0"
    return path
}

function drawHalfCircleUp(x,y){
    var path = "M" + (x+obselSize) + " " + (y+obselSize) +
               "m" + obselSize + ", 0 "+
               "a" + obselSize + "," + obselSize + " 0 1,0 "+ -obselSize*2 + ",0"
    return path
}

function drawHalfCircleDown(x,y){
    var path = "M" + (x+obselSize) + " " + (y+obselSize) +
               "m" + -obselSize + ", 0 " +
               "a" + obselSize + "," + obselSize + " 0 1,0 " + obselSize*2 + ",0"
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
