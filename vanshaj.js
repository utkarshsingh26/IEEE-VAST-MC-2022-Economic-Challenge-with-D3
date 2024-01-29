
var globalExpenseDataset = []
var globalData = []
var educationLevelList = []
var ageGroupList = []
var categoryList = []
var margin = { top: 10, bottom: 30, left: 50, right: 50 }
var width
var height
var chartHeight
var chartWidth
var pieData = []
var hierData = []
var outerPieData = []
var colors
var colorCodes = ["#F22B67", "#F69402", "#F1DF01", "#50E600", "#02A4ED"]
var toolTipData = []
var ageGrps = ["0-10", "11-20", "21-30", "31-40", "41-50", "51-60", "61-70", "71-80"]
var colorScale = d3.scaleOrdinal()
    .domain(ageGrps)
    .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f"]);

document.addEventListener("DOMContentLoaded", function () {
    var svg = d3.select("#vanshaj");

    Promise.all([d3.csv('datasets/ExpenseDataset.csv')])
        .then(function (data) {
            globalData = data[0]
            globalExpenseDataset = globalData.map(d => {

                return {
                    "ParticipantId": d.participantId,
                    "TimeStamp": d.timestamp,
                    "Category": d.category,
                    "Amount": +d.amount,
                    "Age": +d.age,
                    "EducationLevel": d.educationLevel,
                    "AgeGroup": d.ageGroup,
                    "MonthNumber": +d.monthNum
                }
            })
            plotInnovativeChart(globalExpenseDataset)

        })

});

function plotInnovativeChart(data, educationLevel = "ALL") {
    globalExpenseDataset.forEach(d => {
        if (!educationLevelList.includes(d.EducationLevel)) {
            educationLevelList.push(d.EducationLevel)
        }
        if (!ageGroupList.includes(d.AgeGroup)) {
            ageGroupList.push(d.AgeGroup)
        }
        if (!categoryList.includes(d.category)) {
            categoryList.push(d.category)
        }
    })



    for (var i = 1; i <= 15; i++) {
        var totolWage = 0
        var totalShelter = 0
        var totalEducation = 0
        var totalRentAdjustment = 0
        var totalFood = 0
        var totalRecreation = 0
        var lengthOfData = 0
        data.forEach(function (d) {
            if (educationLevel == "ALL") {
                if (d.MonthNumber == i) {
                    switch (d.Category) {
                        case "Wage":
                            totolWage += d.Amount
                            break
                        case "Shelter":
                            totalShelter += d.Amount
                            lengthOfData += 1
                            break
                        case "Education":
                            totalEducation += d.Amount
                            lengthOfData += 1
                            break
                        case "RentAdjustment":
                            totalRentAdjustment += d.Amount
                            break
                        case "Food":
                            totalFood += d.Amount
                            lengthOfData += 1
                            break
                        case "Recreation":
                            totalRecreation += d.Amount
                            lengthOfData += 1
                            break
                    }
                }
            } else {
                if (d.MonthNumber == i && d.EducationLevel == educationLevel) {
                    switch (d.Category) {
                        case "Wage":
                            totolWage += d.Amount
                            break
                        case "Shelter":
                            totalShelter += d.Amount
                            lengthOfData += 1
                            break
                        case "Education":
                            totalEducation += d.Amount
                            lengthOfData += 1
                            break
                        case "RentAdjustment":
                            totalRentAdjustment += d.Amount
                            break
                        case "Food":
                            totalFood += d.Amount
                            lengthOfData += 1
                            break
                        case "Recreation":
                            totalRecreation += d.Amount
                            lengthOfData += 1
                            break
                    }
                }
            }
        })

        pieData[i - 1] = {
            "MonthNumber": i,
            "TotalWage": totolWage,
            "Saving": parseFloat((totolWage - totalShelter - totalEducation + totalRentAdjustment - totalFood - totalRecreation).toFixed(2)),
            "ExpenseData": {
                "Shelter": -1 * parseFloat(totalShelter.toFixed(2)),
                "Education": -1 * parseFloat(totalEducation.toFixed(2)),
                "Food": -1 * parseFloat(totalFood.toFixed(2)),
                "Recreation": -1 * parseFloat(totalRecreation.toFixed(2))
            },
            "TotalExpense": -1 * (parseFloat(totalShelter.toFixed(2)) + parseFloat(totalEducation.toFixed(2)) + parseFloat(totalFood.toFixed(2)) + parseFloat(totalRecreation.toFixed(2))),
            "LengthOfData": lengthOfData,
            "AvgExpense": (-1 * parseFloat((totalEducation + totalFood + totalRecreation + totalShelter).toFixed(2))) / lengthOfData
        }


    }


    plotPieScatter(pieData)


}

export function updateGraph(educationLevel) {
    console.log("update graph called......")
    plotInnovativeChart(globalExpenseDataset, educationLevel)
}

function plotPieScatter(data) {
    var svg = d3.select("#vanshaj")
    svg.selectAll("*").remove()
    height = +svg.style("height").replace("px", '');
    width = +svg.style("width").replace("px", '');
    svg.append("text")
        .attr("class", "allText")
        .attr("x", width / 2)
        .attr("y", 35)
        .attr("text-anchor", "middle")
        .attr("font-size", "24px")
        .attr("font-family", "Georgia")
        .text("Monthly Expenditure Trend")

    var margin = { top: 10, bottom: 30, left: 35, right: 20 }
    chartHeight = height - margin.top - margin.bottom
    chartWidth = width - margin.left - margin.right

    const g = svg.append("g")
        .attr('transform', `translate(${margin.left + 35}, ${margin.top})`)

    var xScale = d3.scaleLinear()
        .domain([0, 15])
        .range([0, chartWidth - 100])

    var xAxis = d3.axisBottom(xScale)

    g.append("text")
        .attr("class", "axisLabels")
        .attr("transform", `translate(${chartWidth / 2},${chartHeight + 20})`)
        .style("text-anchor", "middle")
        .text("Month Number")


    g.append('g').call(xAxis)
        .attr('transform', `translate(0,${chartHeight - 10})`)

    var toolTipDiv = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

    var tooltip = document.querySelector('.tooltip');

    var tooltipStyle = window.getComputedStyle(tooltip);

    var tooltipWidth = tooltipStyle.width;
    var tooltipHeight = tooltipStyle.height;

    tooltipWidth = parseFloat(tooltipWidth);
    tooltipHeight = parseFloat(tooltipHeight);
    var toolTipMargin = { top: 30, bottom: 30, left: 30, right: 30 }

    var innerBarWidth = tooltipWidth - toolTipMargin.left - toolTipMargin.right - 30
    var innerBarHeight = tooltipHeight - toolTipMargin.top - toolTipMargin.bottom - 20

    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(function (d) {
            return d.Saving
        })

    var pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d[1]
        })


    // colors = d3.scaleOrdinal().domain(["Saving", "Shelter", "Education", "Food", "Recreation"]).range(colorCodes)
    colors = d3.scaleOrdinal().domain(["Shelter", "Education", "Food", "Recreation"]).range(d3.schemeTableau10)




    var pieRadiusFunct = d3.scaleSqrt().domain(d3.extent(data.map((d) => d.Saving))).range([40, 80])


    var simulation = d3.forceSimulation(data)
        .force('charge', d3.forceManyBody().strength(4))
        .force('x', d3.forceX().x(function (d) {
            return xScale(d.MonthNumber)
        }))
        .force('y', d3.forceY().y(function (d) {
            return chartHeight / 2
        }))
        .force('collision', d3.forceCollide().radius(function (d) {
            return pieRadiusFunct(d.Saving)
        }))

    var numIterations = 10
    for (let i = 0; i < numIterations; i++) {
        simulation.tick()
    }

    simulation.on("end", (finalEvent) => {
        showPieLegends(chartWidth)
        var pies = g.selectAll(".pieGroup")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "pieGroup")
            .property("radius", function (d) {
                return d.Saving
            })
            .property("index", function (d) {
                return d.MonthNumber
            })
            .attr("transform", function (d) {
                return `translate(${d.x}, ${d.y})`
            })

        var totalText = toolTipDiv.append("text")
            .attr("class", "toolText")
            .attr("id", "toolTipText")

        var toolTipSvg = toolTipDiv.append("svg")
            .attr("id", "toolTipSvg")
            .attr("width", tooltipWidth)
            .attr("height", tooltipHeight)
        pies.selectAll(".pieScatter")
            .data(function (d) {
                return pie(Object.entries(d.ExpenseData))
            })
            .join("path")
            .attr("class", "pieScatter")
            .attr("d", function (d) {
                var radius = d3.select(this.parentNode).property("radius")
                // arc.outerRadius(pieRadiusFunct(radius))
                arc.outerRadius(0)
                return arc(d)
            })
            .attr("fill", function (d) {
                return colors(d.data[0])
            })

            .attr("stroke", function (d) {
                return colors(d.data[0])
            })
            .attr("stroke-width", 2)
            .transition()
            .duration(1000)
            .attrTween("d", function (d) {
                var radius = d3.select(this.parentNode).property("radius");
                var interpolate = d3.interpolate(0, pieRadiusFunct(radius));
                return function (t) {
                    arc.outerRadius(interpolate(t));
                    return arc(d);
                };
            })
        pies.selectAll(".pieScatter")
            .data(function (d) {
                return pie(Object.entries(d.ExpenseData))
            })
            .on("mouseover", function (event, data) {
                toolTipSvg.selectAll("*").remove()
                totalText.text(`Total : ${data.value}`)
                    .style("font-size", "14px")
                    .style("font-weight", "bold")
                    .style("color", "black")

                var ind = d3.select(this.parentNode).property("index")

                var ageExpenseDict = {}
                globalExpenseDataset.forEach(function (d) {
                    if (d.MonthNumber <= ind) {
                        if (ind == d.MonthNumber && d.Category == data.data[0]) {
                            if (d.AgeGroup in ageExpenseDict) {
                                ageExpenseDict[d.AgeGroup] += -1 * (parseInt(d.Amount))
                            } else {
                                ageExpenseDict[d.AgeGroup] = -1 * (parseInt(d.Amount))
                            }
                        }
                    }
                })
                var yScale = d3.scaleLinear()
                    .domain([0, d3.max(Object.values(ageExpenseDict))])
                    .range([innerBarHeight, 0])
                var xAxisLabels = Object.keys(ageExpenseDict).sort((a, b) => {
                    const [aMin, aMax] = a.split('-').map(Number);
                    const [bMin, bMax] = b.split('-').map(Number);
                    return aMin - bMin || aMax - bMax;
                })
                var xScale = d3.scaleBand()
                    .domain(xAxisLabels)
                    .range([0, innerBarWidth - 20])
                    .padding(0.1)

                var xAxis = d3.axisBottom(xScale)
                var yAxis = d3.axisLeft(yScale)



                var txt = "Age group vs " + data.data[0] + " Expense"
                var toolTipG = toolTipSvg.append('g')
                    .attr('transform', `translate(${50}, ${20})`)
                toolTipSvg.append("text")
                    .attr("x", innerBarWidth / 2 + 20)
                    .attr("y", 15)
                    .attr("text-anchor", "middle")
                    .style("font-size", "12px")
                    .style("font-weight", "bold")
                    .text(txt)

                toolTipG.append('g').call(xAxis)
                    .attr('transform', `translate(0,${innerBarHeight})`)
                    .selectAll('text')
                    .style("text-anchor", "end")

                toolTipG.append('g').call(yAxis)


                toolTipG.selectAll("rect")
                    .data(Object.entries(ageExpenseDict))
                    .enter()
                    .append("rect")
                    .attr("x", function (d) {

                        return xScale(d[0])
                    })
                    .attr("y", function (d) {
                        return yScale(d[1])
                    })
                    .attr('width', xScale.bandwidth())
                    .attr('height', d => innerBarHeight - yScale(d[1]))
                    .attr("fill", function (d) {
                        return colorScale(d[0])
                    })

                toolTipG.selectAll(".barText")
                    .data(Object.entries(ageExpenseDict))
                    .enter()
                    .append("text")
                    .attr("class", "barText")
                    .text(function (d) {
                        return d[1];
                    })
                    .attr("x", function (d) {
                        return xScale(d[0]) + xScale.bandwidth() / 2;
                    })
                    .attr("y", function (d) {
                        return yScale(d[1]) + 30;
                    })
                    .attr("text-anchor", "middle")
                    .style("font-size", "12px")
                    .style("fill", "whitesmoke")
                toolTipDiv.transition()
                    .duration(0)
                    .style("display", "block")
                    .style("opacity", 0.8)
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY + 'px')

            })
            .on("mousemove", function (d, i) {

                toolTipDiv.transition()
                    .duration(0)
                    .style("display", "block")
                    .style("opacity", 0.8)
                    .style("left", d.pageX + "px")
                    .style("top", d.pageY + 'px')
            })
            .on('mouseout', function (d) {
                var tsvg = d3.select("#toolTipSvg")
                tsvg.selectAll("*").remove()
                totalText.text("")
                toolTipDiv.transition()
                    .duration(300)
                    .style("display", "none")
            })

    })





}

function showPieLegends(width) {
    var svg = d3.select("#vanshaj")
    var lst = ["Food", "Shelter", "Recreation", "Education"]

    var legendWidth = 20;
    var legendPadding = 50;
    var legendItemWidth = legendWidth + legendPadding;
    var legendHeight = 20;

    var legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(30, 10)`);

    var legendItems = legend.selectAll('.legend-item')
        .data(lst)
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', function (d, i) {
            return 'translate(' + (i * (legendItemWidth + 55)) + ', 15)';
        });

    legendItems.append('circle')
        // .attr('width', legendWidth)
        // .attr('height', legendHeight)
        // .attr("cx", 0)
        .attr("cy", 10)
        .attr('r', 8)
        .attr('fill', function (d, i) {

            return colors(d);
        });

    legendItems.append('text')
        .attr("class", "legendText")
        .attr('x', legendWidth + 10)
        .attr('y', legendHeight / 2)
        .attr('dy', '0.35em')
        .attr('style', 'font: Georgia')

        .text(function (d) {
            return d;
        });
}