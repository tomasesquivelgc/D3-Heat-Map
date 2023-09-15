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

  });





