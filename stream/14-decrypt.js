/*
To actually be able to unzip anything zipped with the script above, we 
need to use the opposite streams for crypto and zlib in a reverse order, which is simple:
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
// iv = Buffer.from(Array.prototype.map.call(iv, () => {return Math.floor(Math.random() * 256)})); 

// make the key something other than a blank buffer
key = Buffer.concat([Buffer.from("abcdefg")], key.length);

fs.createReadStream(file)
  .pipe(crypto.createDecipheriv('aes-256-cbc', key, iv))
  .pipe(zlib.createGunzip())
  .pipe(reportProgress)
  .pipe(fs.createWriteStream(file + '.decoded'))
  .on('finish', () => console.log('Done'));

