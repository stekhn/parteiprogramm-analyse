var fs = require('fs');
var path = require('path');

(function init() {

  loadFile(function (data) {

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

function aggregate(data) {

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

function analyse(data) {

  var result = {};
  var parties = Object.keys(data);

  parties.forEach(function (party) {

    var policies = Object.keys(data[party]);

    policies.forEach(function (policy) {

      var left = getSum(data[party][policy].left);
      var right = getSum(data[party][policy].right);
      var boost = getSum(data[party][policy].boost);

      var value = right / boost - left / boost;

      if (!result[policy]) result[policy] = [];

      result[policy].push({

        party: party,
        value: value,
        left: left,
        right: right,
      });
    });
  });

  console.log(result);
  return result;
}

function getSum(arr) {

  return arr.reduce(function (a, b) {

    return a + b;
  });
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
