var fs = require('fs');

(function init() {

  loadFile();
})();

function loadFile() {

  fs.readFile('./data/documents-fipi.json', 'utf8', function (error, result) {

    if (!error) {

      analyse(aggregate(JSON.parse(result)));
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

          // @TODO Calcuations shouldn't be done here
          var left = paragraph.fipi.leftright[0].prediction * policy.prediction;
          var right = paragraph.fipi.leftright[1].prediction * policy.prediction;
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

      var value = left / boost - right / boost;

      if (!result[policy]) result[policy] = [];

      result[policy].push({

        party: party,
        value: value
      });
    });
  });

  return result;
}

function findObject(arr, key, value) {

  for (var i = 0; i < arr.length; i++) {

    if (arr[i][key] === value) {

      return arr[i];
    }
  }

  return null;
}

function getSum(arr) {

  return arr.reduce(function (a, b) {

    return a + b;
  });
}
