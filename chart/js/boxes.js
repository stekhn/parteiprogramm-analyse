(function policy() {

  'use strict';

  // Chart settings
  var margin = { top: 40, right: 40, bottom: 20, left: 10 };

  // D3 elements, variables and functions
  var chart, plot, svg, group, max, min, xScale, xAxis, width, height, timeout;

  // Fetched and wrangled data
  var cachedData = {};

  d3.json('../output/weightedPolicy.json', function (data) {
  //d3.json('../output/policy.json', function (data) {

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

    var keys = Object.keys(data).sort(function (a, b) {

      return germanTitle(a).localeCompare(germanTitle(b));
    });

    for (var key in keys) {

      draw(data[keys[key]], keys[key]);
    }
  }

  function draw(data, name) {

    // Reverse data for nice drawing
    data = data.reverse();

    // Select elements
    chart = d3.select('.charts');

    // Calculate initial dimensions, based on container size
    width = parseInt(chart.style('width'));
    height = 200;

    min = d3.min(data, function (d) { return d.percent; } );
    max = d3.max(data, function (d) { return d.percent; } );

    svg = chart.append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', name);

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
      .style('text-anchor', 'start')
      .text(germanTitle(name));

    plot = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + 30 + ')')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'plot');

    // Draw the axis
    plot.append('g')
        .attr('transform', 'translate(0,' + 130 + ')')
        .attr('class', 'axis')
        .call(xAxis);

    group = plot.append('g');

    // Draw the dots
    group.selectAll('rects')
        .data(data)
        .enter()
      .append('rect')
        .attr('class', function (d) { return d.party.toLowerCase(); })
        .attr('x', function (d) { return xScale(d.mean) -1 * map(d.percent, min, max, 7, 20) / 2; })
        .attr('width', function (d) {
          return map(d.percent, min, max, 7, 20);
        })
        .attr('height', '10')
        .attr('y', function (d, i) {
          return -5 + 20 * i;
        })
        .on('mouseenter', function (d) { console.log(d); });

    // Draw the lines
    group.selectAll('lines')
        .data(data)
        .enter()
      .append('line')
        .attr('class', function (d) { return d.party.toLowerCase(); })
        .attr('x1', function (d) { return xScale(d.mean) - ((xScale(d.stdDev / 2) / 4)); })
        .attr('x2', function (d) { return xScale(d.mean) + ((xScale(d.stdDev / 2) / 4)); })
        .attr('y1', function (d, i) {
          return 20 * i;
        })
        .attr('y2', function (d, i) {
          return 20 * i;
        });
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
      case 'Total':
        return 'Zusammenfassung';
    }
  }

  function map(value, fromMin, fromMax, toMin, toMax) {

    return (value - fromMin) / (fromMax - fromMin) * (toMax - toMin) + toMin || toMax - toMin;
  }
})();
