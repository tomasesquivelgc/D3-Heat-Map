const margin = { top: 50, right: 50, bottom: 100, left: 80 };
const width = 1300 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then(response => response.json())
  .then(data => {
    const baseTemp = data.baseTemperature;
    const monthlyVariance = data.monthlyVariance;
    const minYear = d3.min(monthlyVariance, d => d.year);
    const maxYear = d3.max(monthlyVariance, d => d.year);
    const container = d3.select("#container");

    container.append("h1")
      .attr("id", "title")
      .text("Monthly Global Land-Surface Temperature");

    container.append("h2")
      .attr("id", "description")
      .text(`${minYear}-${maxYear}: base temperature ${baseTemp}℃`);

    const svg = container.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const colorScale = d3.scaleSequential(d3.interpolateRdBu);

    // Set the domain for the color scale based on your data
    colorScale.domain([
      d3.max(monthlyVariance, d => baseTemp + d.variance),
      d3.min(monthlyVariance, d => baseTemp + d.variance)
    ]);

    // Create and append the heatmap rectangles
    svg.selectAll("rect")
      .data(monthlyVariance)
      .enter()
      .append("rect")
      .attr("x", d => (d.year - minYear) * (width / (maxYear - minYear)))
      .attr("y", d => (d.month - 1) * (height / 12))
      .attr("width", width / (maxYear - minYear))
      .attr("height", height / 12)
      .attr("year", d => d.year)
      .attr("month", d => d.month - 1)
      .attr("temp", d => baseTemp + d.variance)
      .style("fill", d => colorScale(baseTemp + d.variance))
      .on("mouseover", mouseover)
      .on("mousemove", mousemove);

    // Create y-axis
    const yScale = d3.scaleBand()
      .domain(d3.range(12))
      .range([0, height]);
    svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale)
        .tickFormat((d, i) => {
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return monthNames[i];
        })
      );

    // Create x-axis
    const xScale = d3.scaleLinear()
      .domain([minYear, maxYear])
      .range([0, width]);
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    // Tooltip
    const tooltip = container.append("div")
      .attr("id", "tooltip")
      .style("opacity", 1)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px");

    var mouseover = function(d) {
      tooltip.style("opacity", 1)
    }

    function mousemove(d) {
      let data = d.target.attributes;
      tooltip
      .html("Year: " + data.year.value + "<br>" + "Month: " + data.month.value + "<br>" + "Temperature: " + parseFloat(data.temp.value).toFixed(2))
      .style("left", (data.x.value)/2 + "px")
      .style("top", (data.y.value)/2 + "px")
    }

  });
