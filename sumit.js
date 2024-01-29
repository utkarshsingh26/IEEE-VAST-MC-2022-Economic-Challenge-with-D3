var margin = { top: 20, right: 20, bottom: 50, left: 75 };
const xsvg = d3.select("#sumit2");
var width = +xsvg.style("width").replace("px", '') - margin.left - margin.right;
var height = +xsvg.style("height").replace("px", '') - margin.top - margin.bottom;

const svg = d3
  .select("#sumit1")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const tooltip = d3.select("body").append("div")
  .attr("class", "utkarsh-tooltip");

export function updateLineChart(educationLevel = "") {
  svg.selectAll("*").remove();

  svg.append("text")
    .attr("class", "allText")
    .attr("x", width / 2)
    .attr("y", 5) 
    .attr("text-anchor", "middle")
    .text("Business Performance Distribution");

  let filename = "modified_financial_journal.csv";

  if (educationLevel === "Low") {
    filename = "modified_financial_journal_low.csv";
  } else if (educationLevel === "HighSchoolOrCollege") {
    filename = "modified_financial_journal_highschool.csv";
  } else if (educationLevel === "Bachelors") {
    filename = "modified_financial_journal_bachelors.csv";
  } else if (educationLevel === "Graduate") {
    filename = "modified_financial_journal_graduate.csv";
  }

  const path = "data_preprocessing/" + filename;
  
  d3.csv(path).then(function (data) {
    const sumByCategory = Array.from(
      d3.rollup(
        data,
        (v) => d3.sum(v, (leaf) => leaf.total_amount),
        (d) => d.month,
        (d) => d.category
      )
    );

    let dataset = sumByCategory.map(([month, categories]) => {
      const entries = { month: d3.timeParse("%Y-%m")(month) };
      for (const [category, total] of categories) {
        entries[category] = total;
      }
      return entries;
    });

    function removeKeys(obj, keysToRemove, keysToMultiply) {
      keysToRemove.forEach((key) => {
        delete obj[key];
      });
      keysToMultiply.forEach((key) => {
        obj[key] *= -1;
      });
      return obj;
    }

    dataset = dataset.map((obj) =>
      removeKeys(
        { ...obj },
        ["RentAdjustment", "Shelter", "Wage"],
        ["Food", "Education", "Recreation"]
      )
    );

    const categories = ["Education", "Food", "Recreation"];

    const transposedData = categories.map((category) => ({
      name: category,
      values: dataset.map((d) => ({ date: d.month, value: d[category] })),
    }));

    const x = d3
      .scaleTime()
      .domain(d3.extent(dataset, (d) => d.month))
      .range([0, width]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat("%Y-%m")))
      .selectAll("text") 
      .attr("class", "axisTicks")
      .attr("transform", "rotate(-20)") 
      .style("text-anchor", "end"); 

    svg
      .append("text")
      .attr("class", "axisTicks")

      .attr("text-anchor", "end")
      .attr("x", width / 2 + margin.left)
      .attr("y", height + margin.top + 25) 
      .style("font-size", "15px")
      .text("Time (YYYY-MM)");

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(transposedData, (d) => d3.max(d.values, (d) => d.value)),
      ])
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20) 
      .attr("x", -margin.top - height / 2 + 20) 
      .style("font-size", "15px")
      .text("Monthly Revenue ($)");

    const color = d3.scaleOrdinal().domain(categories).range(d3.schemeTableau10);

    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.value));

    const lines = svg
      .selectAll(".line")
      .data(transposedData)
      .enter()
      .append("path")
      .attr("class", "line")
      .attr("d", (d) => line(d.values))
      .style("stroke", (d) => color(d.name))
      .style("fill", "none")
      .style("stroke-width", 3);

    svg
      .selectAll("mydots")
      .data(categories)
      .enter()
      .append("circle")
      .attr("cx", width - 100)
      .attr("cy", (d, i) => 10 + i * 25)
      .attr("r", 7)
      .style("fill", (d) => color(d));

    svg
      .selectAll("mylabels")
      .data(categories)
      .enter()
      .append("text")
      .attr("x", width - 80)
      .attr("y", (d, i) => 10 + i * 25)
      .style("fill", (d) => color(d))
      .text((d) => {
        if (d === "Education") {
          return "School";
        } else if (d === "Food") {
          return "Restaurant";
        } else {
          return "Pub";
        }
      })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");

        svg.selectAll(".dot1")
            .data(transposedData[0].values)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", (d) => x(d.date))
            .attr("cy", (d) => y(d.value))
            .attr("r", 5)
            .attr("opacity", 1)
            .style("fill",d3.schemeTableau10[0])
            .on("mouseover", (event, d) => {
              console.log(d);
              tooltip.style("display", "block")
              .html(`
              <div class="tooltip-text">
                  <strong>Date:</strong> ${d.date.getFullYear()}-${d.date.getMonth()}<br>
                  <strong>Monthly Revenue:</strong> ${d.value.toFixed(2)}
              </div>
          `);
            })
            .on("mousemove", function (event) {
              tooltip.style("left", (event.pageX + 2) + "px")
                  .style("top", (event.pageY + 2) + "px");
          })
          .on("mouseout", function () {
              tooltip.style("display", "none");
          });

          svg.selectAll(".dot2")
            .data(transposedData[1].values)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", (d) => x(d.date))
            .attr("cy", (d) => y(d.value))
            .attr("r", 5)
            .attr("opacity", 1)
            .style("fill",d3.schemeTableau10[1])
            .on("mouseover", (event, d) => {
              tooltip.style("display", "block")
              .html(`
              <div class="tooltip-text">
                  <strong>Date:</strong> ${d.date.getFullYear()}-${d.date.getMonth()}<br>
                  <strong>Monthly Revenue:</strong> ${d.value.toFixed(2)}
              </div>
          `);
            })
            .on("mousemove", function (event) {
              tooltip.style("left", (event.pageX + 2) + "px")
                  .style("top", (event.pageY + 2) + "px");
          })
          .on("mouseout", function () {
              tooltip.style("display", "none");
          });

          svg.selectAll(".dot3")
            .data(transposedData[2].values)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", (d) => x(d.date))
            .attr("cy", (d) => y(d.value))
            .attr("r", 5)
            .attr("opacity", 1)
            .style("fill",d3.schemeTableau10[2])
            .on("mouseover", (event, d) => {
              tooltip.style("display", "block")
              .html(`
              <div class="tooltip-text">
                  <strong>Date:</strong> ${d.date.getFullYear()}-${d.date.getMonth()}<br>
                  <strong>Monthly Revenue:</strong> $${d.value.toFixed(2)}
              </div>
          `);
            })
            .on("mousemove", function (event) {
              tooltip.style("left", (event.pageX + 2) + "px")
                  .style("top", (event.pageY + 2) + "px");
          })
          .on("mouseout", function () {
              tooltip.style("display", "none");
          });
  });
}

updateLineChart();
