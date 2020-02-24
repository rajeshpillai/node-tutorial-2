/*
Implementing Duplex/Transform Streams
With Duplex streams, we can implement both readable and writable streams with the 
same object. It’s as if we inherit from both interfaces.

Here’s an example duplex stream that combines the two writable and readable examples 
implemented above:

By combining the methods, we can use this duplex stream to read the letters 
from A to Z and we can also use it for its echo feature. We pipe the readable 
stdin stream into this duplex stream to use the echo feature and we pipe 
the duplex stream itself into the writable stdout stream to see the letters A through Z.

It’s important to understand that the readable and writable sides of a duplex 
stream operate completely independently from one another. This is merely a 
grouping of two features into an object.
*/

const { Duplex } = require('stream');

const inoutStream = new Duplex({
  write(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback();
  },

  read(size) {
    this.push(String.fromCharCode(this.currentCharCode++));
    if (this.currentCharCode > 90) {
      this.push(null);
    }
  }
});

inoutStream.currentCharCode = 65;

process.stdin.pipe(inoutStream).pipe(process.stdout);

