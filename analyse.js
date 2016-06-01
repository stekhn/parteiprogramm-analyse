var fs = require('fs');

(function init() {

  loadFile();
})();

function loadFile() {

  fs.readFile('./data/documents-fipi.json', 'utf8', function (error, result) {

    if (!error) {

      analyseData(JSON.parse(result));
    } else {

      console.log(error);
    }
  });
}

function analyseData(data) {

  var parties = Object.keys(data);

  parties.forEach(function (party) {

    var paragraphs = data[party];

      paragraphs.forEach(function (paragraph) {

        console.log(paragraph.id);
      });
  });
}
