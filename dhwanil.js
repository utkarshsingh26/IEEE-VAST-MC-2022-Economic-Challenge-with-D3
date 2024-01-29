var educationData = {
    'Low': { "Jobs": 119, "Participants": 84, "JobChange": 267 },
    'HighSchoolOrCollege': { "Jobs": 705, "Participants": 525, "JobChange": 2005 },
    'Bachelors': { "Jobs": 330, "Participants": 232, "JobChange": 91 },
    'Graduate': { "Jobs": 174, "Participants": 170, "JobChange": 4 }
};

var educationLevelColors = {
    'Low': d3.schemeTableau10[0],
    'HighSchoolOrCollege': d3.schemeTableau10[1],
    'Bachelors': d3.schemeTableau10[2],
    'Graduate': d3.schemeTableau10[3]
};

var educationList = ['Low', 'Bachelors', 'Graduate', 'HighSchoolOrCollege']
export function updateRadarChart(educationLevel, initialUpdate = true) {
    if (!initialUpdate) {
        var svg = d3.select("#dhwanil");
        svg.selectAll("*").remove();
    }

    if (educationData.hasOwnProperty(educationLevel)) {
        drawRadarChart(educationData[educationLevel], educationLevelColors[educationLevel]);
    } else {
        // console.error("Invalid education level provided to updateChart:", educationLevel);
        updateRadarChart("Low");
        updateRadarChart("HighSchoolOrCollege");
        updateRadarChart("Bachelors");
        updateRadarChart("Graduate");
    }
}

updateRadarChart("Low");
updateRadarChart("HighSchoolOrCollege");
updateRadarChart("Bachelors");
updateRadarChart("Graduate");
document.querySelectorAll('input[type="checkbox"].dhwanilCheckbox').forEach(function (checkbox) {

    checkbox.addEventListener('change', function () {
        var svg = d3.select("#dhwanil");
        svg.selectAll(".radarArea").remove();


        var selectedCheckboxes = document.querySelectorAll('input[type="checkbox"].dhwanilCheckbox:checked');
        var selectedEducationLevels = [];

        selectedCheckboxes.forEach(function (checkbox) {
            selectedEducationLevels.push(checkbox.value);
            updateRadarChart(checkbox.value);
        });

    });
});


function drawRadarChart(data, color) {
    var formattedData = [
        { axis: "Jobs", value: data.Jobs },
        { axis: "Participants", value: data.Participants },
        { axis: "JobChange", value: data.JobChange }
    ];


    var cfg = {
        w: 800,
        h: 800,
        factor: 1,
        factorLegend: 0.85,
        levels: 3,
        maxValue: 0,
        radians: 2 * Math.PI,
        opacityArea: 0.5,
        TranslateX: 45,
        TranslateY: 120,
        ExtraWidthX: 100,
        ExtraWidthY: 100,
        color: color
    };

    cfg.maxValue = Math.max(cfg.maxValue, d3.max(formattedData, i => i.value));

    var allAxis = formattedData.map(i => i.axis),
        total = allAxis.length,
        radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);

    //var g = d3.select("#chart").select("svg").remove();

    var g = d3.select("#dhwanil")
        .attr("width", cfg.w + cfg.ExtraWidthX)
        .attr("height", cfg.h + cfg.ExtraWidthY)
        .append("g")
        .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

    g.append("text")
        .attr("class", "allText")
        .attr("x", cfg.w / 2)
        .attr("y", -40)
        .attr("text-anchor", "middle")

        .text("Job Market Readiness Radar");

    for (var j = 0; j < cfg.levels; j++) {
        var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
        g.selectAll(".levels")
            .data(allAxis)
            .enter()
            .append("svg:line")
            .attr("x1", (d, i) => levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total)))
            .attr("y1", (d, i) => levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total)))
            .attr("x2", (d, i) => levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total)))
            .attr("y2", (d, i) => levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total)))
            .attr("class", "line")
            .style("stroke", "black")
            .style("stroke-width", "2px")
            .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
    }

    var axis = g.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

    axis.append("line")
        .attr("x1", cfg.w / 2)
        .attr("y1", cfg.h / 2)
        .attr("x2", (d, i) => cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total)))
        .attr("y2", (d, i) => cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total)))
        .attr("class", "line")
        .style("stroke", "black")
        .style("stroke-width", "2px");

    axis.append("text")
        .attr("class", "legend")
        .text(d => d)
        .style("font-family", "Georgia")
        .style("font-size", "16px")
        .attr("text-anchor", "middle")
        .attr("dy", "1.5em")
        .attr("transform", (d, i) => "translate(0, -10)")
        .attr("x", (d, i) => cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total))
        .attr("y", (d, i) => cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total));

    var legend = g.selectAll(".spiderLegend")
        .data(educationList)
        .enter()
        .append("g")
        .attr("class", "spiderLegend")
        .attr("transform", function (d, i) {
            return "translate(" + 150 * i + "," + -100 + ")";
        });

    legend.append("circle")
        .attr("r", 7)
        .style("fill", function (d, i) {
            return educationLevelColors[d];
        })


    legend.append("text")
        .text(function (d) { return d; })
        .attr("class", "legendText")
        .attr('x', 30)
        .attr('y', 5)


    var dataValues = [];

    formattedData.forEach((d, i) => {
        dataValues.push([
            cfg.w / 2 * (1 - (parseFloat(Math.max(d.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
            cfg.h / 2 * (1 - (parseFloat(Math.max(d.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
        ]);
    });

    g.selectAll(".radarArea")
        .data([dataValues])
        .enter()
        .append("polygon")
        .attr("class", "radarArea")
        .style("stroke-width", "2px")
        .style("stroke", color)
        .attr("points", d => d.map(point => point.join(",")).join(" "))
        .style("fill", color)
        .style("fill-opacity", cfg.opacityArea);

    formattedData.forEach((d, i) => {
        g.append("text")
            .attr("class", "radarChartValue")
            .attr("x", cfg.w / 2 * (1 - (parseFloat(Math.max(d.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)))
            .attr("y", cfg.h / 2 * (1 - (parseFloat(Math.max(d.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total)))
            .text(d.value)
            .style("font-family", "Georgia")
            .style("font-size", "14px")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em");
    });

    for (var j = 0; j < cfg.levels; j++) {
        var levelValue = Math.round((cfg.maxValue * (j + 1)) / cfg.levels);
        var angle = -Math.PI / 2;
        var x = cfg.w / 2 + (levelFactor * (j + 1) / cfg.levels) * Math.cos(angle);
        var y = cfg.h / 2 + (levelFactor * (j + 1) / cfg.levels) * Math.sin(angle);

        g.append("text")
            .attr("class", "levelValue")
            .attr("x", x)
            .attr("y", y)
            .attr("text-anchor", "middle")
            .attr("dy", "1.5em")
            .style("font-family", "Georgia")
            .style("font-size", "16px")
            .text(levelValue);
    }
}
