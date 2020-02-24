/*
    What’s great about the pipe method though is that we can use it to compose 
    our program piece by piece, in a much readable way. For example, instead of 
    listening to the data event above, we can simply create a transform stream 
    to report progress, and replace the .on() call with another .pipe() call:
    
    This reportProgress stream is a simple pass-through stream, but it reports the 
    progress to standard out as well. 
    
    Note how I used the second argument in the callback() function to push the data 
    inside the transform() method. This is equivalent to pushing the data first.
*/

const fs = require('fs');
const zlib = require('zlib');
const file = process.argv[2];

const { Transform } = require('stream');

const reportProgress = new Transform({
  transform(chunk, encoding, callback) {
    process.stdout.write('.');
    callback(null, chunk);
  }
});

fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(reportProgress)
  .pipe(fs.createWriteStream(file + '.gz'))
  .on('finish', () => console.log('Done'));


