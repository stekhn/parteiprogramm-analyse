var fs = require('fs');
var path = require('path');

(function init() {

  loadFile(function (data) {

    data = transform(data);
    data = aggregate(data);
    data = analyse(data);

    saveFile('./output/policy.json', JSON.stringify(data, null, 2));
  });
})();

function loadFile(callback) {

  fs.readFile('./input/documents-fipi.json', 'utf8', function (error, result) {

    if (!error) {

      callback(JSON.parse(result));
    } else {

      console.log(error);
    }
  });
}

function transform(data) {

  var result = {};
  var parties = Object.keys(data);

  parties.forEach(function (party) {

    result[party] = {};

    var paragraphs = data[party];

    paragraphs.forEach(function (paragraph) {

      var policy = paragraph.fipi.max_domain
      var left = paragraph.fipi.leftright[1].prediction;
      var right = paragraph.fipi.leftright[0].prediction;

      // @TODO Refactor
      if (result[party][policy]) {

        result[party][policy].left.push(left);
        result[party][policy].right.push(right);
      } else {

        result[party][policy] = {

          left: [left],
          right: [right],
        };
      }
    });
  });

  return result;
}

function aggregate(data) {

  var parties = Object.keys(data);

  parties.forEach(function (party) {

    data[party]['Total'] = {

      left: mergeArrays(data[party], 'left'),
      right: mergeArrays(data[party], 'right')
    };

    data[party].count = arrayLength(data[party], 'left');
  });

  return data;
}

function analyse(data) {

  var result = {};
  var parties = Object.keys(data);

  parties.forEach(function (party) {

    var policies = Object.keys(data[party]);

    policies.forEach(function (policy) {

      if (data[party][policy].hasOwnProperty('left')) {

        var left = data[party][policy].left;
        var right = data[party][policy].right;

        var values = arrayDifference(left, right);
        var percent = values.length / data[party].count * 100;

        if (!result[policy]) result[policy] = [];

        result[policy].push({

          party: party,
          percent: Math.round(percent * 100) / 100,
          mean: Math.round(mean(values) * 100) / 100,
          median: Math.round(median(values) * 100) / 100,
          stdDev: Math.round(stdDev(values) * 100) / 100
        });
      }
    });
  });

  // console.log(result);
  return result;
}

function arrayDifference(a, b) {

  return a.map(function (value, i) {

    return b[i] - value;
  });
}

function arraySum(arr) {

  return arr.reduce(function (previous, current) {

    return previous + current;
  });
}

function arrayLength(obj, key) {

  return Object.keys(obj).reduce(function (previous, current) {

    return previous + obj[current][key].length;
  }, 0);
}

function mean(arr) {

  return arr.reduce(function (p, c) {

    return p + c;
  }) / arr.length;
}

function median(arr) {

  var middle = Math.floor(arr.length / 2);

  arr.sort(function (a, b) { return a - b; });

  if (arr.length % 2) {

    return arr[middle];
  } else {

    return (arr[middle - 1] + arr[middle]) / 2.0;
  }
}

function stdDev(arr) {

  var squareDiffs = arr.map(function (value) {

    var diff = value - mean(arr);
    var sqrDiff = diff * diff;

    return sqrDiff;
  });

  var variance = mean(squareDiffs);

  return Math.sqrt(variance);
}

function mergeArrays(obj, key) {

  return Object.keys(obj).reduce(function (previous, current) {

    return previous.concat(obj[current][key]);
  }, []);
}

function saveFile(relativePath, string) {

  relativePath = path.normalize(relativePath);

  console.log('Saved file', relativePath);

  try {

    return fs.writeFileSync(relativePath, string, 'utf8');
  } catch (error) {

    console.log(error);
  }
}
