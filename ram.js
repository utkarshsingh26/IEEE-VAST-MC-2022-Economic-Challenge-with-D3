document.addEventListener("DOMContentLoaded", function () {
  var svg = d3.select("#ram");
});
const checkboxes = document.querySelectorAll('.layerCheckbox');
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function() {
    updatevisual();
  });
});

export function updatevisual(education_level = "") {
  d3.select("#ram").selectAll("*").remove();  
  const margin = { top: 30, right: 70, bottom: 45, left: 70 };
  // const width = 650 - margin.left - margin.right;
  // const height = 500 - margin.top - margin.bottom;
  const svg = d3.select("#ram")
  const width = +svg.style("width").replace("px", '') - margin.left - margin.right - 60;
  const height = +svg.style("height").replace("px", '') - margin.top - margin.bottom - 30;

  svg.append("text")
    .attr("class", "allText")
    .attr("x", width / 2 + 100)
    .attr("y", 28) 
    .attr("text-anchor", "middle")
    .attr("font-size", "20px") 
    .attr("font-family", "Georgia")
    .text("Cost of Living Distribution");

  var g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top + 30})`);

  d3.csv("data/ram/after_visual.csv").then(csvData => {
    const filteredData = csvData.map(d => ({
      Month: d3.timeParse('%Y-%m')(d.Month),
      'Education': +d['Education'],
      'Food': +d['Food'],
      'Recreation': +d['Recreation'],
      'Rent': +d['Rent'],
      'Shelter': +d['Shelter'],
      'Wage': +d['Wage'],
      'Expense': +d['Expense'],
      'educationLevel': d['educationLevel']
    })).filter(d => education_level === "" || d.educationLevel === education_level);


    const checkboxes = document.querySelectorAll('.layerCheckbox');
    const checkedCheckboxes = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);


    const groupedData = d3.rollup(
        filteredData,
        values => {
          const result = {};
          checkedCheckboxes.forEach(checkbox => {
            result[checkbox] = d3.sum(values, d => d[checkbox]);
          });
          return result;
        },
        d => d.Month
      );
    const summarizedData = Array.from(groupedData, ([key, value]) => ({ Month: key, ...value }));
  
    const stack = d3.stack()
      .keys(checkedCheckboxes)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetWiggle);

    const stackedData = stack(summarizedData);
    
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const xScale = d3.scaleTime()
      .domain(d3.extent(summarizedData, d => d.Month))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])])
      .range([height, 0]);

    
    const area = d3.area()
      .x(d => xScale(d.data.Month))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]));
   
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    
    const mouseover = function (event, d) {
     
      g.selectAll('.chart-area')
        .transition().duration(200)
        .style('opacity', 0.2);

      d3.select(this)
        .transition().duration(200)
        .style('opacity', 4)
        .attr('stroke', 'black')
        .attr('stroke-width', '2px');
    };


    const mouseleave = function (event, d) {
      g.selectAll('.chart-area')
        .transition().duration(200)
        .style('opacity', 1)
        .attr('stroke', 'none');
      tooltip.style('opacity', 0);
    };

    g.selectAll('.chart-area')
      .data(stackedData)
      .enter().append('path')
      .attr('class', 'chart-area')
      .attr('fill', d => color(d.key))
      .attr('d', area)
      .on('mouseover', mouseover)
      .on('mouseleave', mouseleave);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b \'%y'));
    g.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format('.2s'));
    g.append('g')
      .call(yAxis);

    g.append('text')
      .attr("class", "axisLabels")
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .style('text-anchor', 'middle')
      .text('Time');

    g.append('text')
      .attr("class", "axisLabels")
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .style('text-anchor', 'middle')
      .text('Expenditure  Amount');

    const legend = g.selectAll('.legend')
      .data(stackedData.map(d => d.key))
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', (_, i) => `translate(${i * 120},-20)`);


    legend.append('rect')
      .attr('x', -50)
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', color);

    legend.append('text')
      .attr("class", "legendText")

      .attr('x', -30)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'start')
      .text(d => d);

  });
}

updatevisual();
