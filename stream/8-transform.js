/*
A transform stream is the more interesting duplex stream because its output is 
computed from its input.

For a transform stream, we don’t have to implement the read or write methods,
we only need to implement a transform method, which combines both of them. 
It has the signature of the write method and we can use it to push data as well.

Here’s a simple transform stream which echoes back anything you type into it 
after transforming it to upper case format:

In this transform stream, which we’re consuming exactly like the previous duplex stream 
example, we only implemented a transform() method. In that method, we convert the 
chunk into its upper case version and then push that version as the readable part.

*/

const { Transform } = require('stream');

const upperCaseTr = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

process.stdin.pipe(upperCaseTr).pipe(process.stdout);