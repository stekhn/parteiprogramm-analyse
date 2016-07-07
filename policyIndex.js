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

      paragraph.fipi.domain.forEach(function (policy) {

        var left = paragraph.fipi.leftright[1].prediction * policy.prediction;
        var right = paragraph.fipi.leftright[0].prediction * policy.prediction;
        var boost = policy.prediction;

        if (result[party][policy.label]) {

          result[party][policy.label].left.push(left);
          result[party][policy.label].right.push(right);
          result[party][policy.label].boost.push(boost);
        } else {

          result[party][policy.label] = {

            left: [left],
            right: [right],
            boost: [boost]
          };
        }
      });
    });
  });

  return result;
}

function aggregate(data) {

  var parties = Object.keys(data);

  parties.forEach(function (party) {

    data[party]['Total'] = {

      left: mergeArrays(data[party], 'left'),
      right: mergeArrays(data[party], 'right'),
      boost: mergeArrays(data[party], 'boost')
    };

    data[party].count = getObjectSum(data[party], 'boost');
  });

  return data;
}

function analyse(data) {

  var result = {};
  var parties = Object.keys(data);

  parties.forEach(function (party) {

    var policies = Object.keys(data[party]);

    policies.forEach(function (policy) {

      if (data[party][policy].hasOwnProperty('boost')) {

        var left = getArraySum(data[party][policy].left);
        var right = getArraySum(data[party][policy].right);
        var boost = getArraySum(data[party][policy].boost);
        var count = data[party].count;
        var percent = boost / count * 100;

        var value = right / boost - left / boost;

        if (!result[policy]) result[policy] = [];

        result[policy].push({

          party: party,
          value: value,
          boost: boost,
          count: count,
          percent: percent
        });
      }
    });
  });

  // console.log(result);
  return result;
}

function getArraySum(arr) {

  return arr.reduce(function (previous, current) {

    return previous + current;
  });
}

function getObjectSum(obj, key) {

  return Object.keys(obj).reduce(function (previous, current) {

    return previous + getArraySum(obj[current][key]);
  }, 0);
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
