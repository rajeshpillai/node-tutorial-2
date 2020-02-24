/*
Node’s built-in transform streams

Node has a few very useful built-in transform streams. Namely, the zlib and crypto streams.

Here’s an example that uses the zlib.createGzip() stream combined with the 
fs readable/writable streams to create a file-compression script:

You can use this script to gzip any file you pass as the argument. We’re piping a 
readable stream for that file into the zlib built-in transform stream and then into a 
writable stream for the new gzipped file. Simple.

The cool thing about using pipes is that we can actually combine them with events 
if we need to. Say, for example, I want the user to see a progress indicator while 
the script is working and a “Done” message when the script is done. 
Since the pipe method returns the destination stream, we can chain the registration 
of events handlers as well:  (refer part 2)

*/

const fs = require('fs');
const zlib = require('zlib');
const file = process.argv[2];

fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream(file + '.gz'));
