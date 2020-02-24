/*
Streams Object Mode

By default, streams expect Buffer/String values. There is an objectMode flag 
that we can set to have the stream accept any JavaScript object.

Here’s a simple example to demonstrate that. The following combination of transform 
streams makes for a feature to map a string of comma-separated values into a 
JavaScript object. So “a,b,c,d” becomes {a: b, c: d}.

We pass the input string (for example, “a,b,c,d”) through commaSplitter which pushes an 
array as its readable data ([“a”, “b”, “c”, “d”]). Adding the readableObjectMode 
flag on that stream is necessary because we’re pushing an object there, not a string.

We then take the array and pipe it into the arrayToObject stream. We need a 
writableObjectMode flag to make that stream accept an object. It’ll also push 
an object (the input array mapped into an object) and that’s why we also needed 
the readableObjectMode flag there as well. The last objectToString stream accepts 
an object but pushes out a string, and that’s why we only needed a 
writableObjectMode flag there. The readable part is a normal string (the stringified object).

*/

const { Transform } = require('stream');

const commaSplitter = new Transform({
  readableObjectMode: true,
  
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().trim().split(','));
    callback();
  }
});

const arrayToObject = new Transform({
  readableObjectMode: true,
  writableObjectMode: true,
  
  transform(chunk, encoding, callback) {
    const obj = {};
    for(let i=0; i < chunk.length; i+=2) {
      obj[chunk[i]] = chunk[i+1];
    }
    this.push(obj);
    callback();
  }
});

const objectToString = new Transform({
  writableObjectMode: true,
  
  transform(chunk, encoding, callback) {
    this.push(JSON.stringify(chunk) + '\n');
    callback();
  }
});

process.stdin
  .pipe(commaSplitter)
  .pipe(arrayToObject)
  .pipe(objectToString)
  .pipe(process.stdout)