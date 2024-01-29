var startObject = {};
var endObject = {};
var svg;
var height = 500;
var width = 600;
var margin = { top: 30, right: 30, bottom: 30, left: 90 };
var chartHeight = height - margin.top - margin.bottom;
var chartWidth = width - margin.left - margin.right;

document.addEventListener("DOMContentLoaded", function () {
    
    svg = d3.select("#utkarsh").attr("width", width).attr("height", height).append("g")
    .attr("transform", `translate(${margin.left + 65},${margin.top + 160})`);

    d3.csv('data/utkarsh/Start.csv', { encoding: 'UTF-8' })
    d3.csv('data/utkarsh/End.csv', { encoding: 'UTF-8' })


    Promise.all([d3.csv('data/utkarsh/Start.csv'), d3.csv('data/utkarsh/End.csv')])
        .then(function (values) {

            var start = values[0];
            var end = values[1];

            var ageDropdown = document.getElementById("age-group");


            ageDropdown.addEventListener("change", function () {

                svg.selectAll("*").remove();

                svg.append("text")
                    .attr("text-anchor", "middle")
                    .attr("class", "allText")
                    .attr("x", width / 2)
                    .attr("y", -145) 
                    .attr("text-anchor", "middle")
                    .attr("font-size", "20px") 
                    .attr("font-family", "Georgia")
                    .text("Wage Change Comparison among Residents");

                var selectedValue = ageDropdown.value;
                selectedValue = selectedValue.split("-");
                var minAge = selectedValue[0];
                var maxAge = selectedValue[1];

                var startSumLow = 0;
                var startSumHighSchoolOrCollege = 0;
                var startSumBachelors = 0;
                var startSumGraduate = 0;

                for (let i = 0; i < start.length; i++) {
                    if (start[i].age >= minAge && start[i].age <= maxAge) {
                        if (start[i].educationLevel == "Low") {
                            startSumLow = startSumLow + parseFloat(start[i].monthlySalary);
                        } else if (start[i].educationLevel == "HighSchoolOrCollege") {
                            startSumHighSchoolOrCollege = startSumHighSchoolOrCollege + parseFloat(start[i].monthlySalary);
                        } else if (start[i].educationLevel == "Bachelors") {
                            startSumBachelors = startSumBachelors + parseFloat(start[i].monthlySalary);
                        } else if (start[i].educationLevel == "Graduate") {
                            startSumGraduate = startSumGraduate + parseFloat(start[i].monthlySalary);
                        }
                    }
                }

                startObject.startSumLow = startSumLow;
                startObject.startSumHighSchoolOrCollege = startSumHighSchoolOrCollege;
                startObject.startSumBachelors = startSumBachelors;
                startObject.startSumGraduate = startSumGraduate;

                var endSumLow = 0;
                var endSumHighSchoolOrCollege = 0;
                var endSumBachelors = 0;
                var endSumGraduate = 0;

                for (let i = 0; i < end.length; i++) {
                    if (end[i].age >= minAge && end[i].age <= maxAge) {
                        if (end[i].educationLevel == "Low") {
                            endSumLow = endSumLow + parseFloat(end[i].monthlySalary);
                        } else if (end[i].educationLevel == "HighSchoolOrCollege") {
                            endSumHighSchoolOrCollege = endSumHighSchoolOrCollege + parseFloat(end[i].monthlySalary);
                        } else if (end[i].educationLevel == "Bachelors") {
                            endSumBachelors = endSumBachelors + parseFloat(end[i].monthlySalary);
                        } else if (end[i].educationLevel == "Graduate") {
                            endSumGraduate = endSumGraduate + parseFloat(end[i].monthlySalary);
                        }
                    }
                }

                endObject.endSumLow = endSumLow;
                endObject.endSumHighSchoolOrCollege = endSumHighSchoolOrCollege
                endObject.endSumBachelors = endSumBachelors;
                endObject.endSumGraduate = endSumGraduate;

                var x_Axis_Values = ['Low', 'HighSchoolOrCollege', 'Bachelors', 'Graduate'];
                var min_max_Array = [];
                min_max_Array.push(startSumLow);
                min_max_Array.push(startSumHighSchoolOrCollege);
                min_max_Array.push(startSumBachelors);
                min_max_Array.push(startSumGraduate);
                min_max_Array.push(endSumLow);
                min_max_Array.push(endSumHighSchoolOrCollege);
                min_max_Array.push(endSumBachelors);
                min_max_Array.push(endSumGraduate);

                var x_axis_min = d3.min(min_max_Array);
                x_axis_min = x_axis_min.toFixed(2);
                var x_axis_max = d3.max(min_max_Array);
                x_axis_max = x_axis_max.toFixed(2);

                var xScale = d3.scaleBand()
                    .domain(x_Axis_Values)
                    .range([0, chartWidth])
                    .padding(0.1);


                svg.append("g")
                    .call(d3.axisBottom(xScale))
                    .attr('transform', `translate(${margin.left},${chartHeight + margin.top})`);

                svg.append("text")
                    .attr("class", "axisLabels")

                    .attr("transform", `translate(${margin.left + chartWidth / 2},${height - margin.bottom + 50})`)
                    .style("text-anchor", "middle")
                    .text("Education Level")


                const yScale = d3.scaleLinear()
                    .domain([0, x_axis_max])
                    .nice()
                    .range([chartHeight, 0])

                svg.append('g')
                    .call(d3.axisLeft(yScale))
                    .attr('transform', `translate(${margin.left},${margin.top})`)

                svg.append("text")
                    .attr("class", "axisLabels")

                    .attr("transform", "rotate(-90)")
                    .attr("y", margin.left / 2 - 50)
                    .attr("x", 0 - (chartHeight / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Collective Monthly Salary");

                var startData = [
                    { category: 'Low', value: startObject.startSumLow },
                    { category: 'HighSchoolOrCollege', value: startObject.startSumHighSchoolOrCollege },
                    { category: 'Bachelors', value: startObject.startSumBachelors },
                    { category: 'Graduate', value: startObject.startSumGraduate }
                ];

                var endData = [
                    { category: 'Low', value: endObject.endSumLow },
                    { category: 'HighSchoolOrCollege', value: endObject.endSumHighSchoolOrCollege },
                    { category: 'Bachelors', value: endObject.endSumBachelors },
                    { category: 'Graduate', value: endObject.endSumGraduate }
                ];

                var bandwidth = xScale.bandwidth() / 2;

                svg.selectAll(".startBars")
                    .data(startData)
                    .enter().append("rect")
                    .attr("class", "startBars")
                    .attr("x", d => xScale(d.category) + margin.left)
                    .attr("y", chartHeight + margin.top)
                    .attr("width", bandwidth)
                    .attr("height", 0)
                    .attr("fill", d3.schemeTableau10[0])
                    .on("mouseover", (event, d) => {
                        tooltip.style('display', 'block')
                            .style('left', `${event.pageX + 10}px`)
                            .style('top', `${event.pageY - 30}px`)
                            .html(`<strong>Education Category:</strong> ${d.category}<br><strong>Total Income:</strong> $${d.value.toFixed(2)}<br><strong>Period:</strong> Start of Study`)
                    })
                    .transition()
                    .duration(1000)
                    .attr("y", d => yScale(d.value) + margin.top)
                    .attr("height", d => chartHeight - yScale(d.value))

                svg.selectAll(".endBars")
                    .data(endData)
                    .enter().append("rect")
                    .attr("class", "endBars")
                    .attr("x", d => xScale(d.category) + margin.left + bandwidth)
                    .attr("y", chartHeight + margin.top)
                    .attr("width", bandwidth)
                    .attr("height", 0)
                    .attr("fill", d3.schemeTableau10[1])
                    .on("mouseover", (event, d) => {
                        tooltip.style('display', 'block')
                            .style('left', `${event.pageX + 10}px`)
                            .style('top', `${event.pageY - 30}px`)
                            .html(`<strong>Education Category:</strong> ${d.category}<br><strong>Total Income:</strong> $${d.value.toFixed(2)}<br><strong>Period:</strong> End of Study`)
                    })
                    .on("mouseout", function () {
                        tooltip.style("display", "none");
                    })
                    .transition()
                    .duration(1000)
                    .attr("y", d => yScale(d.value) + margin.top)
                    .attr("height", d => chartHeight - yScale(d.value));

                var legendRadius = 8;
                var legendSpacing = 20;

                var legend = svg.append("g")
                    .attr("class", "legend")
                    .attr("transform", `translate(${width - margin.right - 25},${margin.top})`);

                legend.append("circle")
                    .attr("cx", 0)
                    .attr("cy", 0)
                    .attr("r", legendRadius)
                    .attr("fill", d3.schemeTableau10[0]);

                legend.append("text")
                    .attr("x", legendRadius + 5)
                    .attr("y", 0)
                    .attr("dy", "0.35em")
                    .text("Start of Study");

                legend.append("circle")
                    .attr("cx", 0)
                    .attr("cy", legendSpacing)
                    .attr("r", legendRadius)
                    .attr("fill", d3.schemeTableau10[1]);

                legend.append("text")
                    .attr("x", legendRadius + 5)
                    .attr("y", legendSpacing)
                    .attr("dy", "0.35em")
                    .text("End of Study");

                updateBarGraph(selectedEducationLevel)

            });

            var changeEvent = new Event("change");
            ageDropdown.dispatchEvent(changeEvent);

        })


});

export function updateBarGraph(selectedEducationLevel) {
    if (selectedEducationLevel != "ALL") {
        svg.selectAll(".startBars, .endBars")
            .attr("opacity", d => (d.category === selectedEducationLevel) ? 1 : 0.3);
    }

    else {
        svg.selectAll(".startBars, .endBars")
            .attr("opacity", 1);
    }
}

const tooltip = d3.select("body").append("div")
    .attr("class", "utkarsh-tooltip");




