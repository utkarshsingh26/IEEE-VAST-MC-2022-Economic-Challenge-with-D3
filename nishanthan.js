var colorScale;
var backgroundSvg;
var educationLevel = "";
var validEducationLevels = ['HighSchoolOrCollege', 'Bachelors', 'Graduate', 'Low'];
var adata;



var nishanthanSvg = d3.select("#nishanthan")
                    .attr("width", 1100)
                    .attr("height", 675);

backgroundSvg = nishanthanSvg.append("svg").attr("class", "map");

backgroundSvg.append("image")
    .attr("xlink:href", "./data/nishanthan/BaseMap.png") 
    .attr("width", 1100) 
    .attr("height", 675);

nishanthanSvg.append("text")
.attr("x", +nishanthanSvg.style("width").replace("px", '') / 2 - 120)
.attr("y", 25) 
.attr("class", "allText")
.text("Spatial Distribution of Rent & population Density");

var xScale = d3.scaleLinear().range([280, 873]); 
var yScale = d3.scaleLinear().range([875, 200]); 

colorScale = d3.scaleLinear()
    .range(d3.schemeTableau10);

d3.csv("./data/nishanthan/Apartments.csv").then(function (data) {
    processData(data);
    setupSimulation(data);
    addRectangles(data, backgroundSvg, xScale, yScale, colorScale);
    addLegend(nishanthanSvg, colorScale);
    adata = data;

    if (validEducationLevels.includes(educationLevel)) {
        updateMapChart(educationLevel);
    }

}).catch(function (error) {
    console.log(error);
});

function processData(data) {
    data.forEach(function (d) {
        var coordinates = d.location.replace('POINT (', '').replace(')', '').split(' ');
        d.x = +coordinates[0];
        d.y = +coordinates[1];
        d.rentalCost = +d.rentalCost;
        d.maxOccupancy = +d.maxOccupancy;
        d.numberOfRooms = +d.numberOfRooms;
        d.apartmentId = +d.apartmentId;
    });

    xScale.domain(d3.extent(data, function (d) { return d.x; }));
    yScale.domain(d3.extent(data, function (d) { return d.y; }));
    colorScale.domain([d3.min(data, function (d) { return d.rentalCost; }) + 400, d3.max(data, function (d) { return d.rentalCost; })]);
}

function setupSimulation(data) {
    var simulation = d3.forceSimulation(data)
        .force("x", d3.forceX(function (d) { return xScale(d.x); }).strength(10.1))
        .force("y", d3.forceY(function (d) { return yScale(d.y); }).strength(10.1))
        .force("collide", d3.forceCollide(function (d) { return Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 7; }).iterations(2).strength(0.3))
        .stop();

    for (var i = 0; i < 200; ++i) simulation.tick();
}

function addRectangles(data, svg, xScale, yScale, colorScale) {
    svg.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("class", "point")
        .attr("x", function (d) {
            return d.x - 17 - Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 5 ;
        })
        .attr("y", function (d) {
            return d.y - 200 - Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 5;
        })
        .attr("width", function (d) {
            return Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 7;
        })
        .attr("height", function (d) {
            return Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 7;
        })
        .attr("fill", function (d) {
            return colorScale(d.rentalCost);
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1);
}

function addLegend(svg, colorScale) {
    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(950,80)");

    var legendRectSize = 18;
    var legendSpacing = 12;

    var legendData = ["Low Rent", "High Rent"];

    var legendGradient = legend.append("defs")
        .append("linearGradient")
        .attr("id", "rentLegend")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "0%")
        .attr("y2", "0%");

    legendGradient.append("stop")
        .attr("offset", "0%")
        .style("stop-color", colorScale.range()[0]);

    legendGradient.append("stop")
        .attr("offset", "100%")
        .style("stop-color", colorScale.range()[1]);

    legend.append("rect")
        .attr("width", legendRectSize)
        .attr("height", legendRectSize * 5)
        .style("fill", "url(#rentLegend)")
        .attr("transform", "translate(0," + (legendRectSize * 2) + ")");


    var legendText = legend.selectAll(".legendText")
        .data(colorScale.domain())
        .enter().append("text")
        .attr("class", "legendText")
        .attr("x", legendRectSize + legendSpacing * 2)
        .attr("y", function (d, i) { return (1 - i) * (legendRectSize + legendSpacing * 4) + legendRectSize * 2.65; })
        .attr("dy", "0.35em")
        .text(function (d) { return Math.round(d < 1000 ? d - 400 : d); });

    legend.append("text").attr("class", "legendText")
        .attr("x", legendRectSize + legendSpacing * 2 - 35)
        .attr("y", function (d, i) { return (1 - i) * (legendRectSize + legendSpacing * 4) + legendRectSize * -4; })
        .attr("dy", "0.35em")
        .text("Rent in $");
}

export function updateMapChart(educationLevel) {
    if (validEducationLevels.includes(educationLevel)) {
        
        d3.csv('./data/nishanthan/combined_data.csv').then(function (combinedData) {
            
            var filteredData = combinedData.filter(function (d) {
                return d.educationLevel === educationLevel;
            });

            var apartmentIds = filteredData.map(function (d) {
                return +d.apartmentId;
            });

            var filteredApartments = adata.filter(function (apartment) {
                return apartmentIds.includes(apartment.apartmentId);
            });

            backgroundSvg.selectAll("rect").remove();

            backgroundSvg.selectAll("rect")
                .data(filteredApartments)
                .enter().append("rect")
                .attr("class", "point")
                .attr("x", function (d) {
                    return d.x -17 - Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 5;
                })
                .attr("y", function (d) {
                    return d.y -200 - Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 5;
                })
                .attr("width", function (d) {
                    return Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 7;
                })
                .attr("height", function (d) {
                    return Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 7;
                })
                .attr("fill", function (d) {
                    return colorScale(d.rentalCost);
                })
                .attr("stroke", "black")
                .attr("stroke-width", 1);
        }).catch(function (error) {
            console.log(error);
        });
    } else {
        backgroundSvg.selectAll("rect").remove();

        backgroundSvg.selectAll("rect")
            .data(adata)
            .enter().append("rect")
            .attr("class", "point")
            .attr("x", function (d) {
                return d.x -17 - Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 5;
            })
            .attr("y", function (d) {
                return d.y -200 - Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 5;
            })
            .attr("width", function (d) {
                return Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 7;
            })
            .attr("height", function (d) {
                return Math.sqrt(d.numberOfRooms / d.maxOccupancy) * 7;
            })
            .attr("fill", function (d) {
                return colorScale(d.rentalCost);
            })
            .attr("stroke", "black")
            .attr("stroke-width", 1);
    }
}





