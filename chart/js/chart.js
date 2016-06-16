(function policy() {

  'use strict';

  // Chart settings
  var margin = { top: 40, right: 40, bottom: 20, left: 10 };

  // D3 elements, variables and functions
  var chart, plot, svg, group, xScale, xAxis, width, height, timeout;

  // Fetched and wrangled data
  var cachedData = {};

  d3.json('../output/policy.json', function (data) {

    init(data);
  });

  d3.select(window).on('resize', resize);

  function init(data) {

    // Use cached data on redraw
    if (data) {

      cachedData = data;
    } else {

      data = cachedData;
    }

    for (var current in data) {

      draw(data[current], current);
    }
  }

  function draw(data, name) {

    // Reverse data for nice drawing
    data = data.reverse();

    // Select elements
    chart = d3.select('.charts');

    // Calculate initial dimensions, based on container size
    width = parseInt(chart.style('width'));
    height = 90;

    svg = chart.append('svg')
      .attr('width', width)
      .attr('height', height);

    // Calculate the data scales
    xScale = d3.scale.linear()
      .domain([-1, 1])
      .range([margin.left, width - margin.right]);

    // Calculate the axis
    xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom');

    svg.append('text')
      .attr('class', 'policy')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', '1em')
      .style('text-anchor', 'left')
      .text(germanTitle(name));

    plot = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + 30 + ')')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'plot');

    // Draw the axis
    plot.append('g')
        .attr('transform', 'translate(0,' + margin.bottom + ')')
        .attr('class', 'axis')
        .call(xAxis);

    group = plot.append('g');

    // Draw the dots
    group.selectAll('dots')
        .data(data)
        .enter()
      .append('rect')
        .attr('class', function (d) { return d.party.toLowerCase(); })
        .attr('x', function (d) { return xScale(d.value); })
        //.attr('cx', function (d) { return xScale(d.value); })
        .attr('width', 6)
        .attr('height', 16)
        .attr('r', 8);
  }

  function germanTitle(title) {

    switch (title) {
      case 'External Relations':
        return 'Außenpolitik';
      case 'Fabric of Society':
        return 'Gesellschaft';
      case 'Welfare and Quality of Life':
        return 'Lebensqualität';
      case 'Freedom and Democracy':
        return 'Freiheit und Demokratie';
      case 'Political System':
        return 'Staatswesen';
      case 'Economy':
        return 'Wirtschaft';
    }
  }

  function resize() {

    clearTimeout(timeout);

    timeout = setTimeout(function () {
      reset();
      init();
    }, 500);
  }

  // Remove the chart so it can be redrawn
  function reset() {

    chart.selectAll('*').remove();
  }
})();
