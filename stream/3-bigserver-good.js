/*
    We basically put the whole big.file content in memory before 
    we wrote it out to the response object. This is very 
    inefficient.
    
    The HTTP response object (res in the code above) is also a 
    writable stream. This means if we have a readable stream 
    that represents the content of big.file, we can just pipe 
    those two on each other and achieve mostly the same result 
    without consuming ~400 MB of memory.

    Node’s fs module can give us a readable stream for any file 
    using the createReadStream method. We can pipe that to the 
    response object:
*/

/*
    When a client asks for that big file, we stream it one chunk 
    at a time, which means we don’t buffer it in memory at all. 
    The memory usage grew by about 25 MB and that’s it.
    
    You can push this example to its limits. Regenerate the 
    big.file with five million lines instead of just 
    one million, which would take the file to well over 2 GB, 
    and that’s actually bigger than the default buffer limit 
    in Node.

    If you try to serve that file using fs.readFile, you simply 
    can’t, by default (you can change the limits). But with 
    fs.createReadStream, there is no problem at all streaming 
    2 GB of data to the requester, and best of all, the process 
    memory usage will roughly be the same.
*/

const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  // The default buffer size is 64 KiloBytes 
  // var fStream = fs.createReadStream('/foo/bar', { highWaterMark: 128 * 1024 });
  const src = fs.createReadStream('./temp/big.file');
  src.pipe(res);
});

server.listen(8000);