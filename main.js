const width = 1200;
const height = 400;
const padding = 60;

fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    const baseTemp = data.baseTemperature;
    const monthlyVariance = data.monthlyVariance;
    const minYear = d3.min(monthlyVariance, d => d.year);
    const maxYear = d3.max(monthlyVariance, d => d.year);

    
    d3.select("#container")
      .append("h1")
      .attr("id", "title")
      .text("Title");

    d3.select("#container")
      .append("h2")
      .attr("id", "description")
      .text(`${minYear}-${maxYear}: base temperature ${baseTemp}℃`);

    const svg = d3.select("#container")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

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
      .style("fill", d => colorScale(baseTemp + d.variance));

  });
