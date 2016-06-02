var fs = require('fs');

(function init() {

  loadFile();
})();

function loadFile() {

  fs.readFile('./data/documents-fipi.json', 'utf8', function (error, result) {

    if (!error) {

      aggregate(JSON.parse(result));
    } else {

      console.log(error);
    }
  });
}

function aggregate(data) {

  var results = {};
  var parties = Object.keys(data);

  parties.forEach(function (party) {

    results[party] = {};

    var paragraphs = data[party];

      paragraphs.forEach(function (paragraph) {

        paragraph.fipi.domain.forEach(function (policy) {

          console.log(policy);

          if (results[party][policy.label]) {

            results[party][policy.label].left.push(paragraph.fipi.max_leftrigth);
            results[party][policy.label].right.push(paragraph.fipi.max_leftrigth);
          } else {

            results[party][policy.label] = {};
            results[party][policy.label].left = [paragraph.fipi.leftright[0] * policy.prediction];
            results[party][policy.label].right = [paragraph.fipi.leftright[1] * policy.prediction];
          }
        });
      });
  });

  console.log(results);
}

function findObject(arr, key, value) {

  for (var i = 0; i < arr.length; i++) {

    if (arr[i][key] === value) {

      return arr[i];
    }
  }

  return null;
}
