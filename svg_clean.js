/** svgClean: removes Inkscape-namespaced attributes from SVG files placed in a watched folder
  Author: John Valentine
  Author-Web: johnvalentine.co.uk
*/

const fs = require('fs');

const svgFilenameSpec = new RegExp(/.+\.svg$/i);

// language strings
const langProcessing = 'Processing:';
const langFinished = 'Finished';

const watchStatuses = {
  NONE: 0,
  INITIALISING: 1,
  STARTED: 2
}

// configuration
const config = JSON.parse(
  fs.readFileSync('svg_clean.config')
);

config.watchedFolders.forEach((e, i) => {
  e.status = watchStatuses.NONE;
  fs.watch(e.inputFolder, {encoding: 'buffer'}, (eventType, filename) => {
    if (filename) {
      switch(eventType) {
        case 'change', 'rename': {
          fs.open(filename, 'r', (err, fd) => {
          if (!err) {
            doFile(filename, e.outputFolder || config.defaultOutputFolder);
          } else {
            console.dir(err);
          }
        });
        }
      }
    }
  });
  console.log(`Watching: ${e.inputFolder}`);
});

// utilities
const doFile = (filename, outFolder) => {
  console.log(svgFilenameSpec.test(filename));
  if (svgFilenameSpec.test(filename)) {
    console.log(langProcessing, filename);
    fs.readFile(filename, function(err, data) {
      const result = stripAttributes(data);
      fs.writeFile(outFolder + filename, result, 'utf8', (err) => {
        if (err) throw err;
        console.log(langFinished, filename);
      });

    });
  }
};

const stripAttributes = (data) => (
  /* TODO: config.removeNamespaces.map() */
  data.toString()
    .replace(/(sodipodi)[^=]*=[^\"]*\"[^\"]*\"/ig, '')
    .replace(/(inkscape)[^=]*=[^\"]*\"[^\"]*\"/ig, '')
    .replace(/  +/g, ' ') /* todo: move to individual 'replace' operations */
);
