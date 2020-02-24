/* 
    Echo's stdinput to console 
    Run the program: node writable.js
      Input: Enter some text and press return/enter key
*/

const { Writable } = require('stream');

const outStream = new Writable({
  write(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback();
  }
});

process.stdin.pipe(outStream);