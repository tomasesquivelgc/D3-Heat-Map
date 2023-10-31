const margin = { top: 50, right: 50, bottom: 100, left: 80 };
const width = 1200 - margin.left - margin.right;
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
      .style("fill", d => colorScale(baseTemp + d.variance))
      .on("mouseover", d => showTooltip(d.fromElement.__data__))
      .on("mouseout", hideTooltip);

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
      .style("opacity", 0);

    function showTooltip(d) {
      tooltip.transition()
        .duration(100)
        .style("opacity", 0.9);
      tooltip.html(
        `${d.year}-${d3.timeFormat("%B")(new Date(0, d.month - 1))}<br>${(baseTemp + d.variance)}℃<br>${d.variance}℃`
      )
        .style("left", `${d3.event.pageX + 10}px`)
        .style("top", `${d3.event.pageY - 28}px`)
        .attr("data-year", d.year);
    }

    function hideTooltip() {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    }
  });
