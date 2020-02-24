/*
The applications of combining streams are endless. For example, if we need to 
encrypt the file before or after we gzip it, all we need to do is pipe another 
transform stream in that exact order that we needed. We can use Node’s crypto 
module for that:
*/


const crypto = require('crypto');
const fs = require('fs');
const zlib = require('zlib');
const file = process.argv[2];


const { Transform } = require('stream');

let iv = Buffer.alloc(16); // iv should be 16
let key = Buffer.alloc(32);  // key should be 32 bytes

const reportProgress = new Transform({
  transform(chunk, encoding, callback) {
    process.stdout.write('.');
    callback(null, chunk);
  }
});

// randomize the iv, for best results
iv = Buffer.from(Array.prototype.map.call(iv, 
    () => {return Math.floor(Math.random() * 256)})); 

// make the key something other than a blank buffer
key = Buffer.concat([Buffer.from("abcdefg")], key.length);

fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(crypto.createCipheriv('aes-256-cbc', key, iv))
  .pipe(reportProgress)
  .pipe(fs.createWriteStream(file + '.zz'))
  .on('finish', () => console.log('Done'));

