// This puts the entire 400 MB file in memory
// BAD:  Not good for performance as we are blocking the thread.


// NOTE:  Connect to the server using
// curl localhost:8000  or http://localhost:8000
// WATCH MEMORY (linux): watch -n 5 free -m

const fs = require('fs');
const server = require('http').createServer();


server.on('request', (req, res) => {
  fs.readFile('./temp/big.file', (err, data) => {
    if (err) throw err;
  
    res.end(data);
  });
});

server.listen(8000);
