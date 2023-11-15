<!DOCTYPE html>
<html>
  <head>
    <script src="https://d3js.org/d3.v5.min.js"></script>
  </head>
  <body>
    <div id="word-cloud"></div>
    <script>
      const words = [
        "Data",
        "Visualization",
        "D3.js",
        "JavaScript",
        "HTML",
        "CSS",
        "SVG",
        "Employers",
        "Impress",
        "Wow",
      ];

      const width = 800;
      const height = 400;

      const svg = d3
        .select("#word-cloud")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      const fontSize = d3
        .scaleLinear()
        .domain([0, d3.max(words, (d) => d.length)])
        .range([10, 60]);

      const wordCloud = svg
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", (d) => fontSize(d.length))
        .style("fill", () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
        .attr("text-anchor", "middle")
        .attr("transform", (d, i) => `translate(0,${i * 30})`)
        .text((d) => d);

      wordCloud
        .on("mouseover", function (d) {
          d3.select(this).style("fill", "red");
        })
        .on("mouseout", function (d) {
          d3.select(this).style("fill", () => d3.schemeCategory10[Math.floor(Math.random() * 10)]);
        });
    </script>
  </body>
</html>
