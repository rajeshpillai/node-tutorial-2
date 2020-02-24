/*
When we push a null object, that means we want to signal that the stream does not 
have any more data.
To consume this simple readable stream, we can simply pipe it into the writable 
stream process.stdout.
When we run the code above, we’ll be reading all the data from inStream and 
echoing it to the standard out. Very simple, but also not very efficient.

We’re basically pushing all the data in the stream before piping it to 
process.stdout. The much better way is to push data on demand, when a consumer 
asks for it. 

We can do that by implementing the read() method in the configuration object: Check
file 2 for example
*/
const { Readable } = require('stream'); 

const inStream = new Readable({
  read() {}
});

inStream.push('ABCDEFGHIJKLM');
inStream.push('NOPQRSTUVWXYZ');

inStream.push(null); // No more data

inStream.pipe(process.stdout);