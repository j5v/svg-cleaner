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
          const fullInFilename = `${e.inputFolder}${filename}`;
          const fullOutFilename = `${e.outputFolder || config.defaultOutputFolder}${filename}`;
          fs.open(fullInFilename, 'r', (err, fd) => {
            if (!err) {
              doFile(fullInFilename, fullOutFilename);
            } else {
              console.log(err);
            }
          });
        }
      }
    }
  });
  console.log(`Watching: ${e.inputFolder}`);
});

// utilities
const doFile = (inFile, outFile) => {
  if (svgFilenameSpec.test(inFile)) {
    console.log(langProcessing, inFile);
    fs.readFile(inFile, function(err, data) {
      fs.writeFile(outFile, stripAttributes(data), 'utf8', (err) => {
        if (err) throw err;
        console.log(`  ${langFinished}`);
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
