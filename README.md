# svg-cleaner

A drop-folder service running in Node, which strips out unwanted attributes from SVG files.

This is a proof-of-concept, and needs work to be more robust and configurable. It is not an XML parser; and may break XML files that have other content that matches the attribute name you wish to remove.

In its current state, it strips `sodipodi`- and `inkscape`-namespaced attributes, which solves the problem I had with my files (Inkscape content in Adobe Illustrator, exported to SVG).

## Usage

* Edit the `svg_clean.config` JSON file. You can include many items in the watchedFolders array. If no `.outputFolder` is specified, it will default to the `.defaultOutputFolder`.
* `node svg_clean.js`

## Todo:

1.  Implement more options in `svg_clean.config`: `watchedFolders[].processExisting` and `.destroyInputFile`
3.  Watch the .config file, and re-initialize on change.
4.  Scan the folder on initial run; fs.watch does not do this.
5.  Unit tests.
6.  Optimisation: ensure all operations are async.
7.  Use array method to remove many attributes.
8.  Use Chokidar?
